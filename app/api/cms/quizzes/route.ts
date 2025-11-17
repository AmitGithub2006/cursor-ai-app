import { getQuizzes } from '@/services/quizzes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subtopicId = searchParams.get('subtopicId');

    if (!subtopicId) {
      return Response.json(
        { error: 'subtopicId is required' },
        { status: 400 }
      );
    }

    const response = await getQuizzes({
      subtopic: subtopicId,
    });

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return Response.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
