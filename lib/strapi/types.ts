export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string;
    };
  };
}

export interface QuizQuestion {
  id?: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
}

export interface Quiz {
  id: number;
  attributes: {
    title: string;
    questions: QuizQuestion[];
  };
}

export interface Video {
  id: number;
  attributes: {
    title: string;
    description: string;
    video_url: string;
  };
}

export interface Subtopic {
  id: number;
  attributes: {
    title: string;
    description: string;
    videos?: { data: Video[] };
    quizzes?: { data: Quiz[] };
  };
}

export interface Topic {
  id: number;
  attributes: {
    title: string;
    description: string;
    subtopics?: { data: Subtopic[] };
  };
}

export interface Course {
  id: number;
  attributes: {
    title: string;
    description: string;
    topics?: { data: Topic[] };
  };
}
