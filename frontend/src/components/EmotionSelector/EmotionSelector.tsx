import { useState } from "react";
import { Input, Menu } from "antd";
import type { MenuProps } from "antd";
import { RingLoader } from "react-spinners";
import { CategoryWithEmotions, Emotion } from "../../globalInterfaces";
import "./EmotionSelector.scss";

const { Search } = Input;

interface EmotionSelectorProps {
  categories: CategoryWithEmotions[];
  loading?: boolean;
  error?: string | null;
  onEmotionClick: (
    id: number,
    name: string,
    categoryId: number,
    categoryName: string
  ) => void;
}

export const EmotionSelector = ({
  categories,
  loading = false,
  error = null,
  onEmotionClick,
}: EmotionSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openKeys, setOpenKeys] = useState<string[]>([]);

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
        onEmotionClick(emotion.id, emotion.name, category.id, category.name),
    })),
  }));

  return (
    <div className="emotion-selector">
      <Search
        placeholder="Search emotions"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="emotion-selector__search"
      />

      {loading && (
        <div className="emotion-selector__loading">
          <RingLoader color="#7c3aed" size={40} />
          <p>Loading emotions...</p>
        </div>
      )}

      {!loading && error && (
        <p className="emotion-selector__error">{error}</p>
      )}

      {!loading && !error && categories.length > 0 && (
        <Menu
          mode="vertical"
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          className="emotion-selector__menu"
        />
      )}

      {!loading && !error && filteredCategories.length === 0 && (
        <p className="emotion-selector__no-emotions">No emotions available</p>
      )}
    </div>
  );
};

export default EmotionSelector;