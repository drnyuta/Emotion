import { EmotionWheel } from "../../components/EmotionWheel/EmotionWheel";
import "./EmotionWheelPage.scss";

export const EmotionWheelPage = () => {
  return (
    <div className="emotion-wheel-page">
      <h1>Emotion Wheel</h1>
      <div className="emotion-wheel-page__description">
        <p>
          The Emotion Wheel page helps you explore your emotional state through
          a simple and intuitive model built around six core emotional
          categories. When you click on any section, it expands into a list of
          more specific emotions belonging to that category.
        </p>
        <div className="emotion-wheel-page__description-list">
          <p>Each emotion in the expanded list includes:</p>
          <ul className="emotion-wheel-page__list">
            <li>a short description of what it typically feels like</li>
            <li>common triggers</li>
            <li>helpful suggestions for self-regulation or reflection</li>
          </ul>
        </div>
      </div>
      <EmotionWheel />
    </div>
  );
};
