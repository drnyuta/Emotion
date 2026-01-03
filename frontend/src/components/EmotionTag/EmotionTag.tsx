import React from "react";
import "./EmotionTag.scss";
import { EmotionCategory, emotionColors } from "../../constants/emotions";
import Cross from "../../assets/icons/cross.svg";

interface EmotionTagProps {
  emotionCategory: EmotionCategory;
  emotion: string;
  onClick?: (emotion: string) => void;
  onRemove?: (emotion: string) => void;
  showRemove?: boolean;
}

export default function EmotionTag({
  emotionCategory,
  emotion,
  onClick,
  onRemove,
  showRemove = false,
}: EmotionTagProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick(emotion);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove(emotion);
    }
  };

  return (
    <span
      className={`
        emotion-tag 
        ${onClick ? "emotion-tag--clickable" : ""}
        ${showRemove ? "emotion-tag--removable" : ""}
      `.trim()}
      style={{ backgroundColor: emotionColors[emotionCategory] }}
      onClick={handleClick}
    >
      {emotion}
      {showRemove && (
        <button className="emotion-tag__remove" onClick={handleRemove}>
          <img src={Cross} alt="remove" className="emotion-tag__cross"/>
        </button>
      )}
    </span>
  );
}