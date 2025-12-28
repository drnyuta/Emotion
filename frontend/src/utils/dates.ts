export const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  return new Date(d.setDate(diff));
};

export const getWeekNumber = (date: Date): number => {
  const monday = getMonday(date);
  const firstMonday = getMonday(new Date(monday.getFullYear(), 0, 4));
  const diff = monday.getTime() - firstMonday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
};

export const getWeekDateRange = (date: Date): string => {
  const dayOfWeek = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const formatDate = (d: Date) =>
    `${d.getDate()} ${d.toLocaleDateString("en-US", { month: "short" })}`;
  return `${formatDate(monday)} - ${formatDate(sunday)}`;
};
