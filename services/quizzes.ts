import { strapiFetch, StrapiResponse } from '@/lib/strapi/strapiClient';
import { Quiz } from '@/lib/strapi/types';

const QUIZZES_ENDPOINT = '/api/quizzes';

interface QuizParams {
  subtopic?: number | string;
  populate?: string;
  [key: string]: string | number | undefined;
}

export const getQuizzes = (params?: QuizParams) => {
  const filters: Record<string, any> = {};
  
  if (params?.subtopic) {
    filters['filters[subtopic][id][$eq]'] = params.subtopic;
  }

  return strapiFetch<StrapiResponse<Quiz[]>>(QUIZZES_ENDPOINT, {
    params: {
      populate: '*',
      ...filters,
    },
  });
};

