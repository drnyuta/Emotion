import { useState, useEffect } from "react";
import { message } from "antd";
import { RingLoader } from "react-spinners";
import { InsightCard } from "../../components/InsightCard/InsightCard";
import { AddInsightButton } from "../../components/AddInsightButton/AddInsightButton";
import { SaveInsightModal } from "../../components/SaveInsightModal/SaveInsightModal";
import {
  getAllInsights,
  createInsight,
  updateInsight,
  deleteInsight,
} from "../../api/insights";
import "./InsightsPage.scss";
import { Insight } from "../../globalInterfaces";

export const InsightsPage = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const data = await getAllInsights();
      setInsights(data || []);
    } catch (error) {
      console.error("Failed to fetch insights:", error);
      message.error("Failed to load insights");
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (text: string) => {
    setSaving(true);
    try {
      const insightDate = new Date().toISOString().split("T")[0];
      const newInsight = await createInsight(text, insightDate);
      setInsights([newInsight, ...insights]);
      setShowCreateForm(false);
      message.success("Insight saved successfully");
    } catch (error) {
      console.error("Failed to create insight:", error);
      message.error("Failed to save insight");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (insightId: number, newText: string) => {
    try {
      const updatedInsight = await updateInsight(insightId, newText);
      setInsights(
        insights.map((ins) => (ins.id === insightId ? updatedInsight : ins))
      );
      message.success("Insight updated successfully");
    } catch (error) {
      console.error("Failed to update insight:", error);
      message.error("Failed to update insight");
    }
  };

  const handleDelete = async (insightId: number) => {
    try {
      await deleteInsight(insightId);
      setInsights(insights.filter((ins) => ins.id !== insightId));
      message.success("Insight deleted successfully");
    } catch (error) {
      console.error("Failed to delete insight:", error);
      message.error("Failed to delete insight");
    }
  };

  return (
    <div className="insights-page">
      <h1>Insights</h1>
      <div className="insights-page__header">
        <p className="insights-page__description">
          Your personal emotional insights, gently organized to help you
          understand yourself better. You can look through your{" "}
          <a href="/reports">reports</a> and save meaningful ideas. Or add them
          right here
        </p>
        <div className="insights-page__add">
          {showCreateForm && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                marginBottom: 0,
                zIndex: 10,
              }}
            >
              <SaveInsightModal
                onSave={handleCreate}
                onCancel={() => setShowCreateForm(false)}
                saving={saving}
              />
            </div>
          )}

          <AddInsightButton onClick={() => setShowCreateForm(true)} />
        </div>
      </div>

      {loading ? (
        <div className="insights-page__loading">
          <RingLoader color="#7c3aed" size={60} />
        </div>
      ) : insights.length === 0 ? (
        <div className="insights-page__empty">
          <p>No insights yet. Add your first one!</p>
        </div>
      ) : (
        <div className="insights-page__list">
          {insights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};
