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