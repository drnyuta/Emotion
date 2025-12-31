import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb, Modal } from "antd";
import { EntryForm } from "../../components/EntryForm/EntryForm";
import { getCategoriesWithEmotions } from "../../api/emotions";
import { updateEntry, getEntryByDate } from "../../api/diary";
import { getQuestionById } from "../../api/questions";
import BackArrow from "../../assets/icons/arrow-left.svg";
import { RingLoader } from "react-spinners";
import "./EditEntryPage.scss";
import {
  CategoryWithEmotions,
  DiaryEmotion,
  Entry,
} from "../../globalInterfaces";
import { getCategoryEnum } from "../../utils/getCategoryEnum";
import dayjs from "dayjs";
import { DiaryEmotionApi } from "../../utils/mapDiaryEmotion";
import { Button } from "../../components/Button/Button";

export const EditEntryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [content, setContent] = useState("");
  const [questionText, setQuestionText] = useState<string | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<DiaryEmotion[]>([]);
  const [categories, setCategories] = useState<CategoryWithEmotions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emotionError, setEmotionError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [entryData, setEntryData] = useState<Entry | null>(null);
  const [questionId, setQuestionId] = useState<number | null>(null);

  const userId = 1;

  const entryDate = location.state?.entryDate ?? dayjs().format("YYYY-MM-DD");
  const formattedDate = dayjs(entryDate).format("MMMM D, YYYY");
  const newQuestionId = searchParams.get("questionId");

  const loadCategories = async () => {
    try {
      const response = await getCategoriesWithEmotions();
      const data = response.categories;

      if (!Array.isArray(data)) {
        throw new Error("Invalid categories format");
      }

      setCategories(data);
      setEmotionError(null);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
      setEmotionError("Failed to load emotions");
      throw err;
    }
  };

  const loadEntry = async () => {
    try {
      const entry = await getEntryByDate(entryDate);

      if (!entry) {
        throw new Error("Entry not found");
      }

      setEntryData(entry);
      setContent(entry.content || "");

      if (Array.isArray(entry.emotions)) {
        const mapped: DiaryEmotion[] = entry.emotions.map(
          (item: DiaryEmotionApi) => ({
            emotionId: item.emotion.id,
            emotion: item.emotion.name,
            categoryId: item.category.id,
            category: getCategoryEnum(item.category.name),
          })
        );

        setSelectedEmotions(mapped);
      }

      setError(null);
    } catch (err) {
      console.error("Failed to load entry:", err);
      setError("Failed to load entry");
      throw err;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        setLoading(true);
        await Promise.all([loadCategories(), loadEntry()]);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    loadData();
  }, [userId, entryDate]);

  useEffect(() => {
    const loadQuestion = async () => {
      const id = newQuestionId
        ? Number(newQuestionId)
        : entryData?.question_id ?? null;

      setQuestionId(id);

      if (id) {
        try {
          const question = await getQuestionById(id);
          setQuestionText(question.question_text);
        } catch {
          setQuestionText(null);
        }
      } else {
        setQuestionText(null);
      }
    };

    if (entryData) {
      loadQuestion();
    }
  }, [newQuestionId, entryData]);

  const handleSave = async () => {
    if (!entryData?.id) {
      setError("Entry ID is missing");
      return;
    }

    try {
      setLoading(true);

      const emotionIds = selectedEmotions.map((e) => e.emotionId);

      await updateEntry(entryData.id, content, questionId, emotionIds);

      navigate("/diary");
    } catch (err) {
      console.error(err);
      setError("Failed to update entry");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "Are you sure you want to cancel?",
      content: "Your changes will not be saved.",
      okText: "Yes, cancel",
      cancelText: "No, stay",
      onOk() {
        navigate("/diary");
      },
    });
  };

  const handleDeleteQuestion = () => {
    setQuestionText(null);
    setQuestionId(null);
  };

  if (initialLoading || loading) {
    return (
      <div className="edit-entry-page edit-entry-page--loading">
        <RingLoader color="#7c3aed" size={60} />
        <p>Loading...</p>
      </div>
    );
  }

  if (!entryData) {
    return (
      <div className="edit-entry-page edit-entry-page--error">
        <p>Entry not found. Please go back to the diary.</p>
        <Button
          text="Go to Diary"
          variant="primary"
          onClick={() => navigate("/diary")}
        />
      </div>
    );
  }

  return (
    <div className="edit-entry-page">
      <div className="edit-entry-page__header">
        <Breadcrumb
          className="edit-entry-page__breadcrumb"
          items={[{ title: "Diary", href: "/diary" }, { title: "Edit Entry" }]}
        />
        <button className="edit-entry-page__back" onClick={handleCancel}>
          <img src={BackArrow} alt="back" />
        </button>
      </div>

      {error && <p className="edit-entry-page__error">{error}</p>}

      <div className="edit-entry-page__container">
        <EntryForm
          date={formattedDate}
          content={content}
          onContentChange={setContent}
          questionText={questionText}
          selectedEmotions={selectedEmotions}
          onEmotionsChange={setSelectedEmotions}
          categories={categories}
          loading={loading}
          error={emotionError}
          onSave={handleSave}
          onCancel={handleCancel}
          onPickQuestion={() =>
            navigate("/questions", {
              state: {
                from: "/diary/edit",
                entryDate,
              },
            })
          }
          onDeleteQuestion={handleDeleteQuestion}
        />
      </div>
    </div>
  );
};
