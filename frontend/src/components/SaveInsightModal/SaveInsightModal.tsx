import { useState } from "react";
import "./SaveInsightModal.scss";
import { Button } from "../Button/Button";

interface SaveInsightModalProps {
  onSave: (text: string) => void;
  onCancel: () => void;
  saving?: boolean;
}

export const SaveInsightModal = ({
  onSave,
  onCancel,
  saving,
}: SaveInsightModalProps) => {
  const [text, setText] = useState("");

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      setText("");
    }
  };

  return (
    <div className="save-insight-modal">
      <h2 className="save-insight-modal__title">Save Insight</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Copy and paste insight, or write it yourself here"
        className="save-insight-modal__textarea"
        disabled={saving}
      />
      <div className="save-insight-modal__buttons">
        <Button
          onClick={handleSave}
          text="Save"
          variant="primary"
          disabled={saving || !text.trim()}
        />
        <Button
          onClick={onCancel}
          text="Cancel"
          variant="secondary"
          disabled={saving}
        />
      </div>
    </div>
  );
};
