import { useState } from "react";
import { Modal } from "antd";
import { Insight } from "../../globalInterfaces";
import EditIcon from "../../assets/icons/edit.svg";
import BinIcon from "../../assets/icons/black-bin.svg";
import Lightbulb from "../../assets/icons/lightbulb.svg";
import "./InsightCard.scss";
import { Button } from "../Button/Button";

interface InsightCardProps {
  insight: Insight;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export const InsightCard = ({
  insight,
  onUpdate,
  onDelete,
}: InsightCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(insight.insightText);

  const handleSave = () => {
    if (editText.trim() && editText !== insight.insightText) {
      onUpdate(insight.id, editText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(insight.insightText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete insight",
      content: "Are you sure you want to delete this insight?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { type: "primary" },
      onOk() {
        onDelete(insight.id);
      },
    });
  };

  return (
    <div className="insight-card">
      {isEditing ? (
        <div className="insight-card__edit">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="insight-card__textarea"
          />
          <div className="insight-card__edit-buttons">
            <Button
              onClick={handleSave}
              text="Save"
              variant="primary"
              disabled={!editText.trim()}
            />
            <Button onClick={handleCancel} text="Cancel" variant="secondary" />
          </div>
        </div>
      ) : (
        <>
          <img
            src={Lightbulb}
            alt="lightbulb icon"
            className="insight-card__icon"
          />
          <p className="insight-card__text">{insight.insightText}</p>
          <div className="insight-card__actions">
            <button
              onClick={() => setIsEditing(true)}
              className="insight-card__action"
            >
              <img src={EditIcon} alt="edit" className="insight-card__icon" />
            </button>

            <button className="insight-card__action" onClick={handleDelete}>
              <img src={BinIcon} alt="delete" className="insight-card__icon" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
