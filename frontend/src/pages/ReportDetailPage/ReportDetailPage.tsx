/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, message } from "antd";
import { getAllReports } from "../../api/aiApi";
import { Report } from "../../globalInterfaces";
import "./ReportDetailPage.scss";
import { getIcon } from "../../utils/getIcon";
import { getDateDisplay } from "../../utils/getDateDisplay";
import { BackButton } from "../../components/BackButton/BackButton";
import { getReportTypeLabel } from "../../utils/getReportTypeLabel";
import { RingLoader } from "react-spinners";
import { Button } from "../../components/Button/Button";
import Emoji from "../../assets/icons/sad-face.svg";
import { SaveInsightModal } from "../../components/SaveInsightModal/SaveInsightModal";
import { AddInsightButton } from "../../components/AddInsightButton/AddInsightButton";
import { createInsight } from "../../api/insights";

export const ReportDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const data = await getAllReports();
      const foundReport = data.find((r: Report) => r.id === Number(id));
      setReport(foundReport || null);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInsight = async (text: string) => {
    setSaving(true);
    try {
      const insightDate = new Date().toISOString().split("T")[0];
      await createInsight(userId, text, insightDate);
      setShowInsightForm(false);
      message.success("Insight saved successfully");
    } catch (error) {
      console.error("Failed to create insight:", error);
      message.error("Failed to save insight");
    } finally {
      setSaving(false);
    }
  };

  const renderDailyReport = (data: any) => (
    <div className="report-detail-page__content">
      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">
          Detected Emotions in Your Entry:
        </h3>
        <p>After analyzing your text, I identified several emotional tones:</p>
        <ul>
          {data?.detectedEmotions?.map((emotion: any, idx: number) => (
            <li key={idx}>
              <strong>{emotion.emotion}</strong> — {emotion.explanation}
            </li>
          ))}
        </ul>
        {data?.emotionComparison && (
          <>
            <p>
              <strong>Comparison to the emotions you selected</strong>
            </p>
            <p>{data.emotionComparison.explanation}</p>
          </>
        )}
      </section>

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Main Emotional Triggers:</h3>
        {data?.mainTriggers?.map((trigger: any, idx: number) => (
          <div key={idx}>
            <p>
              <strong>
                {idx + 1}. {trigger.title}
              </strong>
            </p>
            <p>{trigger.description}</p>
          </div>
        ))}
      </section>

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Emotional Insights:</h3>
        {data?.insights?.map((insight: string, idx: number) => (
          <p key={idx}>
            <strong>Insight {idx + 1}:</strong> {insight}
          </p>
        ))}
      </section>

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Recommendations:</h3>
        {data?.recommendations?.map((rec: any, idx: number) => (
          <div key={idx}>
            <p>
              <strong>
                {idx + 1}. {rec.action}
              </strong>
            </p>
            <p>{rec.description}</p>
          </div>
        ))}
      </section>
    </div>
  );

  const renderWeeklyReport = (data: any, isLimited: boolean) => (
    <div className="report-detail-page__content">
      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Dominant emotion:</h3>
        <span className="report-detail-page__highlight">
          {data?.dominantEmotion || data?.detectedEmotions?.[0]?.emotion}
        </span>
      </section>

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Main triggers:</h3>
        {data?.mainTriggers?.map((trigger: any, idx: number) => (
          <div key={idx}>
            <p>
              <strong>
                {idx + 1}. {trigger.title}
              </strong>
            </p>
            <p>{trigger.description}</p>
          </div>
        ))}
      </section>

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Overview:</h3>
        <p>{data?.overview || data?.insights?.[0]}</p>
      </section>

      {!isLimited && data?.recurringPatterns && (
        <section className="report-detail-page__section">
          <h3 className="report-detail-page__field">Recurring patterns:</h3>
          {data.recurringPatterns.map((pattern: any, idx: number) => (
            <div key={idx}>
              <p>
                <strong>
                  {idx + 1}. {pattern.title}
                </strong>
              </p>
              <p>{pattern.description}</p>
            </div>
          ))}
        </section>
      )}

      <section className="report-detail-page__section">
        <h3 className="report-detail-page__field">Recommendations</h3>
        {data?.recommendations?.map((rec: any, idx: number) => (
          <div key={idx}>
            <p>
              <strong>
                {idx + 1}. {rec.action}
              </strong>
            </p>
            <p>{rec.description}</p>
          </div>
        ))}
      </section>

      {isLimited && data?.note && (
        <section className="report-detail-page__section report-detail-page__note">
          <p>{data.note}</p>
        </section>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="report-detail-page__loading">
        <RingLoader color="#7c3aed" size={60} />
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <BackButton />
        <div className="report-detail-page__empty">
          <img
            src={Emoji}
            alt="icon"
            className="report-detail-page__empty-icon"
          />
          <h2>Report is not found</h2>
          <Button
            text="Go back"
            onClick={() => navigate(-1)}
            variant="blue"
            size="large"
          />
        </div>
      </div>
    );
  }

  const data = report.data as any;

  return (
    <div className="report-detail-page">
      <Breadcrumb
        items={[
          { title: "All reports", href: "/reports" },
          { title: `Report #${id}` },
        ]}
        className="report-detail-page__breadcrumb"
      />
      <BackButton />
      <div className="report-detail-page__container">
        <div className="report-detail-page__header">
          <div className="report-detail-page__title">
            <img
              className="report-detail-page__icon"
              src={getIcon(report)}
              alt="icon"
            />
            <h2>{getDateDisplay(report)}</h2>
          </div>
          <p>{getReportTypeLabel(report)}</p>
        </div>

        {error && <p className="report-detail-page__error">{error}</p>}

        {report.type === "daily"
          ? renderDailyReport(data)
          : renderWeeklyReport(data, report.type === "weekly_limited")}
      </div>
      <div className="report-detail-page__fab">
        {showInsightForm && (
          <div className="report-detail-page__fab-form">
            <SaveInsightModal
              onSave={handleCreateInsight}
              onCancel={() => setShowInsightForm(false)}
              saving={saving}
            />
          </div>
        )}

        <AddInsightButton onClick={() => setShowInsightForm(true)} />
      </div>
    </div>
  );
};
