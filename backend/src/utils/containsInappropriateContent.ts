export function containsInappropriateContent(text: string): boolean {
  if (!text) return false;

  const clean = text.toLowerCase();

  const directPatterns = [
    /suicid(e|al)/,
    /\bkill myself\b/,
    /\bend my life\b/,
    /\btake my life\b/,
    /\bi want to die\b/,
    /\bi wish i was dead\b/,
    /\bbetter off dead\b/,
    /\bcan't go on\b/,
  ];

  const selfHarmPatterns = [
    /\bself[-\s]?harm\b/,
    /\bcut myself\b/,
    /\bcutting\b/,
    /\bhurt myself\b/,
    /\bi (?:want|need) to hurt myself\b/,
    /\bi feel like hurting myself\b/,
  ];

  const ideationPatterns = [
    /\bno reason to live\b/,
    /\bi don't want to live\b/,
    /\bcan't live anymore\b/,
    /\bi'm done with life\b/,
  ];

  const allPatterns = [
    ...directPatterns,
    ...selfHarmPatterns,
    ...ideationPatterns,
  ];

  return allPatterns.some((p) => p.test(clean));
}
