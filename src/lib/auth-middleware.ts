import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthResult {
  user: User;
  accessToken: string;
}

interface AuthError {
  error: string;
  status: number;
}

export async function authenticateRequest(
  request: NextRequest
): Promise<AuthResult | AuthError> {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Auth middleware: Missing or invalid Authorization header');
      return { error: 'Missing or invalid Authorization header', status: 401 };
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createServerClient();

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      console.log('Auth middleware: Invalid or expired token', error?.message);
      return { error: 'Invalid or expired token', status: 401 };
    }

    console.log('Auth middleware: Authenticated user', data.user.id);
    return { user: data.user, accessToken: token };
  } catch (err) {
    console.error('Auth middleware: Unexpected error', err);
    return { error: 'Authentication failed', status: 500 };
  }
}

export function isAuthError(result: AuthResult | AuthError): result is AuthError {
  return 'error' in result;
}

export function unauthorizedResponse(authError: AuthError): NextResponse {
  return NextResponse.json(
    { error: authError.error },
    { status: authError.status }
  );
}
