export const formatStreak = (streakLength: number) => {
  return `${streakLength} ${streakLength === 1 ? "day" : "days"}`;
};
