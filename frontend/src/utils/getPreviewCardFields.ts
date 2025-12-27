/* eslint-disable @typescript-eslint/no-explicit-any */
import { Report } from "../globalInterfaces";

export const getPreviewCardFields = (report: Report) => {
    const data = report.data as any;

    if (report.type === "daily") {
      const emotions =
        data?.detectedEmotions?.map((e: any) => e.emotion).join(", ") || "N/A";

      const triggers =
        data?.mainTriggers?.slice(0, 2).map((t: any) => t.title).join(", ") || "N/A";

      const overview = data?.insights?.[0] || "N/A";

      return {
        field1: {
          label: "Detected emotions",
          value: emotions,
        },
        field2: {
          label: "Main triggers",
          value: triggers,
        },
        field3: {
          label: "Overview",
          value: overview,
        },
      };
    }

    if (report.type === "weekly_limited" || report.type === "weekly") {
      const dominantEmotion =
        data?.dominantEmotion || data?.detectedEmotions?.[0]?.emotion || "N/A";

      const triggers =
        data?.mainTriggers?.slice(0, 2).map((t: any) => t.title).join(", ") ||
        "N/A";

      const overview = data?.overview || data?.insights?.[0] || "N/A";

      return {
        field1: {
          label: "Dominant emotion",
          value: dominantEmotion,
        },
        field2: {
          label: "Main Triggers",
          value: triggers,
        },
        field3: {
          label: "Overview",
          value: overview,
        },
      };
    }

    return {
      field1: { label: "Field 1", value: "N/A" },
      field2: { label: "Field 2", value: "N/A" },
      field3: { label: "Field 3", value: "N/A" },
    };
  };