import { strapiFetch, StrapiResponse } from '@/lib/strapi/strapiClient';
import { Video } from '@/lib/strapi/types';

const VIDEOS_ENDPOINT = '/api/videos';

interface VideoParams {
  subtopic?: number | string;
  populate?: string;
  [key: string]: string | number | undefined;
}

export const getVideos = (params?: VideoParams) => {
  const filters: Record<string, any> = {};
  
  if (params?.subtopic) {
    filters['filters[subtopic][id][$eq]'] = params.subtopic;
  }

  return strapiFetch<StrapiResponse<Video[]>>(VIDEOS_ENDPOINT, {
    params: {
      populate: '*',
      ...filters,
    },
  });
};

