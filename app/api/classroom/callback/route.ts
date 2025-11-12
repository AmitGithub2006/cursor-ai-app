import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// OAuth callback handler for Google Classroom
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // optional return path

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    // Exchange authorization code for access token
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/classroom/callback';

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(tokens.error)}`, request.url));
    }

    // Store tokens via httpOnly cookies (align with /api/auth/callback)
    const cookieStore = await cookies();
    if (tokens.access_token) {
      cookieStore.set('google_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }
    if (tokens.refresh_token) {
      cookieStore.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    // Redirect back to the requested page if provided
    const returnPath = state ? decodeURIComponent(state) : '/?success=authenticated';
    const dest = new URL(returnPath.startsWith('/') ? returnPath : `/${returnPath}`, request.url);
    if (!dest.searchParams.has('success')) {
      dest.searchParams.set('success', 'authenticated');
    }
    return NextResponse.redirect(dest);
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent('Authentication failed')}`,
        request.url
      )
    );
  }
}

