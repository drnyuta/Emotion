import { useState } from "react";
import { Select } from "antd";
import { ToggleButton } from "../../components/ToggleButton/ToggleButton";
import "./AiReportsPage.scss";
import { SORT_OPTIONS } from "../../constants/sortOptions";

export const AiReportsPage = () => {
  const [period, setPeriod] = useState("Weekly");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="reports-page">
      <h1>AI Reports</h1>
      <div className="reports-page__filters">
        <div className="reports-page__filters-item">
          <h3>Period:</h3>
          <ToggleButton
            options={["Daily", "Weekly"]}
            value={period}
            onChange={setPeriod}
          />
        </div>
        <div className="reports-page__filters-item">
          <h3>Sort:</h3>
          <Select
            value={sortBy}
            onChange={setSortBy}
            options={SORT_OPTIONS}
            className="reports-page__select"
          />
        </div>
      </div>
    </div>
  );
};