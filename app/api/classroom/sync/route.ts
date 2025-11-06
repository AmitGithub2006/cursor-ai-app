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

    // Fetch user's courses
    const coursesResponse = await fetch(
      'https://classroom.googleapis.com/v1/courses?studentId=me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!coursesResponse.ok) {
      throw new Error('Failed to fetch courses');
    }

    const coursesData = await coursesResponse.json();
    const courses = coursesData.courses || [];

    // If courseId provided, fetch coursework for that course
    if (courseId) {
      const courseworkResponse = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork?courseWorkStates=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!courseworkResponse.ok) {
        throw new Error('Failed to fetch coursework');
      }

      const courseworkData = await courseworkResponse.json();
      const coursework = courseworkData.courseWork || [];

      // Fetch student submissions for each coursework
      const assignmentsWithStatus = await Promise.all(
        coursework.map(async (cw: any) => {
          try {
            const submissionsResponse = await fetch(
              `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${cw.id}/studentSubmissions?userId=me`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (submissionsResponse.ok) {
              const submissionsData = await submissionsResponse.json();
              const submissions = submissionsData.studentSubmissions || [];
              const submission = submissions[0];

              return {
                id: cw.id,
                title: cw.title,
                dueDate: cw.dueDate,
                maxPoints: cw.maxPoints,
                state: submission?.state || 'NEW',
                assignedGrade: submission?.assignedGrade,
                draftGrade: submission?.draftGrade,
                courseId: courseId,
              };
            }
          } catch (error) {
            console.error(`Error fetching submission for ${cw.id}:`, error);
          }

          return {
            id: cw.id,
            title: cw.title,
            dueDate: cw.dueDate,
            maxPoints: cw.maxPoints,
            state: 'NEW',
            courseId: courseId,
          };
        })
      );

      return NextResponse.json({
        success: true,
        courses,
        assignments: assignmentsWithStatus,
        conceptId,
      });
    }

    // Return all courses without specific coursework
    return NextResponse.json({
      success: true,
      courses,
      assignments: [],
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync with Google Classroom' },
      { status: 500 }
    );
  }
}

