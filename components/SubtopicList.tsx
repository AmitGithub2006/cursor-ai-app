'use client';

import { Subtopic, Video } from '@/lib/strapi/types';
import { PlayCircle } from 'lucide-react';

interface SubtopicListProps {
  subtopics: Subtopic[];
  onSelectVideo?: (video: Video, subtopic: Subtopic) => void;
}

export function SubtopicList({ subtopics, onSelectVideo }: SubtopicListProps) {
  if (!subtopics || subtopics.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center text-gray-500">
        No subtopics found for this topic.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subtopics.map((subtopic) => {
        const videos = subtopic.attributes.videos?.data || [];
        return (
          <div key={subtopic.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="text-xl font-semibold text-green-800">{subtopic.attributes.title}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">{subtopic.attributes.description}</p>
            {videos.length > 0 ? (
              <div className="space-y-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => onSelectVideo?.(video, subtopic)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-green-800">{video.attributes.title}</p>
                      <p className="text-sm text-green-700 line-clamp-2">{video.attributes.description}</p>
                    </div>
                    <PlayCircle className="w-6 h-6 text-green-600" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No videos added yet.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
