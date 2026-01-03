import { EmotionCategory } from "../constants/emotions";
import { DiaryEmotion } from "../globalInterfaces";

export interface DiaryEmotionApi {
  emotion: { id: number; name: string };
  category: {
    id: number;
    name: string;
  };
}

export const mapDiaryEmotion = (apiEmotion: DiaryEmotionApi): DiaryEmotion => ({
  emotion: apiEmotion.emotion.name,
  emotionId: apiEmotion.emotion.id,
  categoryId: apiEmotion.category.id,
  category: apiEmotion.category.name.toLowerCase() as EmotionCategory,
});
