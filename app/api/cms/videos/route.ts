import { getVideos } from '@/services/videos';

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

    const response = await getVideos({
      subtopic: subtopicId,
    });

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return Response.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}
