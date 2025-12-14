import { Calendar } from "antd";
import type { Dayjs } from "dayjs";

import "./EmotionCalendar.scss";

export const EmotionCalendar = () => {
  const records = ["2025-12-14", "2025-01-15", "2025-01-20"];

  const onSelect = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");
    const hasRecord = records.includes(date);

    if (hasRecord) {
      console.log("Has record", date);
    } else {
      console.log("Does not have record", date);
    }
  };

  const dateCellRender = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");

    if (records.includes(date)) {
      return <span className="dot" />;
    }
    return null;
  };

  const wrapperStyle = {
    width: 400,
  };

  return (
    <div style={wrapperStyle}>
      <Calendar
        fullscreen={false}
        onSelect={onSelect}
        cellRender={dateCellRender}
        className="calendar"
      />
    </div>
  );
};
