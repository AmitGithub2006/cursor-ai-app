export interface SubTopic {
  id: string;
  title: string;
  description?: string;
  strapiId?: number; // Numeric ID from Strapi for fetching videos
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  subtopics: SubTopic[];
  strapiId?: number; // Numeric ID from Strapi
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  region: string;
  topics: Topic[]; // Changed from subTopics to topics
  videos: Video[];
  quiz: Quiz;
  unlocked: boolean;
  completed: boolean;
  order: number;
  googleClassroomId?: string;
  googleDocsLink?: string;
  googleSitesLink?: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration?: number;
  watched: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Progress {
  conceptId: string;
  videosWatched: string[]; // Maps to video IDs
  subtopicProgress: Record<string, { videosWatched: string[] }>; // Track per-subtopic video progress
  quizCompleted: boolean;
  quizScore?: number;
  completedAt?: Date;
}

export interface Region {
  id: string;
  name: string;
  displayName: string;
  color: string;
  position: { x: number; y: number };
  unlocked: boolean;
  concepts: Concept[];
  icon: string;
}

