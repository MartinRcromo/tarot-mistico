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
      .select('*')
      .eq('id', auth.user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error.message);
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    console.log('Profile fetched for user:', auth.user.id);
    return NextResponse.json({ profile });
  } catch (err) {
    console.error('Profile unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
