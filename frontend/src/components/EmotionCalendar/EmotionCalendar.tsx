import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import "./EmotionCalendar.scss";

interface Props {
  datesWithEntries: string[];
  selectedDate: Dayjs;
  onSelectDate: (date: Dayjs) => void;
}

export const EmotionCalendar = ({
  datesWithEntries,
  selectedDate,
  onSelectDate,
}: Props) => {
  const dateCellRender = (value: Dayjs) => {
    const date = value.format("YYYY-MM-DD");

    if (datesWithEntries.includes(date)) {
      return <span className="dot" />;
    }
    return null;
  };

  const wrapperStyle = { width: 400 };

  return (
    <div style={wrapperStyle}>
      <Calendar
        fullscreen={false}
        value={selectedDate}
        onSelect={onSelectDate}
        cellRender={dateCellRender}
      />
    </div>
  );
};
