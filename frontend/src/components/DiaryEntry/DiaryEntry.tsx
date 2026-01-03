import React, { useState } from "react";
import "./DiaryEntry.scss";
import AiMagnifier from "../../assets/icons/ai-magnifier.svg";
import { Button } from "../Button/Button";
import EditIcon from "../../assets/icons/edit.svg";
import DeleteIcon from "../../assets/icons/red-bin.svg";
import EmotionTag from "../EmotionTag/EmotionTag";
import { DiaryEmotion } from "../../globalInterfaces";

interface DiaryEntryProps {
  id?: number;
  date?: Date;
  emotions?: DiaryEmotion[];
  content?: string;
  isEmpty?: boolean;
  isExpanded?: boolean;
  maxPreviewLength?: number;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAnalyse?: () => void;
  onCreate?: () => void;
}

export default function DiaryEntry({
  date,
  emotions = [],
  content,
  isEmpty = false,
  isExpanded = false,
  maxPreviewLength = 400,
  onViewMore,
  onEdit,
  onDelete,
  onAnalyse,
  onCreate,
}: DiaryEntryProps) {
  const [expanded, setExpanded] = useState(isExpanded);

  const handleViewMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
    onViewMore?.();
  };

  const shouldShowViewMore = content && content.length > maxPreviewLength;
  const displayContent =
    !expanded && shouldShowViewMore
      ? `${content.slice(0, maxPreviewLength)}...`
      : content;

  if (isEmpty) {
    return (
      <div className={`diary-entry ${expanded ? "diary-entry--expanded" : ""}`}>
        {date && (
          <h3 className="diary-entry__date">
            {date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        )}
        <div className="diary-entry__content diary-entry__content--empty">
          <p>No entry for this day.</p>
        </div>
        <div className="diary-entry__actions">
          {onCreate && (
            <Button
              text="Write"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onCreate();
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`diary-entry ${expanded ? "diary-entry--expanded" : ""}`}>
      <div className="diary-entry__header">
        {date && (
          <h3 className="diary-entry__date">
            {date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h3>
        )}
        {onAnalyse && (
          <button
            className="diary-entry__analyse-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyse();
            }}
          >
            <img src={AiMagnifier} alt="ai icon" />
            Analyse with AI
          </button>
        )}
      </div>

      {emotions.length > 0 && (
        <div className="diary-entry__emotions">
          {emotions.map((emotionItem, index) => (
            <EmotionTag
              key={`${emotionItem.emotion}-${index}`}
              emotionCategory={emotionItem.category}
              emotion={emotionItem.emotion}
            />
          ))}
        </div>
      )}

      {content && (
        <div className="diary-entry__content">
          <p>{displayContent}</p>
        </div>
      )}

      <div className="diary-entry__actions">
        {shouldShowViewMore && (
          <Button
            text={expanded ? "View less" : "View more"}
            size="small"
            variant="primary"
            onClick={handleViewMore}
          />
        )}

        <div className="diary-entry__actions-right">
          {onEdit && (
            <Button
              text="Edit"
              size="small"
              variant="custom"
              textColor="#000"
              backgroundColor="var(--color-sadness)"
              hoverBackgroundColor="#b3cbffff"
              hoverTextColor="#000"
              icon={<img src={EditIcon} alt="edit icon" />}
              iconPosition="right"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
          )}

          {onDelete && (
            <Button
              text="Delete"
              size="small"
              variant="custom"
              textColor="#fff"
              backgroundColor="#000"
              hoverBackgroundColor="#353535ff"
              icon={<img src={DeleteIcon} alt="delete icon" />}
              iconPosition="right"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
