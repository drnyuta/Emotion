import { GoogleGenerativeAI } from "@google/generative-ai";
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
    if (!message.trim()) throw new ValidationError("Message cannot be empty.");
    if (message.trim().length < 2)
      throw new ValidationError(
        "Message is too short. Please write at least a few words."
      );
    if (containsInappropriateContent(message)) return CRISIS_RESPONSE;
    if (isGibberish(message))
      throw new ValidationError(
        "It looks like your entry contains unreadable characters. Please write a meaningful message."
      );

    if (!chatHistory[userId]) chatHistory[userId] = [];
    chatHistory[userId].push({ role: "user", parts: [{ text: message }] });

    try {
      const chat = this.model.startChat({ history: chatHistory[userId] });
      const result = await chat.sendMessage(message);
      const text = result.response.text();
      if (!text) throw new Error("Received empty response from AI");

      chatHistory[userId].push({ role: "model", parts: [{ text }] });
      return text;
    } catch (error: any) {
      console.error("Chat error:", error);
      handleAIError(error);
    }
  }

  static async dailyAnalysis(
    entryText: string,
    selectedEmotions: string[] = []
  ): Promise<string> {
    if (!selectedEmotions?.length)
      throw new ValidationError("Please select at least one emotion.");
    const validEmotions = selectedEmotions.filter((e) => e?.trim());
    if (!validEmotions.length)
      throw new ValidationError("Please select at least one valid emotion.");

    if (!entryText?.trim()) throw new ValidationError("Entry cannot be empty.");
    if (entryText.trim().length < MIN_ENTRY_LENGTH)
      throw new ValidationError(
        `Message is too short. Write at least ${MIN_ENTRY_LENGTH} characters.`
      )
    if (entryText.length > MAX_ENTRY_LENGTH)
      throw new ValidationError(
        `Entry text is too long. Maximum ${MAX_ENTRY_LENGTH} characters.`
      );
    if (containsInappropriateContent(entryText)) return CRISIS_RESPONSE;
    if (isGibberish(entryText))
      throw new ValidationError(
        "It looks like your entry contains unreadable characters. Please write a meaningful message."
      );

    const prompt = buildDailyPrompt(entryText, validEmotions);
    try {
      const rawResponse = await this.model.generateContent(prompt);
      return cleanAIJson(rawResponse.response.text());
    } catch (error: any) {
      console.error("Daily analysis error:", error);
      handleAIError(error);
    }
  }

  static async weeklyAnalysis(entries: WeeklyEntry[]): Promise<string> {
    if (!entries || !Array.isArray(entries))
      throw new ValidationError("Entries must be an array.");
    if (!entries.length)
      throw new ValidationError(
        "No entries found. Please add some journal entries first."
      );
    if (entries.length > MAX_WEEKLY_ENTRIES)
      throw new ValidationError(
        `Too many entries. Maximum is ${MAX_WEEKLY_ENTRIES} days.`
      );

    const validEntries = entries.filter((e) => e?.text?.trim().length);
    validEntries.forEach((entry, index) => {
      if (entry.text.length > MAX_ENTRY_LENGTH)
        throw new ValidationError(
          `Entry for day ${
            index + 1
          } is too long. Maximum ${MAX_ENTRY_LENGTH} characters.`
        );
      if (isGibberish(entry.text))
        throw new ValidationError(
          `Entry for day ${index + 1} contains unreadable text.`
        );
    });

    if (validEntries.length < MIN_WEEKLY_ENTRIES)
      return this.generateLimitedWeeklyReport(validEntries);

    const prompt = buildWeeklyPrompt(validEntries);
    try {
      const rawResponse = await this.model.generateContent(prompt);
      return cleanAIJson(rawResponse.response.text());
    } catch (error: any) {
      console.error("Weekly report error:", error);
      handleAIError(error);
    }
  }

  private static async generateLimitedWeeklyReport(
    entries: WeeklyEntry[]
  ): Promise<string> {
    const prompt = buildLimitedWeeklyPrompt(entries);
    try {
      const rawResponse = await this.model.generateContent(prompt);
      return cleanAIJson(rawResponse.response.text());
    } catch (error: any) {
      console.error("Limited weekly report error:", error);
      handleAIError(error);
    }
  }
}
