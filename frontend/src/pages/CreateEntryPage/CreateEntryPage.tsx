import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Breadcrumb, Modal } from "antd";
import { EntryForm } from "../../components/EntryForm/EntryForm";
import { getCategoriesWithEmotions } from "../../api/emotions";
import { getQuestionById } from "../../api/questions";
import BackArrow from "../../assets/icons/arrow-left.svg";
import "./CreateEntryPage.scss";
import { CategoryWithEmotions, DiaryEmotion } from "../../globalInterfaces";
import { createEntry } from "../../api/diary";
import dayjs from "dayjs";
import { RingLoader } from "react-spinners";

export const CreateEntryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [content, setContent] = useState("");
  const [questionText, setQuestionText] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<DiaryEmotion[]>([]);
  const [categories, setCategories] = useState<CategoryWithEmotions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emotionError, setEmotionError] = useState<string | null>(null);

  const entryDate = location.state?.entryDate ?? dayjs().format("YYYY-MM-DD");
  const formattedDate = dayjs(entryDate).format("MMMM D, YYYY");
  const questionIdFromUrl = searchParams.get("questionId");

  useEffect(() => {
    const loadEmotions = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesWithEmotions();
        const data = response.categories;

        if (!Array.isArray(data)) {
          console.error("Categories is not an array:", data);
          throw new Error("Invalid response format");
        }
        setCategories(data);
      } catch (err) {
        console.error("Failed to load emotions:", err);
        setEmotionError("Failed to load emotions");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmotions();
  }, []);

  useEffect(() => {
    const loadQuestion = async () => {
      if (!questionIdFromUrl) {
        setQuestionId(null);
        setQuestionText(null);
        return;
      }
      const id = Number(questionIdFromUrl);
      setQuestionId(id);
      try {
        const question = await getQuestionById(Number(questionId));
        setQuestionText(question.question_text);
      } catch (err) {
        console.error("Failed to load question:", err);
      }
    };

    loadQuestion();
  }, [questionId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const emotionIds = selectedEmotions.map((e) => e.emotionId);
      await createEntry(
        entryDate,
        content,
        questionId ?? undefined,
        emotionIds
      );
      navigate("/diary");
    } catch (err) {
      console.error(err);
      setError("Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Modal.confirm({
      title: "Are you sure you want to cancel?",
      content: "Your current changes will not be saved.",
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

  if (loading) {
    return (
      <div className="create-entry-page create-entry-page--loading">
        <RingLoader color="#7c3aed" size={60} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="create-entry-page">
      <div className="create-entry-page__header">
        <Breadcrumb
          className="create-entry-page__breadcrumb"
          items={[{ title: "Diary", href: "/diary" }, { title: "New Entry" }]}
        />
        <button className="create-entry-page__back" onClick={handleCancel}>
          <img src={BackArrow} alt="back" />
        </button>
      </div>

      {error && <p className="create-entry-page__error">{error}</p>}
      <div className="create-entry-page__container">
        <EntryForm
          date={formattedDate}
          content={content}
          onContentChange={setContent}
          questionText={questionText}
          selectedEmotions={selectedEmotions}
          onEmotionsChange={setSelectedEmotions}
          categories={categories}
          error={emotionError}
          onSave={handleSave}
          onCancel={handleCancel}
          onPickQuestion={() =>
            navigate("/questions", {
              state: {
                from: "/diary/new",
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
