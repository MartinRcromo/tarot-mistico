import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAuthError, unauthorizedResponse } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (isAuthError(auth)) return unauthorizedResponse(auth);

    const body = await request.json();
    const { consultation_id } = body;

    if (!consultation_id) {
      return NextResponse.json({ error: 'consultation_id is required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verificar que la consulta existe y pertenece al usuario
    const { data: consultation, error: fetchError } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', consultation_id)
      .eq('user_id', auth.user.id)
      .single();

    if (fetchError || !consultation) {
      return NextResponse.json({ error: 'Consulta no encontrada' }, { status: 404 });
    }

    if (consultation.status !== 'scheduled') {
      return NextResponse.json({ error: 'Solo se pueden cancelar consultas agendadas' }, { status: 400 });
    }

    // Cancelar la consulta
    const { error: updateError } = await supabase
      .from('consultations')
      .update({ status: 'canceled' })
      .eq('id', consultation_id);

    if (updateError) {
      console.error('ConsultationCancel: Update error', updateError.message);
      return NextResponse.json({ error: 'Failed to cancel consultation' }, { status: 500 });
    }

    // Devolver la consulta semanal al usuario
    await supabase
      .from('profiles')
      .update({ weekly_consultation_used: false })
      .eq('id', auth.user.id);

    console.log('ConsultationCancel: Canceled consultation', consultation_id, 'for user', auth.user.id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('ConsultationCancel: Unexpected error', err);
    return NextResponse.json({ error: 'Failed to cancel consultation' }, { status: 500 });
  }
}
