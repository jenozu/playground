export type LessonType =
  | 'reading'
  | 'coding'
  | 'guided'
  | 'multiple-choice'
  | 'debugging'
  | 'project'
  | 'review';

export interface Hint {
  id: string;
  text: string;
}

export interface Exercise {
  id: string;
  prompt: string;
  starterCode?: string;
  solution?: string;
  hints: Hint[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  exercises: Exercise[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  language: string;
  modules: Module[];
}
