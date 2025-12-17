import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../logger";

import {
  buildChatPrompt,
  buildDailyPrompt,
  buildLimitedWeeklyPrompt,
  buildWeeklyPrompt,
} from "../utils/promptBuilder";

import {
  AI_MODEL,
  MAX_ENTRY_LENGTH,
  MAX_WEEKLY_ENTRIES,
  MIN_ENTRY_LENGTH,
  MIN_WEEKLY_ENTRIES,
} from "../constants/ai.config";

import { isGibberish } from "../utils/isGibberish";
import { containsInappropriateContent } from "../utils/containsInappropriateContent";

import { SYSTEM_PROMPT } from "../constants/system.prompt";
import { CRISIS_RESPONSE } from "../constants/crisis.response";

import { WeeklyEntry } from "../types";
import { cleanAIJson } from "../utils/cleanAiJson";
import { handleAIError } from "../utils/aiErrorHandler";
import { ValidationError } from "../errors/validation.error";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const chatHistory: Record<string, any[]> = {};

export class AIService {
  private static model = genAI.getGenerativeModel({
    model: AI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  static async chat(userId: string, message: string): Promise<string> {
    logger.info({
      type: "CHAT_REQUEST",
      userId,
      message,
      length: message?.length,
    });

    if (!message.trim()) throw new ValidationError("Message cannot be empty.");
    if (message.trim().length < 2)
      throw new ValidationError(
        "Message is too short. Please write at least a few words."
      );

    if (containsInappropriateContent(message)) {
      logger.warn({
        type: "CHAT_INAPPROPRIATE_CONTENT",
        userId,
        message,
      });
      return CRISIS_RESPONSE;
    }

    if (isGibberish(message)) {
      logger.warn({
        type: "CHAT_GIBBERISH",
        userId,
        message,
      });
      throw new ValidationError(
        "Your message contains unreadable characters. Please write a meaningful message"
      );
    }

    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push({ role: "user", parts: [{ text: message }] });

    try {
      const chat = this.model.startChat({ history: chatHistory[userId] });
      const result = await chat.sendMessage(message);
      const text = result.response.text();

      if (!text) throw new Error("Received empty response from AI");

      logger.info({
        type: "CHAT_RESPONSE",
        userId,
        responsePreview: text.slice(0, 100),
      });

      chatHistory[userId].push({ role: "model", parts: [{ text }] });

      return text;
    } catch (error: any) {
      logger.error({
        type: "CHAT_ERROR",
        userId,
        error: error.message,
        stack: error.stack,
      });
      handleAIError(error);
    }
  }

  static async dailyAnalysis(
    entryText: string,
    selectedEmotions: string[] = []
  ): Promise<string> {
    logger.info({
      type: "DAILY_ANALYSIS_REQUEST",
      textLength: entryText?.length,
      emotions: selectedEmotions,
    });

    if (!selectedEmotions?.length)
      throw new ValidationError("Please select at least one emotion.");

    const validEmotions = selectedEmotions.filter((e) => e?.trim());
    if (!validEmotions.length)
      throw new ValidationError("Please select at least one valid emotion.");

    if (!entryText?.trim()) throw new ValidationError("Entry cannot be empty.");
    if (entryText.trim().length < MIN_ENTRY_LENGTH)
      throw new ValidationError(
        `Message is too short. Minimum ${MIN_ENTRY_LENGTH} characters.`
      );
    if (entryText.length > MAX_ENTRY_LENGTH)
      throw new ValidationError(
        `Entry is too long. Maximum ${MAX_ENTRY_LENGTH} characters.`
      );

    if (containsInappropriateContent(entryText)) {
      logger.warn({
        type: "DAILY_INAPPROPRIATE_CONTENT",
        entryText,
      });
      return CRISIS_RESPONSE;
    }

    if (isGibberish(entryText))
      throw new ValidationError("Entry contains unreadable characters.");

    const prompt = buildDailyPrompt(entryText, validEmotions);

    try {
      const rawResponse = await this.model.generateContent(prompt);
      const cleaned = cleanAIJson(rawResponse.response.text());

      logger.info({
        responsePreview: String(JSON.stringify(cleaned)).slice(0, 100),
      });

      return cleaned;
    } catch (error: any) {
      logger.error({
        type: "DAILY_ANALYSIS_ERROR",
        error: error.message,
        stack: error.stack,
      });
      handleAIError(error);
    }
  }

  static async weeklyAnalysis(entries: WeeklyEntry[]): Promise<string> {
    logger.info({
      type: "WEEKLY_ANALYSIS_REQUEST",
      entriesCount: entries?.length,
    });

    if (!entries || !Array.isArray(entries))
      throw new ValidationError("Entries must be an array.");

    if (!entries.length) throw new ValidationError("No entries found.");

    if (entries.length > MAX_WEEKLY_ENTRIES)
      throw new ValidationError(`Too many entries. Max ${MAX_WEEKLY_ENTRIES}.`);

    entries.forEach((entry, i) => {
      if (!entry.text?.trim())
        throw new ValidationError(`Entry for day ${i + 1} cannot be empty.`);

      if (entry.text.trim().length < MIN_ENTRY_LENGTH)
        throw new ValidationError(
          `Entry for day ${
            i + 1
          } is too short. Minimum ${MIN_ENTRY_LENGTH} characters.`
        );

      if (entry.text.length > MAX_ENTRY_LENGTH)
        throw new ValidationError(
          `Entry for day ${
            i + 1
          } is too long. Maximum ${MAX_ENTRY_LENGTH} characters.`
        );

      if (isGibberish(entry.text))
        throw new ValidationError(
          `Entry for day ${i + 1} contains unreadable text.`
        );
    });

    const validEntries = entries.filter((e) => e.text.trim().length);

    if (validEntries.length < MIN_WEEKLY_ENTRIES) {
      return this.generateLimitedWeeklyReport(validEntries);
    }

    const prompt = buildWeeklyPrompt(validEntries);

    try {
      const rawResponse = await this.model.generateContent(prompt);
      const cleaned = cleanAIJson(rawResponse.response.text());

      logger.info({
        type: "WEEKLY_ANALYSIS_RESPONSE",
        length: cleaned.length,
      });

      return cleaned;
    } catch (error: any) {
      logger.error({
        type: "WEEKLY_ANALYSIS_ERROR",
        error: error.message,
        stack: error.stack,
      });
      handleAIError(error);
    }
  }

  private static async generateLimitedWeeklyReport(
    entries: WeeklyEntry[]
  ): Promise<string> {
    logger.info({
      type: "LIMITED_WEEKLY_REPORT_REQUEST",
      entriesCount: entries.length,
    });

    const prompt = buildLimitedWeeklyPrompt(entries);

    try {
      const rawResponse = await this.model.generateContent(prompt);
      const cleaned = cleanAIJson(rawResponse.response.text());

      logger.info({
        type: "LIMITED_WEEKLY_REPORT_RESPONSE",
        responsePreview: String(JSON.stringify(cleaned)).slice(0, 100),
      });

      return cleaned;
    } catch (error: any) {
      logger.error({
        type: "LIMITED_WEEKLY_REPORT_ERROR",
        error: error.message,
        stack: error.stack,
      });
      handleAIError(error);
    }
  }
}
