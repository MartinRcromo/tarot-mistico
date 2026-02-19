import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAuthError, unauthorizedResponse } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

const CALENDLY_URL = 'https://calendly.com/martincromosol/regresion-a-vidas-pasadas-sesion-individual';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (isAuthError(auth)) return unauthorizedResponse(auth);

    const supabase = createServerClient();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, weekly_consultation_used, weekly_consultation_reset_at')
      .eq('id', auth.user.id)
      .single();

    if (profileError || !profile) {
      console.error('ConsultationStatus: Failed to fetch profile', profileError?.message);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    const isPro = profile.subscription_status === 'pro';

    // Si weekly_consultation_reset_at ya pasó, resetear
    let weeklyUsed = profile.weekly_consultation_used;
    let weeklyResetAt = profile.weekly_consultation_reset_at;

    if (isPro && weeklyResetAt) {
      const now = new Date();
      const resetAt = new Date(weeklyResetAt);

      if (now > resetAt) {
        const newResetAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            weekly_consultation_used: false,
            weekly_consultation_reset_at: newResetAt,
          })
          .eq('id', auth.user.id);

        if (!updateError) {
          weeklyUsed = false;
          weeklyResetAt = newResetAt;
          console.log('ConsultationStatus: Weekly consultation reset for', auth.user.id);
        }
      }
    }

    // Obtener próxima consulta agendada
    let nextConsultation = null;
    if (isPro) {
      const { data: consultation } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', auth.user.id)
        .eq('status', 'scheduled')
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();

      nextConsultation = consultation || null;
    }

    console.log('ConsultationStatus: Fetched for user', auth.user.id);
    return NextResponse.json({
      isPro,
      weeklyConsultationUsed: weeklyUsed ?? false,
      weeklyConsultationResetAt: weeklyResetAt,
      nextConsultation,
      calendlyUrl: CALENDLY_URL,
    });
  } catch (err) {
    console.error('ConsultationStatus: Unexpected error', err);
    return NextResponse.json({ error: 'Failed to fetch consultation status' }, { status: 500 });
  }
}
