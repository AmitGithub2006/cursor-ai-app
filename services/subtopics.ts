import { strapiFetch, StrapiResponse } from '@/lib/strapi/strapiClient';
import { Subtopic } from '@/lib/strapi/types';

const SUBTOPICS_ENDPOINT = '/api/subtopics';

interface SubtopicParams {
  topic?: number | string;
  populate?: string;
  [key: string]: string | number | undefined;
}

export const getSubtopics = (params?: SubtopicParams) => {
  const filters: Record<string, any> = {};
  
  if (params?.topic) {
    filters['filters[topic][id][$eq]'] = params.topic;
  }

  return strapiFetch<StrapiResponse<Subtopic[]>>(SUBTOPICS_ENDPOINT, {
    params: {
      populate: '*',
      ...filters,
    },
  });
};

