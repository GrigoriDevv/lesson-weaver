export interface LessonSection {
  title: string;
  content: string;
  duration: number;
  activities?: string[];
}

export interface LessonPlan {
  subject: string;
  objective: string;
  sections: LessonSection[];
  totalDuration: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
