export type WeeklyEntry = {
  text: string;
  emotions: string[];
  date: string;
};

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export type SortOption = "newest" | "oldest" | "lastMonth";

export type ReportType = "daily" | "weekly" | "weekly_limited";
