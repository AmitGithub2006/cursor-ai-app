'use client';

import { Course, Topic } from '@/lib/strapi/types';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface CourseListProps {
  courses: Course[];
  onSelectCourse?: (course: Course) => void;
  onSelectTopic?: (topic: Topic) => void;
}

export function CourseList({ courses, onSelectCourse, onSelectTopic }: CourseListProps) {
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);

  if (!courses || courses.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center text-gray-500">
        No courses found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const isExpanded = expandedCourse === course.id;
        const topics = course.attributes.topics?.data || [];
        return (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => {
                setExpandedCourse(isExpanded ? null : course.id);
                onSelectCourse?.(course);
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  {course.attributes.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {course.attributes.description}
                </p>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}
            </button>
            {isExpanded && topics.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelectTopic?.(topic)}
                    className="w-full text-left p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <h4 className="font-semibold text-green-800">{topic.attributes.title}</h4>
                    <p className="text-sm text-green-700 line-clamp-2">{topic.attributes.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
