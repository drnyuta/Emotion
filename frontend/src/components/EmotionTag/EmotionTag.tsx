import React from "react";
import "./EmotionTag.scss";
import { EmotionCategory, emotionColors } from "../../constants/emotions";

interface EmotionTagProps {
  emotionCategory: EmotionCategory;
  emotion: string;
  onClick?: (emotion: string) => void;
}

export default function EmotionTag({
  emotionCategory,
  emotion,
  onClick,
}: EmotionTagProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick(emotion);
    }
  };

  return (
    <span
      className={`
        emotion-tag 
      `.trim()}
      style={{ backgroundColor: emotionColors[emotionCategory] }}
      onClick={handleClick}
    >
      {emotion}
    </span>
  );
}
