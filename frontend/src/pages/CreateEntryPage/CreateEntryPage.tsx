import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Input, Menu, Modal } from "antd";
import type { MenuProps } from "antd";
import { Button } from "../../components/Button/Button";
import EmotionTag from "../../components/EmotionTag/EmotionTag";
import { getCategoriesWithEmotions } from "../../api/emotions";
import BackArrow from "../../assets/icons/arrow-left.svg";
import { RingLoader } from "react-spinners";
import "./CreateEntryPage.scss";
import {
  CategoryWithEmotions,
  DiaryEmotion,
  Emotion,
} from "../../globalInterfaces";
import { getCategoryEnum } from "../../utils/getCategoryEnum";
import { createEntry } from "../../api/diary";
import dayjs from "dayjs";
import Emoji from "../../assets/icons/happy-face.svg";

const { TextArea } = Input;
const { Search } = Input;

export const CreateEntryPage = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<DiaryEmotion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryWithEmotions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();

  const entryDate = location.state?.entryDate ?? dayjs().format("YYYY-MM-DD");
  const formattedDate = dayjs(entryDate).format("MMMM D, YYYY");

  const userId = 1;

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
        setError("Failed to load emotions");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmotions();
  }, []);

  const handleEmotionClick = (
    id: number,
    name: string,
    categoryId: number,
    categoryName: string
  ) => {
    const isAlreadySelected = selectedEmotions.some((e) => e.emotionId === id);

    if (!isAlreadySelected) {
      setSelectedEmotions((prev) => [
        ...prev,
        {
          emotionId: id,
          emotion: name,
          categoryId,
          category: getCategoryEnum(categoryName),
        },
      ]);
    }
  };

  const handleRemoveEmotion = (emotionName: string) => {
    setSelectedEmotions(
      selectedEmotions.filter((e) => e.emotion !== emotionName)
    );
  };

  const handleSave = async () => {
    try {
      const emotionIds = selectedEmotions.map((e) => e.emotionId);
      await createEntry(userId, entryDate, content, undefined, emotionIds);
      navigate("/diary");
    } catch (err) {
      console.error(err);
      setError("Failed to save entry");
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

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      emotions: category.emotions.filter((emotion: Emotion) =>
        emotion.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.emotions.length > 0);

  const menuItems: MenuProps["items"] = filteredCategories.map((category) => ({
    key: category.id.toString(),
    label: category.name,
    children: category.emotions.map((emotion: Emotion) => ({
      key: `${category.id}-${emotion.id}`,
      label: emotion.name,
      onClick: () =>
        handleEmotionClick(
          emotion.id,
          emotion.name,
          category.id,
          category.name
        ),
    })),
  }));

  if (loading) {
    return <div className="create-entry-page create-entry-page--loading"></div>;
  }

  return (
    <div className="create-entry-page">
      <div className="create-entry-page__header">
        <Breadcrumb
          className="create-entry-page__breadcrumb"
          items={[{ title: "Diary", href: "/diary" }, { title: "New Entry" }]}
        />
        <button
          className="create-entry-page__back"
          onClick={handleCancel}
        >
          <img src={BackArrow} alt="back" />
        </button>
      </div>

      <div className="create-entry-page__container">
        <div className="create-entry-page__left">
          <h1 className="create-entry-page__date">{formattedDate}</h1>

          <div className="create-entry-page__editor">
            <TextArea
              placeholder="Write about your day..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              autoSize={{ minRows: 10, maxRows: 20 }}
              className="create-entry-page__textarea"
            />
          </div>

          <div className="create-entry-page__hint">
            <p>
              Hint: use <span className="highlight">Question of the day</span>{" "}
              to inspire your journaling.
            </p>
          </div>

          <div className="create-entry-page__actions">
            <Button
              text="Save"
              variant="primary"
              onClick={handleSave}
              disabled={!content.trim() || selectedEmotions.length === 0}
            />
            <Button text="Cancel" variant="secondary" onClick={handleCancel} />
          </div>
        </div>

        <div className="create-entry-page__right">
          <div className="create-entry-page__emotion-selector">
            <p className="create-entry-page__emotion-title">
              <img
                src={Emoji}
                alt="emoji"
                className="create-entry-page__emoji"
              />
              Choose your{" "}
              <a href="/emotion-wheel" className="highlight">
                emotions:
              </a>
            </p>

            <Search
              placeholder="Search emotions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="create-entry-page__search"
            />

            {categories.length > 0 ? (
              <Menu
                mode="vertical"
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                items={menuItems}
                className="create-entry-page__menu"
              />
            ) : (
              <p className="create-entry-page__no-emotions">
                No emotions available
              </p>
            )}

            {loading && (
              <div className="create-entry-page__loading">
                <RingLoader color="#7c3aed" size={40} />
                <p>Loading emotions...</p>
              </div>
            )}

            {!loading && error && (
              <p className="create-entry-page__error">{error}</p>
            )}

            {!loading && !error && filteredCategories.length === 0 && (
              <p className="create-entry-page__no-emotions">
                No emotions available
              </p>
            )}

            {selectedEmotions.length > 0 && (
              <div className="create-entry-page__selected-emotions">
                {selectedEmotions.map((item) => (
                  <EmotionTag
                    key={item.emotionId}
                    emotionCategory={getCategoryEnum(item.category)}
                    emotion={item.emotion}
                    showRemove
                    onRemove={handleRemoveEmotion}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
