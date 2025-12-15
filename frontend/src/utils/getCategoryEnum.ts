import { EmotionCategory } from "../constants/emotions";

export const getCategoryEnum = (categoryName: string): EmotionCategory => {
    const mapping: Record<string, EmotionCategory> = {
      joy: EmotionCategory.JOY,
      sadness: EmotionCategory.SADNESS,
      anger: EmotionCategory.ANGER,
      fear: EmotionCategory.FEAR,
      peace: EmotionCategory.PEACE,
      strength: EmotionCategory.STRENGTH,
    };
    return mapping[categoryName.toLowerCase()] || EmotionCategory.JOY;
  };