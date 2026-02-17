import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing Authorization header' },
        { status: 401 }
      );
    }

    const supabase = createServerClient();

    // Sign out the user (invalidates their session server-side)
    const { error } = await supabase.auth.admin.signOut(
      authHeader.replace('Bearer ', '')
    );

    if (error) {
      console.error('Logout error:', error.message);
      // Even if server-side signout fails, tell client to clear their token
      return NextResponse.json({ success: true });
    }

    console.log('User logged out successfully');
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to log out' },
      { status: 500 }
    );
  }
}
