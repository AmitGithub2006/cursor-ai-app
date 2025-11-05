import { NextRequest, NextResponse } from 'next/server';

// OAuth callback handler for Google Classroom
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

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
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(tokens.error)}`, request.url)
      );
    }

    // In production, store tokens securely (e.g., in database, encrypted session)
    // For now, redirect with token in URL (NOT SECURE - for demo only)
    return NextResponse.redirect(
      new URL(`/?token=${encodeURIComponent(tokens.access_token)}`, request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/?error=${encodeURIComponent('Authentication failed')}`,
        request.url
      )
    );
  }
}

