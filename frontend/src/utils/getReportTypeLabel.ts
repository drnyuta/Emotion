import { Report } from "../globalInterfaces";

export const getReportTypeLabel = (report: Report) => {
    if (report.type === "daily") return "Daily report";
    return "Weekly report";
  };