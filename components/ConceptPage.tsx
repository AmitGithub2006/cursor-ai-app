'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const PlayerDyn = dynamic(() => import('react-player').then(m => m.default), { ssr: false });
const ReactPlayer = PlayerDyn as unknown as React.FC<any>;
import { useStore } from '@/lib/store';
import { sampleConcepts, sampleRegions } from '@/lib/data';
import { fetchVideosForSubtopic } from '@/lib/loadCmsData';
import { Video } from '@/types';
import {
  CheckCircle2,
  Play,
  ArrowLeft,
  Award,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import QuizComponent from './QuizComponent';
import GoogleClassroomIntegration from './GoogleClassroomIntegration';

interface ConceptPageProps {
  regionId: string;
}

export default function ConceptPage({ regionId }: ConceptPageProps) {
  const router = useRouter();
  const {
    concepts,
    progress,
    markVideoWatched,
    getConceptProgress,
    getConceptCompletionPercentage,
    getTopicProgress,
    isConceptUnlocked,
    isTopicUnlocked,
    initializeData,
    recordSubtopicVideoCount,
    refreshCmsData,
  } = useStore();
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [expandedSubTopics, setExpandedSubTopics] = useState<Set<string>>(new Set());
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string | null>(null);
  const [selectedItemVideos, setSelectedItemVideos] = useState<string[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // Initialize store data if user landed directly on this page (no prior visit to home)
  useEffect(() => {
    if (concepts.length === 0) {
      initializeData(sampleConcepts, sampleRegions);
    }
  }, [concepts.length, initializeData]);

  // Resolve region from a variety of possible URL forms
  const normalize = (s?: string) =>
    (s || '')
      .toLowerCase()
      .replace(/concept\s*(\d+)/, 'region-$1')
      .replace(/\s+/g, '-')
      .replace(/_/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const normalizedParam = normalize(regionId);

  const region =
    sampleRegions.find((r) => normalize(r.id) === normalizedParam) ||
    sampleRegions.find((r) => normalize(r.name) === normalizedParam) ||
    sampleRegions.find((r) => normalize(r.displayName) === normalizedParam) ||
    // Accept forms like "concept1" or "concept-1" by mapping index
    (() => {
      const match = normalizedParam.match(/^concept-?(\d+)$/);
      if (!match) return undefined;
      const idx = parseInt(match[1], 10) - 1;
      return idx >= 0 && idx < sampleRegions.length ? sampleRegions[idx] : undefined;
    })();


  // If region could not be resolved, redirect to the first available region as a safe fallback
  useEffect(() => {
    if (!region && typeof window !== 'undefined' && sampleRegions.length > 0) {
      const first = sampleRegions[0];
      router.replace(`/region/${first.id}`);
    }
  }, [region, router]);

  if (!region) return null;

  // Always filter concepts by the resolved region id to avoid mismatches with slugs
  const regionConcepts = concepts
    .filter((c) => (region ? c.region === region.id : false))
    .sort((a, b) => a.order - b.order);

  const concept = regionConcepts.find((c) => c.id === selectedConcept);
  const conceptProgress = concept ? getConceptProgress(concept.id) : undefined;

  // Choose first unlocked concept on load
  useEffect(() => {
    if (regionConcepts.length > 0 && !selectedConcept) {
      const firstUnlocked = regionConcepts.find((c) => isConceptUnlocked(c.id));
      if (firstUnlocked) {
        setSelectedConcept(firstUnlocked.id);
      }
    }
  }, [regionConcepts, selectedConcept, isConceptUnlocked]);

  const handleVideoEnd = () => {
    // Track video as watched when it ends
    if (concept && selectedItemName && selectedVideoIndex >= 0 && selectedItemVideos.length > 0) {
      const videoId = `video-${selectedVideoIndex}`;
      markVideoWatched(concept.id, selectedItemName, videoId);
    }
  };

  // Video watching logic will be handled per item when Strapi is integrated

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold px-3 py-2 rounded hover:bg-green-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Forest
            </button>
            <button
              onClick={async () => {
                try {
                  console.log('[UI] Refreshing content from Strapi...');
                  await refreshCmsData(concepts);

                  // If a subtopic is currently selected, re-fetch its videos so the UI list and selected video
                  // are synced with the freshly-loaded CMS data. This avoids mismatch where local selected index
                  // points to a different URL after CMS updates.
                  if (selectedItemName) {
                    // Find the subtopic from the refreshed concepts in the store
                    const found = concepts
                      .flatMap((c) => c.topics || [])
                      .flatMap((t) => t.subtopics || [])
                      .find((s) => s.id === selectedItemName);

                    if (found && found.strapiId && found.strapiId > 0) {
                      try {
                        const videos = await fetchVideosForSubtopic(
                          found.strapiId,
                          found.id,
                          (count: number) => recordSubtopicVideoCount(found.id, count)
                        );

                        if (videos && videos.length > 0) {
                          setSelectedItemVideos(videos.map((v: Video) => v.url));
                          setSelectedVideoUrl(videos[0].url);
                          setSelectedVideoIndex(0);
                        } else {
                          setSelectedItemVideos([]);
                          setSelectedVideoUrl(null);
                          setSelectedVideoIndex(0);
                        }
                      } catch (err) {
                        console.error('Error re-fetching videos after refresh:', err);
                      }
                    }
                  }
                } catch (err) {
                  console.error('Error refreshing CMS data:', err);
                }
              }}
              className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold px-3 py-2 rounded hover:bg-green-100 transition-all"
              title="Refresh videos and quizzes from Strapi"
            >
              🔄 Refresh Content
            </button>
          </div>
          <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-2 border-green-300 rounded-2xl p-6 shadow-inner">
            <h1 className="text-4xl font-extrabold text-green-800 mb-2 tracking-tight">
              {region.icon} {region.displayName}
            </h1>
            <p className="text-lg text-green-700">Complete concepts to unlock new regions!</p>
            <div className="mt-4 h-3 bg-white/60 rounded-full overflow-hidden border border-green-300">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${Math.round((concepts.filter(c => c.region === region.id && (progress[c.id]?.quizCompleted || false)).length / concepts.filter(c => c.region === region.id).length) * 100) || 0}%` }}
              />
            </div>
          </div>
        </motion.div>
        {/* Featured Videos removed as per request */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Concepts & Sub-topics Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Concepts</h2>
                <div className="space-y-3">
                  {regionConcepts.map((c, index) => {
                    const isUnlocked = isConceptUnlocked(c.id);
                    const cProgress = getConceptProgress(c.id);
                    const completed = cProgress?.quizCompleted || false;
                    const isSelected = selectedConcept === c.id;

                    return (
                      <div key={c.id}>
                        <motion.button
                          onClick={() => {
                            if (isUnlocked) {
                              setSelectedConcept(c.id);
                              setShowQuiz(false);
                              setSelectedVideoUrl(null);
                              setSelectedItemName(null);
                              setSelectedItemVideos([]);
                              setSelectedVideoIndex(0);
                            }
                          }}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? 'border-green-500 bg-green-50'
                              : isUnlocked
                              ? 'border-green-200 bg-white hover:border-green-400'
                              : 'border-gray-300 bg-gray-100'
                          }`}
                          whileHover={isUnlocked ? { scale: 1.02 } : {}}
                          whileTap={isUnlocked ? { scale: 0.98 } : {}}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {isUnlocked ? (
                                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              ) : (
                                <Lock className="w-8 h-8 text-gray-400" />
                              )}
                              <div>
                                <div className="font-semibold text-gray-800">{c.title}</div>
                                <div className="text-sm text-gray-600">{c.description}</div>
                              </div>
                            </div>
                            {completed && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                          {isUnlocked && cProgress && (
                            <div className="mt-2 text-xs text-gray-500">
                              Quiz: {completed ? '✓' : '○'}
                            </div>
                          )}
                        </motion.button>

                        {/* Topics and Subtopics for selected concept */}
                        {isSelected && isUnlocked && c.topics && c.topics.length > 0 && (
                          <div className="mt-4 ml-4 space-y-2">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                              {c.title} - Topics
                            </h3>
                            {c.topics.map((topic: any, topicIndex: number) => {
                              const topicId = `topic-${topic.id}`;
                              const isTopicExpanded = expandedSubTopics.has(topicId);
                              const topicUnlocked = isTopicUnlocked(c.id, topicIndex);
                              const topicProgress = getTopicProgress(c.id, topic.id);
                              
                              return (
                                <div key={topicId} className="border-l-2 border-green-200 pl-3 space-y-1">
                                  <button
                                    onClick={() => {
                                      if (topicUnlocked) {
                                        const newExpanded = new Set(expandedSubTopics);
                                        if (isTopicExpanded) {
                                          newExpanded.delete(topicId);
                                        } else {
                                          newExpanded.add(topicId);
                                        }
                                        setExpandedSubTopics(newExpanded);
                                      }
                                    }}
                                    disabled={!topicUnlocked}
                                    className={`w-full text-left py-2 flex items-center justify-between transition-colors rounded px-2 ${
                                      topicUnlocked
                                        ? 'hover:text-green-700 hover:bg-green-50 cursor-pointer'
                                        : 'opacity-50 cursor-not-allowed text-gray-500'
                                    }`}
                                  >
                                    <div className="flex-1">
                                      <span className="font-medium text-green-800 text-sm block">
                                        {topic.title}
                                      </span>
                                      {topicUnlocked && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
                                            <div 
                                              className="h-full bg-green-500 transition-all"
                                              style={{ width: `${topicProgress}%` }}
                                            />
                                          </div>
                                          <span className="text-xs text-gray-600">{topicProgress}%</span>
                                        </div>
                                      )}
                                      {!topicUnlocked && topicIndex > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          Complete {getTopicProgress(c.id, c.topics[topicIndex - 1].id)}% of previous topic (need 70%)
                                        </div>
                                      )}
                                    </div>
                                    {topicUnlocked ? (
                                      isTopicExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-green-600 flex-shrink-0 ml-2" />
                                      )
                                    ) : (
                                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                                    )}
                                  </button>
                                  {/* Subtopics under this topic */}
                                  {isTopicExpanded && topicUnlocked && topic.subtopics && topic.subtopics.length > 0 && (
                                    <div className="ml-2 mt-1 space-y-1">
                                      {topic.subtopics.map((subtopic: any) => {
                                        const isSubtopicSelected = selectedItemName === subtopic.id;
                                        return (
                                          <button
                                            key={subtopic.id}
                                            onClick={async () => {
                                              setSelectedItemName(subtopic.id);
                                              setSelectedVideoUrl(''); // Clear for now
                                              setSelectedItemVideos([]);
                                              setShowQuiz(false);
                                              
                                              // Fetch videos for this subtopic from Strapi
                                              if (subtopic.strapiId && subtopic.strapiId > 0) {
                                                try {
                                                  const videos = await fetchVideosForSubtopic(
                                                    subtopic.strapiId,
                                                    subtopic.id,
                                                    (count: number) => recordSubtopicVideoCount(subtopic.id, count)
                                                  );
                                                  if (videos.length > 0) {
                                                    setSelectedVideoUrl(videos[0].url);
                                                    setSelectedItemVideos(videos.map((v: Video) => v.url));
                                                    setSelectedVideoIndex(0);
                                                  }
                                                } catch (error) {
                                                  console.error('Error fetching videos:', error);
                                                }
                                              }
                                            }}
                                            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                                              isSubtopicSelected
                                                ? 'bg-green-100 text-green-800 font-medium border-l-2 border-green-500'
                                                : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                            }`}
                                          >
                                            • {subtopic.title}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {concept && isConceptUnlocked(concept.id) ? (
              <AnimatePresence mode="wait">
                {!showQuiz ? (
                  <motion.div
                    key="video-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 isolate"
                  >
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-green-800 mb-2">
                        {concept.title}
                      </h2>
                      <p className="text-lg text-green-700">{concept.description}</p>
                      
                      {/* Progress Display */}
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-700">Your Progress</span>
                          <span className="text-lg font-bold text-green-600">
                            {getConceptCompletionPercentage(concept.id)}%
                          </span>
                        </div>
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden border border-green-300">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${getConceptCompletionPercentage(concept.id)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">
                          {getConceptCompletionPercentage(concept.id) < 70 
                            ? `Complete ${70 - getConceptCompletionPercentage(concept.id)}% more to unlock next topic` 
                            : 'All topics unlocked! Ready to take the quiz.'}
                        </p>
                      </div>
                    </div>

                    {/* Video Player */}
                    {selectedVideoUrl ? (
                      <div className="mb-6">
                        <div className="bg-black rounded-xl shadow-lg relative" style={{ paddingBottom: '56.25%' }}>
                          <div className="absolute inset-0 rounded-xl overflow-hidden">
                            {/* Render YouTube iframe directly to avoid ReactPlayer control overlay issues */}
                            {selectedVideoUrl.includes('youtube.com') || selectedVideoUrl.includes('youtu.be') ? (
                              <iframe
                                src={(() => {
                                  try {
                                    const url = new URL(selectedVideoUrl);
                                    let id = '';
                                    if (url.hostname.includes('youtu.be')) {
                                      id = url.pathname.slice(1);
                                    } else {
                                      id = url.searchParams.get('v') || '';
                                    }
                                    if (!id) return selectedVideoUrl;
                                    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
                                  } catch (e) {
                                    return selectedVideoUrl;
                                  }
                                })()}
                                title={selectedItemName || 'Video player'}
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            ) : (
                              <ReactPlayer
                                url={selectedVideoUrl}
                                width="100%"
                                height="100%"
                                controls
                                onEnded={handleVideoEnd}
                                playing={false}
                                config={{ youtube: { playerVars: { rel: 0, modestbranding: 1 } } }}
                              />
                            )}
                          </div>
                        </div>
                        {selectedItemVideos && selectedItemVideos.length > 1 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedItemVideos.map((vid, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedVideoIndex(idx);
                                  setSelectedVideoUrl(vid);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all cursor-pointer ${
                                  selectedVideoIndex === idx
                                    ? 'bg-green-600 text-white border-green-700 shadow-md'
                                    : 'bg-white text-green-700 border-green-300 hover:bg-green-100 hover:border-green-500 shadow-sm'
                                }`}
                                type="button"
                              >
                                Video {idx + 1}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Mark Video as Watched Button */}
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => {
                              if (concept && selectedItemName && selectedVideoIndex >= 0) {
                                const videoId = `video-${selectedVideoIndex}`;
                                console.log(`[MANUAL] Marking video ${videoId} as watched`);
                                markVideoWatched(concept.id, selectedItemName, videoId);
                              }
                            }}
                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md"
                          >
                            ✓ Mark Video as Watched
                          </button>
                        </div>
                        
                        <div className="mt-2">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {selectedItemName || 'Video'}
                          </h3>
                          <div className="text-sm text-gray-600">
                            Click "Mark Video as Watched" after watching the video
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                        <Play className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                          Select a Topic to Watch
                        </h3>
                        <p className="text-green-700">
                          Click on any topic item in the sidebar to start watching the video
                        </p>
                      </div>
                    )}

                    {/* Additional Resources removed as requested */}

                    {/* Google Classroom Integration */}
                    <div className="mb-6">
                      <GoogleClassroomIntegration conceptId={concept.id} />
                    </div>

                    {/* Quiz Button - Enabled only when 70% of concept is completed */}
                    {concept.quiz.questions.length > 0 && (
                      <>
                        {getConceptCompletionPercentage(concept.id) >= 70 ? (
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => setShowQuiz(true)}
                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Award className="w-6 h-6" />
                            Take Quiz
                          </motion.button>
                        ) : (
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            disabled
                            className="w-full py-4 bg-gray-300 text-gray-600 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 cursor-not-allowed"
                          >
                            <Lock className="w-6 h-6" />
                            Quiz Locked - {70 - getConceptCompletionPercentage(concept.id)}% more needed
                          </motion.button>
                        )}
                      </>
                    )}

                    {/* Classroom CTA at page end */}
                    <div className="mt-6 text-center">
                      <a
                        href="https://classroom.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Go to Google Classroom
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="quiz-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <QuizComponent
                      concept={concept}
                      onComplete={() => {
                        setShowQuiz(false);
                        // Unlock next concept logic is handled in store
                      }}
                      onBack={() => setShowQuiz(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  Concept Locked
                </h2>
                <p className="text-gray-600">
                  Complete the previous concepts to unlock this one!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

