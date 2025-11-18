import { create } from 'zustand';
import { Concept, Progress, Region } from '@/types';
import { enrichConceptsWithCmsData } from '@/lib/loadCmsData';

interface AppState {
  concepts: Concept[];
  regions: Region[];
  progress: Record<string, Progress>;
  subtopicVideoCount: Record<string, number>; // Track total videos per subtopic
  currentRegion: string | null;
  initializeData: (concepts: Concept[], regions: Region[]) => Promise<void>;
  refreshCmsData: (concepts: Concept[]) => Promise<void>; // Refresh videos from Strapi without resetting progress
  markVideoWatched: (conceptId: string, subtopicId: string, videoId: string) => void;
  recordSubtopicVideoCount: (subtopicId: string, count: number) => void; // Called after fetching videos
  completeQuiz: (conceptId: string, score: number) => void;
  unlockConcept: (conceptId: string) => void;
  unlockRegion: (regionId: string) => void;
  setCurrentRegion: (regionId: string | null) => void;
  getConceptProgress: (conceptId: string) => Progress | undefined;
  getSubtopicProgress: (conceptId: string, subtopicId: string) => number; // Returns % (0-100)
  getTopicProgress: (conceptId: string, topicId: string) => number; // Returns % (0-100)
  getConceptCompletionPercentage: (conceptId: string) => number; // Returns % (0-100)
  isConceptUnlocked: (conceptId: string) => boolean;
  isConceptCompleted: (conceptId: string) => boolean;
  isTopicUnlocked: (conceptId: string, topicIndex: number) => boolean; // Unlocked if prev topic >= 70%
}

export const useStore = create<AppState>((set, get) => ({
  concepts: [],
  regions: [],
  progress: {},
  subtopicVideoCount: {},
  currentRegion: null,

  initializeData: async (concepts, regions) => {
    // Avoid resetting state if already initialized
    if (get().concepts.length > 0) {
      return;
    }
    // Initialize first concept as unlocked
    let updatedConcepts = concepts.map((concept, index) => ({
      ...concept,
      unlocked: index === 0,
      completed: false,
    }));

    // Attempt to enrich concepts with CMS data from Strapi
    try {
      updatedConcepts = await enrichConceptsWithCmsData(updatedConcepts);
    } catch (error) {
      console.error('Failed to load CMS data, using local data:', error);
      // Continue with local data if Strapi fails
    }

    set({ concepts: updatedConcepts, regions });
  },

  refreshCmsData: async (concepts) => {
    // Refresh videos and quizzes from Strapi while keeping existing progress
    console.log('[STORE] Refreshing CMS data from Strapi...');
    let updatedConcepts = concepts;

    try {
      updatedConcepts = await enrichConceptsWithCmsData(concepts);
    } catch (error) {
      console.error('Failed to refresh CMS data:', error);
      return;
    }

    set({ concepts: updatedConcepts });
    console.log('[STORE] CMS data refreshed successfully');
  },

  markVideoWatched: (conceptId, subtopicId, videoId) => {
    console.log(`[STORE] Marking video ${videoId} as watched in subtopic ${subtopicId} for concept ${conceptId}`);
    const progress = get().progress[conceptId] || {
      conceptId,
      videosWatched: [],
      subtopicProgress: {},
      quizCompleted: false,
    };

    const subtopicProgress = progress.subtopicProgress || {};
    const subProgress = subtopicProgress[subtopicId] || { videosWatched: [] };

    if (!subProgress.videosWatched.includes(videoId)) {
      const updatedProgress = {
        ...progress,
        videosWatched: [...progress.videosWatched, videoId],
        subtopicProgress: {
          ...subtopicProgress,
          [subtopicId]: {
            videosWatched: [...subProgress.videosWatched, videoId],
          },
        },
      };

      console.log(`[STORE] Updated progress:`, updatedProgress);
      set({
        progress: {
          ...get().progress,
          [conceptId]: updatedProgress,
        },
      });
    }
  },

  recordSubtopicVideoCount: (subtopicId, count) => {
    console.log(`[STORE] Recording video count for subtopic ${subtopicId}: ${count} videos`);
    set({
      subtopicVideoCount: {
        ...get().subtopicVideoCount,
        [subtopicId]: count,
      },
    });
  },

  completeQuiz: (conceptId, score) => {
    const progress = get().progress[conceptId] || {
      conceptId,
      videosWatched: [],
      quizCompleted: false,
    };
    
    const updatedProgress = {
      ...progress,
      quizCompleted: true,
      quizScore: score,
      completedAt: new Date(),
    };
    
    const allProgress = {
      ...get().progress,
      [conceptId]: updatedProgress,
    };
    
    // Update concept completion status
    const concepts = get().concepts.map((concept) => {
      if (concept.id === conceptId) {
        return { ...concept, completed: true };
      }
      return concept;
    });
    
    // Unlock next concept
    const currentConceptIndex = concepts.findIndex((c) => c.id === conceptId);
    if (currentConceptIndex >= 0 && currentConceptIndex < concepts.length - 1) {
      const nextConcept = concepts[currentConceptIndex + 1];
      if (!nextConcept.unlocked) {
        concepts[currentConceptIndex + 1] = { ...nextConcept, unlocked: true };
      }
    }
    
    // Check if all concepts in a region are completed to unlock next region
    const currentConcept = concepts.find((c) => c.id === conceptId);
    if (currentConcept) {
      const regionConcepts = concepts.filter((c) => c.region === currentConcept.region);
      // IMPORTANT: use the freshly computed allProgress (not get().progress)
      const allRegionConceptsCompleted = regionConcepts.every((c) => {
        const cProgress = allProgress[c.id];
        return cProgress?.quizCompleted || false;
      });

      if (allRegionConceptsCompleted) {
        // Find next region in order and unlock it
        const currentRegionIndex = get().regions.findIndex((r) => r.id === currentConcept.region);
        if (currentRegionIndex >= 0 && currentRegionIndex < get().regions.length - 1) {
          const nextRegion = get().regions[currentRegionIndex + 1];
          if (!nextRegion.unlocked) {
            const updatedRegions = get().regions.map((r) =>
              r.id === nextRegion.id ? { ...r, unlocked: true } : r
            );
            set({ regions: updatedRegions });
          }
        }
      }
    }
    
    set({ progress: allProgress, concepts });
  },

  unlockConcept: (conceptId) => {
    const concepts = get().concepts.map((concept) =>
      concept.id === conceptId ? { ...concept, unlocked: true } : concept
    );
    set({ concepts });
  },

  unlockRegion: (regionId) => {
    const regions = get().regions.map((region) =>
      region.id === regionId ? { ...region, unlocked: true } : region
    );
    set({ regions });
  },

  setCurrentRegion: (regionId) => {
    set({ currentRegion: regionId });
  },

  getConceptProgress: (conceptId) => {
    return get().progress[conceptId];
  },

  isConceptUnlocked: (conceptId) => {
    const concept = get().concepts.find((c) => c.id === conceptId);
    return concept?.unlocked || false;
  },

  isConceptCompleted: (conceptId) => {
    const progress = get().progress[conceptId];
    return progress?.quizCompleted || false;
  },

  getSubtopicProgress: (conceptId, subtopicId) => {
    const progress = get().progress[conceptId];
    if (!progress) {
      console.log(`[STORE] No progress found for concept ${conceptId}`);
      return 0;
    }

    const subProgress = progress.subtopicProgress?.[subtopicId];
    if (!subProgress) {
      console.log(`[STORE] No subtopic progress found for subtopic ${subtopicId}`);
      return 0;
    }

    // Get total videos for this subtopic from recorded count
    const totalVideos = get().subtopicVideoCount[subtopicId] || 0;
    if (totalVideos === 0) {
      console.log(`[STORE] No video count recorded for subtopic ${subtopicId}. Available counts:`, get().subtopicVideoCount);
      return 0;
    }

    // Calculate percentage: (watched / total) * 100
    const watched = subProgress.videosWatched.length;
    const percentage = Math.round((watched / totalVideos) * 100);
    console.log(`[STORE] Subtopic ${subtopicId} progress: ${watched}/${totalVideos} = ${percentage}%`);
    return Math.min(percentage, 100); // Cap at 100%
  },

  getTopicProgress: (conceptId, topicId) => {
    const concept = get().concepts.find((c) => c.id === conceptId);
    if (!concept) return 0;

    const topic = concept.topics.find((t) => t.id === topicId);
    if (!topic || topic.subtopics.length === 0) return 0;

    const progress = get().progress[conceptId];
    if (!progress) return 0;

    // Calculate average progress of all subtopics in this topic
    let totalProgress = 0;
    for (const subtopic of topic.subtopics) {
      const subProgress = get().getSubtopicProgress(conceptId, subtopic.id);
      totalProgress += subProgress;
    }

    return Math.round(totalProgress / topic.subtopics.length);
  },

  getConceptCompletionPercentage: (conceptId) => {
    const concept = get().concepts.find((c) => c.id === conceptId);
    if (!concept || concept.topics.length === 0) return 0;

    // Calculate average progress of all topics
    let totalProgress = 0;
    for (const topic of concept.topics) {
      const topicProgress = get().getTopicProgress(conceptId, topic.id);
      totalProgress += topicProgress;
    }

    return Math.round(totalProgress / concept.topics.length);
  },

  isTopicUnlocked: (conceptId, topicIndex) => {
    const concept = get().concepts.find((c) => c.id === conceptId);
    if (!concept || topicIndex < 0) return false;

    // First topic is always unlocked
    if (topicIndex === 0) return true;

    // Otherwise, check if previous topic is >= 70%
    const prevTopic = concept.topics[topicIndex - 1];
    if (!prevTopic) return false;

    const prevProgress = get().getTopicProgress(conceptId, prevTopic.id);
    return prevProgress >= 70;
  },
}));

