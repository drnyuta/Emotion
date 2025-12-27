import { EmotionCategory } from "./constants/emotions";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface DiaryEmotion {
  emotionId: number;
  emotion: string;
  categoryId: number;
  category: EmotionCategory;
}

export interface Emotion {
  id: number;
  name: string;
}

export interface Entry {
  id: number;
  user_id: number;
  entry_date: string; // YYYY-MM-DD
  content: string;
  question_id: number | null;
  created_at: string;
  updated_at: string;
  emotions: DiaryEmotion[];
}

export interface CategoryWithEmotions {
  id: number;
  name: string;
  emotions: Emotion[];
}

export interface EmotionDetails {
  id: number;
  name: string;
  definition: string;
  triggers: string[];
  recommendations: string[];
}

export interface Report {
  id: number;
  type: "daily" | "weekly" | "weekly_limited";
  reportDate: string;
  reportEndDate: string | null;
  data: unknown;
}