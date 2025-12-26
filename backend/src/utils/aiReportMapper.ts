import { AIReportRow } from "../repositories/aiReports.repository";
import { ReportType } from "../types";
import { normalizeDate } from "./normalizeDate";

export function mapAIReportToDTO(report: AIReportRow) {
  const type: ReportType =
    report.report_type === "daily"
      ? "daily"
      : report.content?.limitedData
      ? "weekly_limited"
      : "weekly";

  const content = report.content || {};

  const base = {
    id: report.id,
    type,
    reportDate: normalizeDate(report.report_date),
    reportEndDate: normalizeDate(report.report_end_date),
  };

  if (type === "daily") {
    return {
      ...base,
      data: {
        detectedEmotions: content.detectedEmotions,
        emotionComparison: content.emotionComparison
          ? { explanation: content.emotionComparison.explanation }
          : undefined,
        mainTriggers: content.mainTriggers,
        insights: content.insights,
        recommendations: content.recommendations,
      },
    };
  }

  if (type === "weekly_limited") {
    return {
      ...base,
      data: {
        detectedEmotions: content.detectedEmotions,
        mainTriggers: content.mainTriggers,
        insights: content.insights,
        recommendations: content.recommendations,
        note: content.note,
      },
    };
  }

  return {
    ...base,
    data: {
      dominantEmotion: content.dominantEmotion,
      mainTriggers: content.mainTriggers,
      overview: content.overview,
      recurringPatterns: content.recurringPatterns,
      recommendations: content.recommendations,
    },
  };
}