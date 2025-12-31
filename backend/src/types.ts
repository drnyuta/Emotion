export type WeeklyEntry = {
  text: string;
  emotions: string[];
  date: string;
};

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export type ReportType = "daily" | "weekly" | "weekly_limited";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  timezone: string;
  created_at: Date;
}