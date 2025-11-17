'use client';

import dynamic from 'next/dynamic';
import { Video } from '@/types';
import { useMemo } from 'react';

const PlayerDyn = dynamic(() => import('react-player').then((mod) => mod.default), { ssr: false });
const ReactPlayer = PlayerDyn as unknown as React.FC<any>;

interface VideoPlayerProps {
  video: Video | null;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoUrl = useMemo(() => video?.url, [video]);

  if (!video || !videoUrl) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500">
        Select a video to start learning.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video">
        <ReactPlayer url={videoUrl} width="100%" height="100%" controls playing />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-green-900">{video.title}</h3>
        <p className="text-green-800">{video.title}</p>
      </div>
    </div>
  );
}
