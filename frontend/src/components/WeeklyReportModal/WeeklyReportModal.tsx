import { useState } from "react";
import { Modal, DatePicker, message, Spin } from "antd";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { getWeeklyEntries, generateWeeklyReport } from "../../api/aiApi";
import "./WeeklyReportModal.scss";
import { Button } from "../Button/Button";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const WeeklyReportModal = ({
  isOpen,
  onClose,
  onSuccess,
}: WeeklyReportModalProps) => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(false);

  const getWeekRange = (date: dayjs.Dayjs) => {
    const monday = date.startOf("isoWeek");
    const sunday = date.endOf("isoWeek");
    return { monday, sunday };
  };

  const handleGenerateReport = async () => {
    if (!selectedDate) {
      message.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const { monday, sunday } = getWeekRange(selectedDate);
      const startDate = monday.format("YYYY-MM-DD");
      const endDate = sunday.format("YYYY-MM-DD");

      const entries = await getWeeklyEntries(startDate, endDate);

      if (entries.length === 0) {
        message.warning("No entries found for this week");
        return;
      }

      await generateWeeklyReport(entries);
      message.success("Weekly report generated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to generate report:", error);
      message.error(
        error instanceof Error ? error.message : "Failed to generate report"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedDateDisplay = selectedDate ? getWeekRange(selectedDate) : null;

  return (
    <Modal
      title="Generate Weekly Report"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading}>
        <div className="weekly-report-modal">
          <div className="weekly-report-modal__field">
            <label className="weekly-report-modal__label">
              Select a date within the week:
            </label>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              className="weekly-report-modal__datepicker"
              placeholder="Pick a date"
            />
          </div>

          {selectedDateDisplay && (
            <div className="weekly-report-modal__range">
              <p className="weekly-report-modal__range-title">Week range:</p>
              <p className="weekly-report-modal__range-value">
                {selectedDateDisplay.monday.format("MMM DD, YYYY")} –{" "}
                {selectedDateDisplay.sunday.format("MMM DD, YYYY")}
              </p>
            </div>
          )}

          <Button
            variant="primary"
            text="Generate Report"
            onClick={handleGenerateReport}
            disabled={!selectedDate || loading}
          />
        </div>
      </Spin>
    </Modal>
  );
};
