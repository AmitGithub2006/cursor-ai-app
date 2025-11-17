import { strapiFetch, StrapiResponse } from '@/lib/strapi/strapiClient';
import { Topic } from '@/lib/strapi/types';

const TOPICS_ENDPOINT = '/api/topics';

interface TopicParams {
  course?: number | string;
  populate?: string;
  [key: string]: string | number | undefined;
}

export const getTopics = (params?: TopicParams) => {
  const filters: Record<string, any> = {};
  
  if (params?.course) {
    filters['filters[course][id][$eq]'] = params.course;
  }

  return strapiFetch<StrapiResponse<Topic[]>>(TOPICS_ENDPOINT, {
    params: {
      populate: '*',
      ...filters,
    },
  });
};

