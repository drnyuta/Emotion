export function normalizeDate(d: any) {
  if (!d) return null;
  if (typeof d === "string") return d;
  if (d instanceof Date) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return null;
}
