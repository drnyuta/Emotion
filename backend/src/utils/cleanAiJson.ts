export function cleanAIJson(raw: string) {
  const unescaped = raw
    .replace(/\\"/g, '"')
    .replace(/\\n/g, '')
    .trim();

  try {
    return JSON.parse(unescaped);
  } catch (e) {
    console.error('Failed to parse AI JSON', e, unescaped);
    throw new Error('Invalid JSON from AI');
  }
}
