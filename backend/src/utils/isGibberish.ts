export function isGibberish(text: string): boolean {
  if (!text) return true;

  const clean = text.trim().toLowerCase();
  const words = clean.split(/\s+/);

  if (words.length === 0) return true;

  let gibberishCount = 0;

  for (const w of words) {
    // 1. Word has too many non-letters (>40% of its length)
    const nonLetterRatio = (w.match(/[^a-z]/gi)?.length || 0) / w.length;
    if (nonLetterRatio > 0.4) {
      gibberishCount++;
      continue;
    }

    // 2. Contains long sequences of symbols/numbers (3+)
    if (/[0-9!@#$%^&*()_\-+=<>?{}[\]|~]{3,}/.test(w)) {
      gibberishCount++;
      continue;
    }

    // 3. Repeating character 6+ times
    if (/(.)\1{5,}/.test(w)) {
      gibberishCount++;
      continue;
    }

    // 4. Word without vowels (>3 letters)
    if (w.length > 3 && !/[aeiouy]/.test(w)) {
      gibberishCount++;
      continue;
    }

    // 5. Not readable word (only letters a-z, length > 2)
    if (!/^[a-z]+$/.test(w) && w.length > 2) {
      gibberishCount++;
      continue;
    }
  }

  // Gibberish if >50% words are nonsense
  return gibberishCount / words.length > 0.4;
}
