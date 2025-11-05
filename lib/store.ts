import { create } from 'zustand';
import { Concept, Progress, Region } from '@/types';

interface AppState {
  concepts: Concept[];
  regions: Region[];
  progress: Record<string, Progress>;
  currentRegion: string | null;
  initializeData: (concepts: Concept[], regions: Region[]) => void;
  markVideoWatched: (conceptId: string, videoId: string) => void;
  completeQuiz: (conceptId: string, score: number) => void;
  unlockConcept: (conceptId: string) => void;
  unlockRegion: (regionId: string) => void;
  setCurrentRegion: (regionId: string | null) => void;
  getConceptProgress: (conceptId: string) => Progress | undefined;
  isConceptUnlocked: (conceptId: string) => boolean;
  isConceptCompleted: (conceptId: string) => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  concepts: [],
  regions: [],
  progress: {},
  currentRegion: null,

  initializeData: (concepts, regions) => {
    // Avoid resetting state if already initialized
    if (get().concepts.length > 0) {
      return;
    }
    // Initialize first concept as unlocked
    const updatedConcepts = concepts.map((concept, index) => ({
      ...concept,
      unlocked: index === 0,
      completed: false,
    }));
    set({ concepts: updatedConcepts, regions });
  },

  markVideoWatched: (conceptId, videoId) => {
    const progress = get().progress[conceptId] || {
      conceptId,
      videosWatched: [],
      quizCompleted: false,
    };
    
    if (!progress.videosWatched.includes(videoId)) {
      const updatedProgress = {
        ...progress,
        videosWatched: [...progress.videosWatched, videoId],
      };
      
      set({
        progress: {
          ...get().progress,
          [conceptId]: updatedProgress,
        },
      });
    }
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
}));

