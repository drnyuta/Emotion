import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildChatPrompt,
  buildDailyPrompt,
  buildLimitedWeeklyPrompt,
  buildWeeklyPrompt,
} from "../utils/promptBuilder";
import {
  AI_MODEL,
  CRISIS_RESPONSE,
  MAX_ENTRY_LENGTH,
  MAX_MESSAGE_LENGTH,
  MAX_WEEKLY_ENTRIES,
  MIN_ENTRY_LENGTH,
  MIN_WEEKLY_ENTRIES,
  SYSTEM_PROMPT,
} from "../constants";
import { isGibberish } from "../utils/isGibberish";
import { containsInappropriateContent } from "../utils/inappropriateContent";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const chatHistory: Record<string, any[]> = {};

export class AIService {
  private static model = genAI.getGenerativeModel({
    model: AI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  static async chat(userId: string, message: string): Promise<string> {
    try {
      if (!message.trim()) {
        throw new Error("Message cannot be empty. Please write something.");
      }

      if (message.trim().length < 2) {
        throw new Error(
          "Message is too short. Please write at least a few words."
        );
      }

      if (containsInappropriateContent(message)) {
        return CRISIS_RESPONSE;
      }

      if (!chatHistory[userId]) {
        chatHistory[userId] = [];
      }

      chatHistory[userId].push({
        role: "user",
        parts: [{ text: message }],
      });

      const chat = this.model.startChat({
        history: chatHistory[userId],
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error("Received empty response from AI");
      }

      chatHistory[userId].push({
        role: "model",
        parts: [{ text }],
      });

      return text;
    } catch (error: any) {
      console.error("Chat error:", error);

      if (error.message?.includes("safety")) {
        throw new Error(
          "Content was filtered for safety reasons. Please rephrase your message."
        );
      }

      if (error.message.includes("503")) {
        throw new Error("AI service temporarily unavailable.");
      }

      if (error.message.includes("rate")) {
        throw new Error("AI rate limit exceeded. Try again later.");
      }

      if (
        error.message?.includes("empty") ||
        error.message?.includes("too short") ||
        error.message?.includes("too long")
      ) {
        throw error;
      }
      throw new Error("Failed to generate chat response. Please try again.");
    }
  }

  static async dailyAnalysis(
    entryText: string,
    selectedEmotions: string[] = []
  ): Promise<string> {
    try {
      if (!selectedEmotions || selectedEmotions.length === 0) {
        throw new Error("Please select at least one emotion for analysis.");
      }

      const validEmotions = selectedEmotions.filter((e) => e && e.trim());

      if (validEmotions.length === 0) {
        throw new Error(
          "Please select at least one valid emotion for analysis."
        );
      }

      if (entryText && entryText.trim()) {
        if (entryText.trim().length < MIN_ENTRY_LENGTH) {
          throw new Error(
            `Entry text is too short. Please write at least ${MIN_ENTRY_LENGTH} characters to get meaningful analysis.`
          );
        }

        if (entryText.length > MAX_ENTRY_LENGTH) {
          throw new Error(
            `Entry text is too long. Maximum length is ${MAX_ENTRY_LENGTH} characters.`
          );
        }

        if (containsInappropriateContent(entryText)) {
          return CRISIS_RESPONSE;
        }

        if (isGibberish(entryText)) {
          throw new Error(
            "It looks like your entry contains unreadable characters. Please write meaningful text in English."
          );
        }
      }

      const prompt = buildDailyPrompt(entryText || "", validEmotions);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      const text = response.text();

      if (!text || !text.trim()) {
        throw new Error("Received empty response from AI");
      }

      return text;
    } catch (error: any) {
      console.error("Daily analysis error:", error);

      if (error.message.includes("503")) {
        throw new Error("AI service temporarily unavailable.");
      }
      if (error.message.includes("rate")) {
        throw new Error("AI rate limit exceeded. Try again later.");
      }

      if (error.message?.includes("safety")) {
        throw new Error(
          "Content was filtered for safety reasons. Please rephrase your entry."
        );
      }

      if (
        error.message?.includes("emotion") ||
        error.message?.includes("too short") ||
        error.message?.includes("too long") ||
        error.message?.includes("unreadable characters")
      ) {
        throw error;
      }

      throw new Error("Failed to generate daily analysis. Please try again.");
    }
  }

  static async weeklyAnalysis(entries: string[]): Promise<string> {
    try {
      if (!entries || !Array.isArray(entries)) {
        throw new Error("Entries must be an array");
      }

      if (entries.length === 0) {
        throw new Error(
          "No entries found. Please add some journal entries first."
        );
      }

      if (entries.length > MAX_WEEKLY_ENTRIES) {
        throw new Error(
          `Too many entries. Maximum is ${MAX_WEEKLY_ENTRIES} days.`
        );
      }

      const validEntries = entries.filter((entry) => {
        return entry && typeof entry === "string" && entry.trim().length > 0;
      });

      if (validEntries.length < MIN_WEEKLY_ENTRIES) {
        return this.generateLimitedWeeklyReport(validEntries);
      }

      validEntries.forEach((entry, index) => {
        if (entry.length > MAX_ENTRY_LENGTH) {
          throw new Error(
            `Entry for day ${
              index + 1
            } is too long. Maximum length is ${MAX_ENTRY_LENGTH} characters.`
          );
        }

        if (entry.trim() && isGibberish(entry)) {
          throw new Error(
            `Entry for day ${
              index + 1
            } contains unreadable text. Please write meaningful journal entries.`
          );
        }
      });

      const prompt = buildWeeklyPrompt(validEntries);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      const text = response.text();

      if (!text || !text.trim()) {
        throw new Error("Received empty response from AI");
      }

      return text;
    } catch (error: any) {
      console.error("Weekly report error:", error);

      if (error.message.includes("503")) {
        throw new Error("AI service temporarily unavailable.");
      }

      if (error.message.includes("rate")) {
        throw new Error("AI rate limit exceeded. Try again later.");
      }

      if (error.message?.includes("safety")) {
        throw new Error(
          "Content was filtered for safety reasons. Please review your entries."
        );
      }

      if (
        error.message?.includes("No entries") ||
        error.message?.includes("Too many entries") ||
        error.message?.includes("must be an array") ||
        error.message?.includes("invalid text") ||
        error.message?.includes("too long")
      ) {
        throw error;
      }

      throw new Error("Failed to generate weekly report. Please try again.");
    }
  }

  private static async generateLimitedWeeklyReport(
    entries: string[]
  ): Promise<string> {
    try {
      const prompt = buildLimitedWeeklyPrompt(entries);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      const text = response.text();

      if (!text || !text.trim()) {
        throw new Error("Received empty response from AI");
      }

      return text;
    } catch (error: any) {
      console.error("Limited weekly report error:", error);

      if (error.message.includes("503")) {
        throw new Error("AI service temporarily unavailable.");
      }

      if (error.message.includes("rate")) {
        throw new Error("AI rate limit exceeded. Try again later.");
      }

      if (error.message?.includes("safety")) {
        throw new Error(
          "Content was filtered for safety reasons. Please review your entries."
        );
      }

      if (
        error.message?.includes("No entries") ||
        error.message?.includes("Too many entries") ||
        error.message?.includes("must be an array") ||
        error.message?.includes("invalid text") ||
        error.message?.includes("too long")
      ) {
        throw error;
      }

      throw new Error("Failed to generate weekly report. Please try again.");
    }
  }
}
