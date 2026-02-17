import { NextRequest, NextResponse } from 'next/server';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';
import { authenticateRequest, isAuthError } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadType, count, question } = body;

    // Authenticate user
    const auth = await authenticateRequest(request);

    if (isAuthError(auth)) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const supabase = createServerClient();

    // Fetch user profile to check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_remaining, subscription_status, credits_reset_at')
      .eq('id', auth.user.id)
      .single();

    if (profileError || !profile) {
      console.error('Draw: Failed to fetch profile', profileError?.message);
      return NextResponse.json(
        { error: 'Failed to verify user credits' },
        { status: 500 }
      );
    }

    const isPremiumOrPro = profile.subscription_status === 'premium' || profile.subscription_status === 'pro';

    // Check if credits_reset_at has passed and reset if needed
    const now = new Date();
    const resetAt = new Date(profile.credits_reset_at);
    let creditsRemaining = profile.credits_remaining;

    if (now > resetAt && !isPremiumOrPro) {
      const { data: updated, error: resetError } = await supabase
        .from('profiles')
        .update({
          credits_remaining: 5,
          credits_reset_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', auth.user.id)
        .select('credits_remaining')
        .single();

      if (!resetError && updated) {
        creditsRemaining = updated.credits_remaining;
        console.log('Draw: Credits reset for user', auth.user.id);
      }
    }

    // If free user with no credits, deny access
    if (!isPremiumOrPro && creditsRemaining <= 0) {
      console.log('Draw: No credits remaining for user', auth.user.id);
      return NextResponse.json(
        { error: 'No credits remaining', upgradeUrl: '/upgrade' },
        { status: 403 }
      );
    }

    // Draw cards
    let cardCount = count;

    if (spreadType) {
      const spread = spreads.find(s => s.id === spreadType);
      if (spread) cardCount = spread.cardCount;
    }

    if (!cardCount || cardCount < 1 || cardCount > 78) {
      return NextResponse.json({ error: 'Invalid card count' }, { status: 400 });
    }

    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);
    const drawnCards = shuffledCards.slice(0, cardCount).map((card, index) => ({
      cardId: card.id,
      position: index + 1,
      isReversed: Math.random() < 0.15,
    }));

    // Deduct 1 credit for free users
    if (!isPremiumOrPro) {
      const { error: deductError } = await supabase
        .from('profiles')
        .update({ credits_remaining: creditsRemaining - 1 })
        .eq('id', auth.user.id);

      if (deductError) {
        console.error('Draw: Failed to deduct credit', deductError.message);
      } else {
        console.log('Draw: Credit deducted for user', auth.user.id, 'remaining:', creditsRemaining - 1);
      }
    }

    // Save reading to database
    const { error: readingError } = await supabase
      .from('readings')
      .insert({
        user_id: auth.user.id,
        spread_type: spreadType || 'custom',
        cards: drawnCards,
        question: question || null,
      });

    if (readingError) {
      console.error('Draw: Failed to save reading', readingError.message);
      // Don't fail the request if saving fails - user already got their cards
    } else {
      console.log('Draw: Reading saved for user', auth.user.id);
    }

    return NextResponse.json({
      cards: drawnCards,
      spreadType: spreadType || 'custom',
      credits_remaining: isPremiumOrPro ? null : creditsRemaining - 1,
    });
  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json({ error: 'Failed to draw cards' }, { status: 500 });
  }
}
