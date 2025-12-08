export type WeeklyEntry = {
  text: string;
  emotions: string[];
  date: string;
};

export interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}