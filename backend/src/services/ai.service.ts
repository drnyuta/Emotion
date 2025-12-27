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

import { SortOption, WeeklyEntry } from "../types";
import { cleanAIJson } from "../utils/cleanAiJson";
import { handleAIError } from "../utils/aiErrorHandler";
import { ValidationError } from "../errors/validation.error";
import { AIReportsRepository } from "../repositories/aiReports.repository";
import { mapAIReportToDTO } from "../utils/aiReportMapper";
import { client } from "../database";

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
    selectedEmotions: string[] = [],
    userId: number,
    entryId: number
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

      await this.saveReport({
        userId,
        entryId,
        reportType: "daily",
        reportDate: new Date().toLocaleDateString("en-CA"),
        content: cleaned,
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

  static async weeklyAnalysis(
    entries: WeeklyEntry[],
    userId: number
  ): Promise<string> {
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

    const reportStartDate = validEntries[0].date;
    const reportEndDate = validEntries[validEntries.length - 1].date;

    if (validEntries.length < MIN_WEEKLY_ENTRIES) {
      return this.generateLimitedWeeklyReport(
        validEntries,
        userId,
        reportStartDate,
        reportEndDate
      );
    }

    const prompt = buildWeeklyPrompt(validEntries);

    try {
      const rawResponse = await this.model.generateContent(prompt);
      const cleaned = cleanAIJson(rawResponse.response.text());

      logger.info({
        type: "WEEKLY_ANALYSIS_RESPONSE",
        length: cleaned.length,
      });

      await this.saveReport({
        userId,
        reportType: "weekly",
        reportDate: reportStartDate,
        reportEndDate: reportEndDate,
        content: cleaned,
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
    entries: WeeklyEntry[],
    userId: number,
    reportStartDate: string,
    reportEndDate: string
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

      await this.saveReport({
        userId,
        reportType: "weekly",
        reportDate: reportStartDate,
        reportEndDate: reportEndDate,
        content: cleaned,
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

  static async getAllReports(
    userId: number,
    options?: {
      type?: "daily" | "weekly";
      sort?: SortOption;
    }
  ) {
    const reports = await AIReportsRepository.findAllByUserId(userId);

    let filtered = reports;

    if (options?.type === "daily") {
      filtered = filtered.filter((r) => r.report_type === "daily");
    }

    if (options?.type === "weekly") {
      filtered = filtered.filter((r) => r.report_type === "weekly");
    }

    if (options?.sort === "lastMonth") {
      const from = new Date();
      from.setMonth(from.getMonth() - 1);

      filtered = filtered.filter((r) => new Date(r.report_date) >= from);
    }

    if (options?.sort === "oldest") {
      filtered.sort(
        (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
      );
    } else {
      filtered.sort(
        (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
      );
    }

    return filtered.map(mapAIReportToDTO);
  }

  static async saveReport(params: {
    userId: number;
    entryId?: number | null;
    reportType: "daily" | "weekly";
    reportDate: string;
    reportEndDate?: string | null;
    content: any;
  }) {
    const {
      userId,
      entryId = null,
      reportType,
      reportDate,
      reportEndDate = null,
      content,
    } = params;

    const query = `
      INSERT INTO ai_reports
        (user_id, entry_id, report_type, report_date, report_end_date, content, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      userId,
      entryId,
      reportType,
      reportDate,
      reportEndDate,
      content,
    ];

    const result = await client.query(query, values);

    return result.rows[0];
  }

  static async deleteReport(reportId: number, userId: number): Promise<void> {
    logger.info({
      type: "DELETE_REPORT_REQUEST",
      reportId,
      userId,
    });

    if (!reportId) {
      throw new ValidationError("Report ID is required.");
    }

    const deleted = await AIReportsRepository.deleteReport(reportId, userId);

    if (!deleted) {
      throw new ValidationError("Report not found or already deleted.");
    }

    logger.info({
      type: "DELETE_REPORT_SUCCESS",
      reportId,
      userId,
    });
  }
}
