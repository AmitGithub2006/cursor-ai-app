import { strapiFetch, StrapiResponse } from '@/lib/strapi/strapiClient';
import type { Course, Topic, Subtopic, Video, Quiz } from '@/lib/strapi/types';

const populateAll = { populate: '*' };

export const courseService = {
  getCourses: () => strapiFetch<StrapiResponse<Course[]>>('/api/courses', { params: populateAll }),
  getCourseById: (id: number | string) =>
    strapiFetch<StrapiResponse<Course>>(`/api/courses/${id}`, { params: populateAll }),
  getTopicsByCourse: (courseId: number | string) =>
    strapiFetch<StrapiResponse<Topic[]>>('/api/topics', {
      params: { ...populateAll, 'filters[course][id][$eq]': courseId },
    }),
  getSubtopicsByTopic: (topicId: number | string) =>
    strapiFetch<StrapiResponse<Subtopic[]>>('/api/subtopics', {
      params: { ...populateAll, 'filters[topic][id][$eq]': topicId },
    }),
  getVideosBySubtopic: (subtopicId: number | string) =>
    strapiFetch<StrapiResponse<Video[]>>('/api/videos', {
      params: { ...populateAll, 'filters[subtopic][id][$eq]': subtopicId },
    }),
  getQuizzesBySubtopic: (subtopicId: number | string) =>
    strapiFetch<StrapiResponse<Quiz[]>>('/api/quizzes', {
      params: { ...populateAll, 'filters[subtopic][id][$eq]': subtopicId },
    }),
};

