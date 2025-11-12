import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${request.nextUrl.origin}/api/auth/callback`;
  
  // Check if client ID is missing or still has placeholder value
  if (!clientId || clientId.includes('your_google_client_id') || clientId.trim() === '') {
    return NextResponse.json(
      { 
        error: 'Google Client ID not configured correctly. Please set GOOGLE_CLIENT_ID in your .env.local file with your actual Google OAuth Client ID from Google Cloud Console.',
        hint: 'The value should look like: 123456789-abcdefghijklmnop.apps.googleusercontent.com'
      },
      { status: 500 }
    );
  }

  // Validate client ID format (should contain .apps.googleusercontent.com)
  if (!clientId.includes('.apps.googleusercontent.com')) {
    return NextResponse.json(
      { 
        error: 'Invalid Google Client ID format. The Client ID should end with .apps.googleusercontent.com',
        hint: 'Get your Client ID from: Google Cloud Console > APIs & Services > Credentials'
      },
      { status: 500 }
    );
  }

  // Ensure redirect URI is properly formatted
  const normalizedRedirectUri = redirectUri.trim();

  const scope = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.coursework.students.readonly'
  ].join(' ');  

  // Optional return URL (where to send the user back after login)
  const returnUrl = request.nextUrl.searchParams.get('returnUrl') || '/';

  // Build OAuth URL with proper encoding
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', normalizedRedirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  // Pass return path via OAuth state
  authUrl.searchParams.set('state', encodeURIComponent(returnUrl));

  return NextResponse.json({ 
    authUrl: authUrl.toString(),
    redirectUri: normalizedRedirectUri // For debugging
  });
}

