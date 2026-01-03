import { Report } from "../globalInterfaces";

export const getDateDisplay = (report: Report) => {
    const startDate = new Date(report.reportDate).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    if (report.reportEndDate && report.type !== "daily") {
      const endDate = new Date(report.reportEndDate).toLocaleDateString(
        "en-US",
        { day: "numeric" }
      );
      return `${startDate} – ${endDate}`;
    }
    return startDate;
  };