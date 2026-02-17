import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAuthError, unauthorizedResponse } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);

    if (isAuthError(auth)) {
      return unauthorizedResponse(auth);
    }

    const supabase = createServerClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits_remaining, credits_reset_at, subscription_status')
      .eq('id', auth.user.id)
      .single();

    if (error || !profile) {
      console.error('Credits fetch error:', error?.message);
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      );
    }

    // If credits_reset_at has passed, reset credits to 5 and set new reset date
    const now = new Date();
    const resetAt = new Date(profile.credits_reset_at);

    if (now > resetAt) {
      console.log('Credits expired for user, resetting:', auth.user.id);

      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({
          credits_remaining: 5,
          credits_reset_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', auth.user.id)
        .select('credits_remaining, credits_reset_at, subscription_status')
        .single();

      if (updateError || !updated) {
        console.error('Credits reset error:', updateError?.message);
        return NextResponse.json(
          { error: 'Failed to reset credits' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        credits_remaining: updated.credits_remaining,
        subscription_status: updated.subscription_status,
        is_premium: updated.subscription_status !== 'free',
      });
    }

    console.log('Credits fetched for user:', auth.user.id);
    return NextResponse.json({
      credits_remaining: profile.credits_remaining,
      subscription_status: profile.subscription_status,
      is_premium: profile.subscription_status !== 'free',
    });
  } catch (err) {
    console.error('Credits unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
