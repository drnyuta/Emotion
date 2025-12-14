export enum EmotionCategory {
  JOY = "joy",
  SADNESS = "sadness",
  ANGER = "anger",
  FEAR = "fear",
  PEACE = "peace",
  STRENGTH = "strength",
}

export const emotionColors: Record<EmotionCategory, string> = {
  [EmotionCategory.JOY]: "var(--color-joy)",
  [EmotionCategory.ANGER]: "var(--color-anger)",
  [EmotionCategory.PEACE]: "var(--color-peace)",
  [EmotionCategory.SADNESS]: "var(--color-sadness)",
  [EmotionCategory.FEAR]: "var(--color-fear)",
  [EmotionCategory.STRENGTH]: "var(--color-strength)",
};
