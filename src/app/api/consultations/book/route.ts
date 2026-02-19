import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAuthError, unauthorizedResponse } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (isAuthError(auth)) return unauthorizedResponse(auth);

    const body = await request.json();
    const { calendly_event_uri, scheduled_at, google_meet_url } = body;

    if (!scheduled_at) {
      return NextResponse.json({ error: 'scheduled_at is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verificar que el usuario es Pro
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, weekly_consultation_used, weekly_consultation_reset_at')
      .eq('id', auth.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    if (profile.subscription_status !== 'pro') {
      console.log('ConsultationBook: User is not Pro', auth.user.id);
      return NextResponse.json({ error: 'Se requiere plan Pro para agendar consultas' }, { status: 403 });
    }

    // Verificar reset semanal
    let weeklyUsed = profile.weekly_consultation_used;
    if (profile.weekly_consultation_reset_at) {
      const now = new Date();
      const resetAt = new Date(profile.weekly_consultation_reset_at);
      if (now > resetAt) {
        await supabase
          .from('profiles')
          .update({
            weekly_consultation_used: false,
            weekly_consultation_reset_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('id', auth.user.id);
        weeklyUsed = false;
      }
    }

    if (weeklyUsed) {
      console.log('ConsultationBook: Weekly consultation already used', auth.user.id);
      return NextResponse.json({ error: 'Ya usaste tu consulta semanal' }, { status: 403 });
    }

    // Crear la consulta
    const { data: consultation, error: insertError } = await supabase
      .from('consultations')
      .insert({
        user_id: auth.user.id,
        calendly_event_uri: calendly_event_uri || null,
        scheduled_at,
        google_meet_url: google_meet_url || null,
        status: 'scheduled',
      })
      .select()
      .single();

    if (insertError) {
      console.error('ConsultationBook: Insert error', insertError.message);
      return NextResponse.json({ error: 'Failed to create consultation' }, { status: 500 });
    }

    // Marcar weekly_consultation_used = true
    await supabase
      .from('profiles')
      .update({ weekly_consultation_used: true })
      .eq('id', auth.user.id);

    console.log('ConsultationBook: Booked for user', auth.user.id);
    return NextResponse.json({ consultation });
  } catch (err) {
    console.error('ConsultationBook: Unexpected error', err);
    return NextResponse.json({ error: 'Failed to book consultation' }, { status: 500 });
  }
}
