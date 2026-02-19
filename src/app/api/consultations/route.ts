import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, isAuthError, unauthorizedResponse } from '@/lib/auth-middleware';
import { createServerClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (isAuthError(auth)) return unauthorizedResponse(auth);

    const supabase = createServerClient();

    const { data: consultations, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('scheduled_at', { ascending: false });

    if (error) {
      console.error('Consultations: Fetch error', error.message);
      return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
    }

    console.log('Consultations: Fetched', consultations?.length, 'for user', auth.user.id);
    return NextResponse.json({ consultations: consultations || [] });
  } catch (err) {
    console.error('Consultations: Unexpected error', err);
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}
