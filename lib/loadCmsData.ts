import { Concept, Video, Question } from '@/types';
import { StrapiResponse } from '@/lib/strapi/strapiClient';
import { getStrapiIdForSubtopic } from '@/lib/strapiIdMapping';

/**
 * Fetch videos from Strapi for a given subtopic (via server-side API route)
 */
export const fetchVideosForSubtopic = async (
  subtopicId: number | string
): Promise<Video[]> => {
  try {
    const response = await fetch(
      `/api/cms/videos?subtopicId=${encodeURIComponent(subtopicId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error(
        `API request failed for videos: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as StrapiResponse<any[]>;
    if (!data.data || !Array.isArray(data.data)) {
      console.warn(`No videos found for subtopic ${subtopicId}`);
      return [];
    }

    // Strapi v4 response has fields directly on the object (no attributes wrapper)
    return data.data.map((video: any, index: number) => ({
      id: `video-${video.id}`,
      title: video.title || `Video ${index + 1}`,
      url: video.video_url || '',
      duration: video.duration || undefined,
      watched: false,
      order: index,
    }));
  } catch (error) {
    console.error(`Error fetching videos for subtopic ${subtopicId}:`, error);
    return [];
  }
};

/**
 * Fetch quizzes from Strapi for a given subtopic (via server-side API route)
 */
export const fetchQuizzesForSubtopic = async (
  subtopicId: number | string
): Promise<Question[]> => {
  try {
    const response = await fetch(
      `/api/cms/quizzes?subtopicId=${encodeURIComponent(subtopicId)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error(
        `API request failed for quizzes: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = (await response.json()) as StrapiResponse<any[]>;
    if (!data.data || !Array.isArray(data.data)) {
      console.warn(`No quizzes found for subtopic ${subtopicId}`);
      return [];
    }

    // Flatten all questions from all quizzes for the subtopic
    // Strapi v4 response has fields directly on the object (no attributes wrapper)
    const allQuestions: Question[] = [];
    data.data.forEach((quiz: any) => {
      const questions = quiz.questions || [];
      questions.forEach((q: any, index: number) => {
        allQuestions.push({
          id: `question-${quiz.id}-${index}`,
          question: q.question || '',
          options: [
            q.optionA || '',
            q.optionB || '',
            q.optionC || '',
            q.optionD || '',
          ],
          correctAnswer: ['A', 'B', 'C', 'D'].indexOf(
            q.correctOption || 'A'
          ),
          explanation: q.explanation || undefined,
        });
      });
    });

    return allQuestions;
  } catch (error) {
    console.error(`Error fetching quizzes for subtopic ${subtopicId}:`, error);
    return [];
  }
};

/**
 * Populate videos and quizzes for all concepts from Strapi
 * This is called during store initialization
 * 
 * Structure: Concept → Topics → Subtopics
 * Videos/Quizzes are fetched for each subtopic from Strapi
 */
export const enrichConceptsWithCmsData = async (
  concepts: Concept[]
): Promise<Concept[]> => {
  try {
    const enrichedConcepts = await Promise.all(
      concepts.map(async (concept) => {
        let allVideos: Video[] = [];
        let allQuestions: Question[] = [];

        // Iterate through all topics and subtopics
        if (concept.topics && concept.topics.length > 0) {
          // For now, fetch videos from the first subtopic of the first topic
          // as a placeholder for concept-level videos
          const firstTopic = concept.topics[0];
          const firstSubtopic = firstTopic.subtopics[0];

          if (firstSubtopic) {
            // Get the Strapi numeric ID for this subtopic
            const strapiId = getStrapiIdForSubtopic(firstSubtopic.id);

            if (strapiId > 0) {
              // Fetch using Strapi numeric ID
              const videos = await fetchVideosForSubtopic(strapiId);
              allVideos = videos;

              // Fetch questions from first subtopic
              const questions = await fetchQuizzesForSubtopic(strapiId);
              allQuestions = questions;
            } else {
              console.warn(
                `No Strapi ID mapping found for subtopic ${firstSubtopic.id}. ` +
                `Please update lib/strapiIdMapping.ts with the correct Strapi numeric ID.`
              );
            }
          }
        }

        return {
          ...concept,
          videos: allVideos,
          quiz: {
            ...concept.quiz,
            questions: allQuestions,
          },
        };
      })
    );

    return enrichedConcepts;
  } catch (error) {
    console.error('Error enriching concepts with CMS data:', error);
    return concepts;
  }
};
