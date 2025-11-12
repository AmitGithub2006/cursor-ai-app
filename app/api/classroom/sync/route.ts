import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('google_access_token')?.value;
  const refreshToken = cookieStore.get('google_refresh_token')?.value;

  if (accessToken) {
    return accessToken;
  }

  // If no access token but we have refresh token, refresh it
  if (refreshToken) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return null;
      }

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
        }),
      });

      const tokens = await tokenResponse.json();

      if (tokens.access_token) {
        cookieStore.set('google_access_token', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });
        return tokens.access_token;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated. Please sign in with Google.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const conceptId = searchParams.get('conceptId');

    const fetchWithToken = async (url: string, token: string) => {
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    };

    // 🟢 1️⃣ Try fetching courses as a TEACHER first
    let coursesResponse = await fetchWithToken(
      'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&teacherId=me',
      accessToken
    );

    let coursesData = await coursesResponse.json();
    let courses = coursesData.courses || [];

    // 🔵 2️⃣ If no teacher courses, try as a STUDENT
    if (!courses.length) {
      const studentResponse = await fetchWithToken(
        'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE&studentId=me',
        accessToken
      );
      const studentData = await studentResponse.json();
      courses = studentData.courses || [];
    }

    // 🟡 3️⃣ Fetch assignments for all active courses
let assignments: any[] = [];

for (const course of courses) {
  if (!course.id) continue;

  const cwResponse = await fetchWithToken(
    `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`,
    accessToken
  );

  if (!cwResponse.ok) continue;

  const cwData = await cwResponse.json();
  const coursework = cwData.courseWork || [];

  for (const cw of coursework) {
    try {
      const submissionsResponse = await fetchWithToken(
        `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork/${cw.id}/studentSubmissions?userId=me`,
        accessToken
      );

      const submissionsData = await submissionsResponse.json();
      const submission = submissionsData.studentSubmissions?.[0];

      assignments.push({
        id: cw.id,
        title: cw.title,
        dueDate: cw.dueDate,
        maxPoints: cw.maxPoints,
        state: submission?.state || 'NEW',
        assignedGrade: submission?.assignedGrade,
        draftGrade: submission?.draftGrade,
        courseId: course.id,
      });
    } catch {
      assignments.push({
        id: cw.id,
        title: cw.title,
        dueDate: cw.dueDate,
        maxPoints: cw.maxPoints,
        state: 'NEW',
        courseId: course.id,
      });
    }
  }
}

    return NextResponse.json({
      success: true,
      courses,
      assignments,
      conceptId,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync with Google Classroom' },
      { status: 500 }
    );
  }
}