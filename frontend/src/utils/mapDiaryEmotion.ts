import { EmotionCategory } from "../constants/emotions";
import { DiaryEmotion } from "../globalInterfaces";


export interface DiaryEmotionApi {
  emotion_id: number;
  emotion: string;
  category: {
    id: number;
    name: string;
  };
}

export const mapDiaryEmotion = (
  apiEmotion: DiaryEmotionApi
): DiaryEmotion => ({
  emotion: apiEmotion.emotion,
  categoryId: apiEmotion.category.id,
  category: apiEmotion.category.name.toLowerCase() as EmotionCategory,
});
