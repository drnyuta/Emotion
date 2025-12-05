import { MIN_WEEKLY_ENTRIES } from "../constants";

export function buildDailyPrompt(
  entryText: string,
  selectedEmotions: string[] = []
) {
  return `
Task: Generate a DAILY emotional analysis for a user's journal entry.

Instructions:
- Follow this EXACT structure with these headings (use bold markdown for headings):
  
  **Detected Emotions in Your Entry**
  - Start with: "After analyzing your text, I identified several emotional tones:"
  - Use bullet points (with *) to list specific emotions with brief explanations
  - Format: "* Emotion — explanation of how it appears in the text"
  - After listing emotions, add a line break and write: "Comparison to the emotions you selected"
  - Next line: "You chose: [list emotions]. The analysis [fully supports/partially supports/doesn't fully match] these."
  - If additional emotions found: "Additional emotions found in the text: — [emotion], — [emotion]"
  
  **Main Emotional Triggers**
  - Use numbered list (1., 2., 3., etc.)
  - Each trigger should have a brief bold title on first line
  - Follow with explanation on next line
  
  **Emotional Insights**
  - Number each insight (Insight 1:, Insight 2:, etc.)
  - Each insight should be 2-3 sentences explaining a pattern or discovery
  
  **Recommendations**
  - Use numbered list (1., 2., 3., etc.)
  - Each recommendation should start with a bold action title
  - Follow with 1-2 short explanatory sentences (indented or on new lines)
  - Keep practical and actionable

Formatting rules:
- Use markdown bold (**text**) for main section headings only
- "Comparison to the emotions you selected" is NOT a bold heading - it's text within the Detected Emotions section
- Use bullet points (*) for emotion lists
- Use numbered lists (1., 2., 3.) for triggers and recommendations
- Keep paragraphs short and clear
- Use em dash (—) for explanations in lists

User Entry:
${entryText}

User-selected emotions: ${selectedEmotions.join(", ") || "None"}

Maintain supportive and analytical tone. Strictly follow this structure and formatting. Do not provide any medical or clinical advice.
`;
}

export function buildWeeklyPrompt(entries: string[]) {
  const formattedEntries = entries
    .map((e, i) => `Day ${i + 1}: ${e}`)
    .join("\n");

  return `
Task: Generate a WEEKLY emotional report from multiple user diary entries.

Instructions:
- Follow this EXACT structure with these headings:

  **Dominant emotion:** [Single emotion name]
  
  **Main trigger:** [Brief description (no more than 4 words)]
  
  **Overview:**
  - Write a comprehensive paragraph (4-6 sentences) summarizing the entire week
  - Include: general emotional state, fluctuations, positive moments, overall patterns
  - Mention emotional awareness and personal growth observations
  
  **Recurring patterns:**
  - Find recurring patterns in the entries during the week
  - Use numbered list (1., 2., 3., etc.)
  - Each pattern should have a bold title followed by explanation
  - Format: "**Pattern name** Description of the pattern and when it occurs"
  
  **Recommendations**
  - Use numbered list (1., 2., 3., etc.)
  - Each recommendation starts with a bold action title
  - Follow with 1-2 sentences explaining why and how
  - Keep practical and specific to patterns observed

Formatting rules:
- Use markdown bold (**text**) for section headings and pattern/recommendation titles
- Keep "Dominant emotion:" and "Main trigger:" on single lines
- Write Overview as a flowing paragraph, not bullet points
- Use numbered lists for patterns and recommendations
- Maintain supportive, insightful tone throughout

Entries:
${formattedEntries}

Maintain supportive and analytical tone. Strictly follow this structure and formatting. Do not provide any medical or clinical advice.
`;
}

export function buildChatPrompt(message: string) {
  return `
Task: Chat with the user empathetically about emotions, mental wellness, or general questions related to their emotional journey.

Instructions:
- Respond naturally and conversationally
- Show empathy and validation for their feelings
- Ask clarifying questions when helpful
- Provide practical insights when appropriate
- Keep responses clear and well-structured using paragraphs
- Use bullet points only when listing specific suggestions or options
- Never provide medical or clinical advice
- If the user shares distress, acknowledge it compassionately

User message:
${message}
`;
}

export function buildLimitedWeeklyPrompt(entries: string[]) {
  const entryTexts = entries
    .map((e, i) => `Day ${i + 1}: ${e || "No text entry"}`)
    .join("\n");

  return `
Task: Generate a LIMITED weekly emotional statistics report.

Note: The user has only ${entries.length} ${
    entries.length === 1 ? "entry" : "entries"
  } this week, which is not enough for a comprehensive analysis. 
Provide a brief emotional statistics summary based on available data.

Instructions:
- Start with: "**Note:** You have only ${entries.length} ${
    entries.length === 1 ? "entry" : "entries"
  } this week. For a comprehensive weekly analysis, I recommend having at least ${MIN_WEEKLY_ENTRIES} entries."
- Then provide a brief section:
  **Emotional Statistics (Limited Data)**
  - List any patterns or emotions detected from available entries
  - Keep it short (2-3 bullet points)
- End with: "**Recommendation:** Continue journaling daily to unlock full weekly insights and pattern analysis."

Entries:
${entryTexts}

Strictly follow this structure.
`;
}
