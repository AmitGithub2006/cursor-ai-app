import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const accessToken = searchParams.get('accessToken');
    const courseId = searchParams.get('courseId');

    if (!accessToken) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 400 });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    const classroom = google.classroom({ version: 'v1', auth });

    // 1️⃣ Fetch active courses
    const courseRes = await classroom.courses.list({
      courseStates: ['ACTIVE'],
      teacherId: 'me', // Works for teacher accounts
    });

    let courses = courseRes.data.courses || [];

    // 2️⃣ If no courses found, try student perspective
    if (courses.length === 0) {
      const studentRes = await classroom.courses.list({
        studentId: 'me',
        courseStates: ['ACTIVE'],
      });
      courses = studentRes.data.courses || [];
    }

    // 3️⃣ Fetch assignments from each course
    let assignments: any[] = [];

    for (const course of courses) {
      if (!course.id) continue; // skip if no id
      const workRes = await classroom.courses.courseWork.list({
        courseId: course.id as string,
      });
      if (workRes.data && workRes.data.courseWork) {
        assignments = assignments.concat(workRes.data.courseWork);
      }
    }
    return NextResponse.json({
      success: true,
      courses,
      assignments,
    });
  } catch (error: any) {
    console.error('Classroom Sync Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch classroom data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, accessToken, courseId, assignmentId } = body;

  if (action === 'sync-progress') {
    try {
      const auth = new google.auth.OAuth2();
      auth.setCredentials({ access_token: accessToken });
      const classroom = google.classroom({ version: 'v1', auth });

      await classroom.courses.courseWork.studentSubmissions.patch({
        courseId,
        courseWorkId: assignmentId,
        id: 'me',
        requestBody: { state: 'TURNED_IN' },
      });

      return NextResponse.json({
        success: true,
        message: 'Progress synced to Google Classroom',
      });
    } catch (error: any) {
      console.error('Sync error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to sync progress' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}