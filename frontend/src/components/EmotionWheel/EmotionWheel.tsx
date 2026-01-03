import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesWithEmotions } from "../../api/emotions";
import { CategoryWithEmotions } from "../../globalInterfaces";
import {
  EmotionCategory,
  emotionColors,
} from "../../constants/emotions";
import "./EmotionWheel.scss";
import { RingLoader } from "react-spinners";

const RADIUS = 180;
const CENTER = 180;
const SECTORS = 6;
const ANGLE = 360 / SECTORS;

export const EmotionWheel = () => {
  const [categories, setCategories] = useState<CategoryWithEmotions[]>([]);
  const [error, setErrror] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try{
        setLoading(true);
        const res = await getCategoriesWithEmotions();
        setCategories(res.categories);
      } catch (err) {
        setErrror("Failed to load emotion wheel");
        console.error("Failed to load emotion wheel:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const polarToCartesian = (angle: number, radius: number = RADIUS) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER + radius * Math.sin(rad),
    };
  };

  const createSectorPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(endAngle);
    const end = polarToCartesian(startAngle);

    return `
      M ${CENTER} ${CENTER}
      L ${start.x} ${start.y}
      A ${RADIUS} ${RADIUS} 0 0 0 ${end.x} ${end.y}
      Z
    `;
  };

  if (loading) {
    return (
      <div className="emotion-wheel--loading">
        <RingLoader color="#7c3aed" size={60} />
        <p>Loading...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="emotion-wheel--error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="emotion-wheel">
      <svg width={360} height={360} viewBox="0 0 360 360">
        {categories.map((category, index) => {
          const startAngle = index * ANGLE;
          const endAngle = startAngle + ANGLE;

          const colorKey = category.name.toLowerCase() as EmotionCategory;
          const midAngle = startAngle + ANGLE / 2;
          const labelPos = polarToCartesian(midAngle, RADIUS * 0.6);

          return (
            <g
              key={category.id}
              className="emotion-wheel__sector"
              onClick={() =>
                navigate(`/emotions/${category.name.toLowerCase()}`)
              }
            >
              <path
                d={createSectorPath(startAngle, endAngle)}
                fill={emotionColors[colorKey]}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="emotion-wheel__label"
              >
                {category.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};