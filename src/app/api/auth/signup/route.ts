import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name || '' },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.log('User signed up:', data.user?.id);

    return NextResponse.json({
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error('Signup unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
