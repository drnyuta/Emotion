import { useState, useEffect } from "react";
import { message } from "antd";
import { RingLoader } from "react-spinners";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getMonthlyEmotionStats,
  getWeeklyEmotionStats,
  EmotionStat,
} from "../../api/analytics";
import { ToggleButton } from "../../components/ToggleButton/ToggleButton";
import "./AnalyticsPage.scss";

import { emotionColors } from "../../constants/emotions";
import { getCategoryEnum } from "../../utils/getCategoryEnum";
import { getWeekDateRange, getWeekNumber } from "../../utils/dates";
import { CustomTooltip } from "../../components/CustomTooltip/CustomTooltip";

export const AnalyticsPage = () => {
  const [period, setPeriod] = useState<"Monthly" | "Weekly">("Monthly");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EmotionStat[]>([]);

  useEffect(() => {
    fetchData();
  }, [period, currentDate]);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const userId = 1;
      let result: EmotionStat[];
      if (period === "Monthly") {
        const month = currentDate.getMonth() + 1;
        result = await getMonthlyEmotionStats(userId, year, month);
      } else {
        const week = getWeekNumber(currentDate);
        result = await getWeeklyEmotionStats(userId, year, week);
      }
      setData(result);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setError("Failed to load analytics data");
      message.error("Failed to load analytics data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (period === "Monthly") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
      );
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (period === "Monthly") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
      );
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    }
  };

  const displayTitle =
    period === "Monthly"
      ? currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : getWeekDateRange(currentDate);

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  const topEmotions = data.slice(0, 5).map((item) => {
    const categoryEnum = getCategoryEnum(item.categoryName);
    return {
      name: item.emotionName,
      value: item.count,
      category: categoryEnum,
      color: emotionColors[categoryEnum],
    };
  });

  const categoryMap: Record<string, { value: number; color: string }> = {};
  data.forEach((item) => {
    const categoryEnum = getCategoryEnum(item.categoryName);
    if (!categoryMap[categoryEnum]) {
      categoryMap[categoryEnum] = {
        value: 0,
        color: emotionColors[categoryEnum],
      };
    }
    categoryMap[categoryEnum].value += item.count;
  });

  const pieData = Object.entries(categoryMap).map(
    ([name, { value, color }]) => ({
      name,
      value,
      percentage:
        totalCount > 0 ? ((value / totalCount) * 100).toFixed(1) : "0",
      color,
    })
  );


  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <div className="analytics-page__controls">
        <ToggleButton
          options={["Monthly", "Weekly"]}
          value={period}
          onChange={(value) => setPeriod(value as "Monthly" | "Weekly")}
        />

        <div className="analytics-page__period-nav">
          <button onClick={handlePrev} className="analytics-page__nav-btn">
            ‹
          </button>
          <h2 className="analytics-page__period-title">{displayTitle}</h2>
          <button onClick={handleNext} className="analytics-page__nav-btn">
            ›
          </button>
        </div>
      </div>
      {error && <p className="analytics-page__error">{error}</p>}

      {loading ? (
        <div className="analytics-page__loading">
          <RingLoader color="#7c3aed" size={60} />
        </div>
      ) : data.length === 0 ? (
        <div className="analytics-page__empty">
          <p>No data available for this period</p>
        </div>
      ) : (
        <>
          <div className="analytics-page__card">
            <div className="analytics-page__card-header">
              <span className="analytics-page__card-label">Statistics</span>
              <h3 className="analytics-page__card-title">
                Top {topEmotions.length} Emotions
              </h3>
            </div>
            <div className="analytics-page__chart">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={topEmotions}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 13 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#374151", fontSize: 14 }}
                    width={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {topEmotions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="analytics-page__card">
            <div className="analytics-page__card-header">
              <span className="analytics-page__card-label">Statistics</span>
              <h3 className="analytics-page__card-title">
                Category Distribution
              </h3>
            </div>
            <div className="analytics-page__distribution">
              <div className="analytics-page__pie-container">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={140}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="analytics-page__legend">
                {pieData.map((entry) => (
                  <div key={entry.name} className="analytics-page__legend-item">
                    <span
                      className="analytics-page__legend-dot"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="analytics-page__legend-name">
                      {entry.name}
                    </span>
                    <span className="analytics-page__legend-value">
                      {entry.value} ({entry.percentage}%)
                    </span>
                  </div>
                ))}
                <div className="analytics-page__legend-total">
                  Total emotions: {totalCount}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
