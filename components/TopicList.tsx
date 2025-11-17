'use client';

import { Topic, Subtopic } from '@/lib/strapi/types';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import { useState } from 'react';

interface TopicListProps {
  topics: Topic[];
  onSelectTopic?: (topic: Topic) => void;
  onSelectSubtopic?: (subtopic: Subtopic) => void;
}

export function TopicList({ topics, onSelectTopic, onSelectSubtopic }: TopicListProps) {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  if (!topics || topics.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm text-center text-gray-500">
        No topics found for this course.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic) => {
        const isExpanded = expandedTopic === topic.id;
        const subtopics = topic.attributes.subtopics?.data || [];
        return (
          <div key={topic.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <button
              className="w-full flex items-center justify-between p-4 text-left"
              onClick={() => {
                setExpandedTopic(isExpanded ? null : topic.id);
                onSelectTopic?.(topic);
              }}
            >
              <div>
                <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-green-500" />
                  {topic.attributes.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {topic.attributes.description}
                </p>
              </div>
              {isExpanded ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-green-600" />}
            </button>
            {isExpanded && subtopics.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                {subtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    onClick={() => onSelectSubtopic?.(subtopic)}
                    className="w-full text-left p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <h4 className="font-semibold text-emerald-800">{subtopic.attributes.title}</h4>
                    <p className="text-sm text-emerald-700 line-clamp-2">{subtopic.attributes.description}</p>
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
