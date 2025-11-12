import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // encoded returnUrl

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/callback`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(
        new URL('/?error=missing_credentials', request.url)
      );
    }

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
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(tokens.error)}`, request.url)
      );
    }

    // Store tokens in httpOnly cookies for security
    const cookieStore = await cookies();
    cookieStore.set('google_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    if (tokens.refresh_token) {
      cookieStore.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    // Redirect to the original page (state) or home
    const returnPath = state ? decodeURIComponent(state) : '/?success=authenticated';
    const dest = new URL(returnPath.startsWith('/') ? returnPath : `/${returnPath}`, request.url);
    // Attach success flag to trigger client-side sync if needed
    if (!dest.searchParams.has('success')) {
      dest.searchParams.set('success', 'authenticated');
    }
    return NextResponse.redirect(dest);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/?error=authentication_failed', request.url)
    );
  }
}

