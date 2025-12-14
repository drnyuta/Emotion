import { EmotionCategory } from "./constants/emotions";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface DiaryEmotion {
  emotion: string;
  category: EmotionCategory;
}