'use client';

import { useState, useMemo } from 'react';
import { useStrapi } from '@/hooks/useStrapi';
import type { Course, Topic, Subtopic, Video as StrapiVideo, Quiz } from '@/lib/strapi/types';
import { Video } from '@/types';
import { CourseList } from '@/components/CourseList';
import { TopicList } from '@/components/TopicList';
import { SubtopicList } from '@/components/SubtopicList';
import { VideoPlayer } from '@/components/VideoPlayer';
import { StrapiQuiz } from '@/components/StrapiQuiz';

export default function CoursesPage() {
  const { data, loading, error } = useStrapi<Course[]>('/api/courses');
  const courses = data?.data || [];

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const topics = useMemo(() => selectedCourse?.attributes.topics?.data || [], [selectedCourse]);
  const subtopics = useMemo(() => selectedTopic?.attributes.subtopics?.data || [], [selectedTopic]);
  const activeQuiz: Quiz | null = useMemo(
    () => selectedSubtopic?.attributes.quizzes?.data?.[0] || null,
    [selectedSubtopic]
  );

  // Helper to convert Strapi video to app video
  const convertStrapiVideoToAppVideo = (strapiVideo: StrapiVideo | null): Video | null => {
    if (!strapiVideo) return null;
    return {
      id: `video-${strapiVideo.id}`,
      title: strapiVideo.attributes.title,
      url: strapiVideo.attributes.video_url,
      duration: undefined,
      watched: false,
      order: 0,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10">
      <div className="container mx-auto px-4 space-y-8">
        <header className="text-center space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-green-600">Strapi CMS</p>
          <h1 className="text-4xl font-extrabold text-green-900">Cooking & Nutrition Curriculum</h1>
          <p className="text-lg text-green-800">
            Browse courses, drill into topics, explore subtopics, and watch videos powered by Strapi.
          </p>
        </header>

        {loading && (
          <div className="text-center text-green-700 font-medium">Loading courses from Strapi...</div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold">
            Failed to load courses: {error.message}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-4 space-y-4">
              <h2 className="text-2xl font-bold text-green-900">Courses</h2>
              <CourseList
                courses={courses}
                onSelectCourse={(course) => {
                  setSelectedCourse(course);
                  setSelectedTopic(null);
                  setSelectedSubtopic(null);
                  setSelectedVideo(null);
                }}
                onSelectTopic={(topic) => {
                  setSelectedTopic(topic);
                  setSelectedSubtopic(null);
                  setSelectedVideo(null);
                }}
              />
            </section>

            <section className="xl:col-span-4 space-y-4">
              <h2 className="text-2xl font-bold text-green-900">Topics</h2>
              <TopicList
                topics={topics}
                onSelectTopic={(topic) => {
                  setSelectedTopic(topic);
                  setSelectedSubtopic(null);
                  setSelectedVideo(null);
                }}
                onSelectSubtopic={(subtopic) => {
                  setSelectedSubtopic(subtopic);
                  const firstVideo = subtopic.attributes.videos?.data?.[0] || null;
                  setSelectedVideo(convertStrapiVideoToAppVideo(firstVideo));
                }}
              />
            </section>

            <section className="xl:col-span-4 space-y-4">
              <h2 className="text-2xl font-bold text-green-900">Subtopics</h2>
              <SubtopicList
                subtopics={subtopics}
                onSelectVideo={(video, subtopic) => {
                  setSelectedSubtopic(subtopic);
                  setSelectedVideo(convertStrapiVideoToAppVideo(video));
                }}
              />
            </section>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-900">Video Player</h2>
            <VideoPlayer video={selectedVideo} />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-900">Quiz</h2>
            <StrapiQuiz quiz={activeQuiz} />
          </div>
        </section>
      </div>
    </div>
  );
}

