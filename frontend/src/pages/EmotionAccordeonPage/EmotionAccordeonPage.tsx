import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "antd";
import { getCategoriesWithEmotions, getEmotionById } from "../../api/emotions";
import { CategoryWithEmotions, EmotionDetails } from "../../globalInterfaces";
import {
  EmotionCategory as EmotionCategoryEnum,
  emotionColors,
} from "../../constants/emotions";
import "./EmotionAccordeonPage.scss";
import { BackButton } from "../../components/BackButton/BackButton";
import { RingLoader } from "react-spinners";

export const EmotionAccordeonPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [category, setCategory] = useState<CategoryWithEmotions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedEmotionId, setExpandedEmotionId] = useState<number | null>(
    null
  );
  const [emotionDetails, setEmotionDetails] = useState<
    Record<number, EmotionDetails>
  >({});
  const [loadingEmotionId, setLoadingEmotionId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getCategoriesWithEmotions();

        if (res.categories) {
          const found = res.categories.find((cat: CategoryWithEmotions) => {
            return cat.name.toLowerCase() === categoryName?.toLowerCase();
          });

          setCategory(found || null);

          if (!found) {
            setError(`Category "${categoryName}" not found`);
          }
        } else {
          setError("Failed to load categories");
        }
      } catch (err) {
        setError("Failed to load category");
        console.error("Failed to load category:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryName]);

  const handleExpand = async (emotionId: number) => {
    setError(null);
    if (expandedEmotionId === emotionId) {
      setExpandedEmotionId(null);
      return;
    }
    setExpandedEmotionId(emotionId);

    if (emotionDetails[emotionId]) {
      return;
    }

    try {
      setLoadingEmotionId(emotionId);
      const data = await getEmotionById(emotionId);
      setEmotionDetails((prev) => ({ ...prev, [emotionId]: data }));
    } catch (err) {
      console.error("Failed to load emotion details:", err);
      setError("Failed to load emotion details");
    } finally {
      setLoadingEmotionId(null);
    }
  };

  const colorKey = category?.name.toLowerCase() as EmotionCategoryEnum;
  const backgroundColor = emotionColors[colorKey];

  if (loading) {
    return (
      <div className="emotion-accordeon-page emotion-accordeon-page--loading">
        <RingLoader color="#7c3aed" size={60} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="emotion-accordeon-page">
      <div className="emotion-accordeon-page__header">
        <Breadcrumb
          items={[
            { title: "Emotions", href: "/emotion-wheel" },
            { title: category?.name },
          ]}
        />
        <BackButton />
      </div>

      {error && <p className="emotion-accordeon-page__error">{error}</p>}

      <div
        className="emotion-accordeon-page__content"
        style={{ backgroundColor }}
      >
        <div className="emotion-accordion">
          {category?.emotions.map((emotion) => {
            const details = emotionDetails[emotion.id];
            const isExpanded = expandedEmotionId === emotion.id;
            const isLoading = loadingEmotionId === emotion.id;

            return (
              <div key={emotion.id} className="accordion-item">
                <button
                  className="accordion-header"
                  onClick={() => handleExpand(emotion.id)}
                >
                  <span>{emotion.name}</span>
                  <span className="accordion-icon">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="accordion-content">
                    {isLoading ? (
                      <div className="accordion-content__loading">
                        <RingLoader color="#7c3aed" size={30} />
                      </div>
                    ) : details ? (
                      <>
                      <p className="accordion-content__subtitle">Overview:</p>
                        <p className="accordion-content__overview">
                          {details.definition}
                        </p>

                        {details.triggers && details.triggers.length > 0 && (
                          <>
                            <p className="accordion-content__subtitle">
                              Common Triggers:
                            </p>
                            <ul className="accordion-content__list">
                              {details.triggers.map((trigger, index) => (
                                <li key={index}>{trigger}</li>
                              ))}
                            </ul>
                          </>
                        )}

                        {details.recommendations &&
                          details.recommendations.length > 0 && (
                            <>
                              <p className="accordion-content__subtitle">
                                Helpful suggestions for self-regulation or
                                reflection:
                              </p>
                              <ul className="accordion-content__list">
                                {details.recommendations.map(
                                  (recommendation, index) => (
                                    <li key={index}>{recommendation}</li>
                                  )
                                )}
                              </ul>
                            </>
                          )}
                      </>
                    ) : (
                      <p>No details available</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
