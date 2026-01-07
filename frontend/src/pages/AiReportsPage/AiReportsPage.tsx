/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToggleButton } from "../../components/ToggleButton/ToggleButton";
import { ReportCard } from "../../components/ReportCard/ReportCard";
import {
  MONTH_OPTIONS,
  SORT_OPTIONS,
  YEAR_OPTIONS,
} from "../../constants/sortOptions";
import { getAllReports, deleteReport } from "../../api/aiApi";
import { Report } from "../../globalInterfaces";
import "./AiReportsPage.scss";
import { RingLoader } from "react-spinners";
import Emoji from "../../assets/icons/sad-face.svg";
import { Button } from "../../components/Button/Button";
import { WeeklyReportModal } from "../../components/WeeklyReportModal/WeeklyReportModal";

const currentYear = new Date().getFullYear();

export const AiReportsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [period, setPeriod] = useState(searchParams.get("type") || "Weekly");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [selectedYear, setSelectedYear] = useState<number>(
    parseInt(searchParams.get("year") || String(currentYear))
  );
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(
    searchParams.get("month") ? parseInt(searchParams.get("month")!) : 0
  );
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [period, sortBy, selectedYear, selectedMonth]);

  useEffect(() => {
    const params: any = {};
    if (period !== "Weekly") params.type = period.toLowerCase();
    if (sortBy !== "newest") params.sort = sortBy;
    if (selectedYear !== currentYear) params.year = selectedYear;
    if (selectedMonth) params.month = selectedMonth;
    setSearchParams(params);
  }, [period, sortBy, selectedYear, selectedMonth]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const type = period === "Daily" ? "daily" : "weekly";
      const data = await getAllReports({
        type,
        sort: sortBy as "newest" | "oldest",
        year: selectedYear,
        month: selectedMonth,
      });
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  const handleDelete = (reportId: number) => {
    Modal.confirm({
      title: "Delete report",
      content: "Are you sure you want to delete this report?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: {
        type: "primary",
      },
      onOk: async () => {
        try {
          await deleteReport(reportId);
          setReports((prev) => prev.filter((r) => r.id !== reportId));
          message.success("Report deleted successfully");
        } catch (error) {
          console.error("Failed to delete report:", error);
          message.error("Failed to delete report");
        }
      },
    });
  };

  return (
    <div className="reports-page">
      <h1>AI Reports</h1>
      <div>
        <Button
          variant="primary"
          text="Generate Weekly Report"
          onClick={() => setIsModalOpen(true)}
          fullWidth={false}
        />
      </div>
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
        <div className="reports-page__filters-item">
          <h3>Year:</h3>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            options={YEAR_OPTIONS}
            className="reports-page__select"
          />
        </div>

        <div className="reports-page__filters-item">
          <h3>Month:</h3>
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            options={MONTH_OPTIONS}
            className="reports-page__select"
          />
        </div>
      </div>

      {error && <p className="reports-page__error">{error}</p>}

      <div className="reports-page__content">
        {loading && (
          <div className="reports-page__loading">
            <RingLoader color="#7c3aed" size={60} />
          </div>
        )}
        {reports.length === 0 && !error && !loading ? (
          <div className="reports-page__empty">
            <img src={Emoji} alt="icon" className="reports-page__empty-icon" />
            <h2>You don't have any generated reports for now</h2>
            <p>Create an entry to have AI feedback!</p>
            <Button
              text="Create"
              onClick={() => navigate("/")}
              variant="blue"
              size="large"
            />
          </div>
        ) : (
          <div className="reports-page__cards">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onViewMore={handleViewMore}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <WeeklyReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchReports()}
      />
    </div>
  );
};
