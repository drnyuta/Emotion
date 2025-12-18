import { Input } from "antd";
import { Button } from "../../components/Button/Button";
import EmotionTag from "../../components/EmotionTag/EmotionTag";
import EmotionSelector from "../EmotionSelector/EmotionSelector";
import { DiaryEmotion, CategoryWithEmotions } from "../../globalInterfaces";
import { getCategoryEnum } from "../../utils/getCategoryEnum";
import Emoji from "../../assets/icons/happy-face.svg";
import "./EntryForm.scss";

const { TextArea } = Input;

interface EntryFormProps {
  date: string;
  content: string;
  onContentChange: (content: string) => void;
  selectedEmotions: DiaryEmotion[];
  onEmotionsChange: (emotions: DiaryEmotion[]) => void;
  categories: CategoryWithEmotions[];
  loading?: boolean;
  error?: string | null;
  onSave: () => void;
  onCancel: () => void;
}

export const EntryForm = ({
  date,
  content,
  onContentChange,
  selectedEmotions,
  onEmotionsChange,
  categories,
  loading = false,
  error = null,
  onSave,
  onCancel,
}: EntryFormProps) => {
  const handleEmotionAdd = (
    id: number,
    name: string,
    categoryId: number,
    categoryName: string
  ) => {
    const isAlreadySelected = selectedEmotions.some((e) => e.emotionId === id);

    if (!isAlreadySelected) {
      onEmotionsChange([
        ...selectedEmotions,
        {
          emotionId: id,
          emotion: name,
          categoryId,
          category: getCategoryEnum(categoryName),
        },
      ]);
    }
  };

  const handleEmotionRemove = (emotionName: string) => {
    onEmotionsChange(selectedEmotions.filter((e) => e.emotion !== emotionName));
  };

  return (
    <div className="entry-form">
      <div className="entry-form__left">
        <h1 className="entry-form__date">{date}</h1>

        <div className="entry-form__editor">
          <TextArea
            placeholder="Write about your day..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            autoSize={{ minRows: 10, maxRows: 20 }}
            className="entry-form__textarea"
          />
        </div>

        <div className="entry-form__hint">
          <p>
            Hint: use <a href='/questions' className="highlight">Question of the day</a> to
            inspire your journaling.
          </p>
        </div>

        <div className="entry-form__actions">
          <Button
            text="Save"
            variant="primary"
            onClick={onSave}
            disabled={content.trim().length < 3 || selectedEmotions.length === 0}
          />
          <Button text="Cancel" variant="secondary" onClick={onCancel} />
        </div>
      </div>

      <div className="entry-form__right">
        <div className="entry-form__emotion-section">
          <p className="entry-form__emotion-title">
            <img
              src={Emoji}
              alt="emoji"
              className="entry-form__emoji"
            />
            Choose your{" "}
            <a href="/emotion-wheel" className="highlight">
              emotions:
            </a>
          </p>

          <EmotionSelector
            categories={categories}
            loading={loading}
            error={error}
            onEmotionClick={handleEmotionAdd}
          />

          {selectedEmotions.length > 0 && (
            <div className="entry-form__selected-emotions">
              {selectedEmotions.map((item) => (
                <EmotionTag
                  key={item.emotionId}
                  emotionCategory={getCategoryEnum(item.category)}
                  emotion={item.emotion}
                  showRemove
                  onRemove={handleEmotionRemove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};