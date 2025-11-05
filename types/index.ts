export interface Concept {
  id: string;
  title: string;
  description: string;
  region: string;
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
  videosWatched: string[];
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

