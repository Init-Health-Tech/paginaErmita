export const MEXICO_TZ = "America/Mexico_City";

const MONTHS: Record<string, number> = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  setiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

export function todayISO(timeZone = MEXICO_TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDaysISO(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function isAtLeastOneDayAhead(isoDate: string): boolean {
  return isoDate > todayISO();
}

export function parseISODate(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const [year, month, day] = trimmed.split("-").map(Number);
  return toISODate(year, month, day);
}

function toISODate(year: number, month: number, day: number): string | null {
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return null;
  }
  return dt.toISOString().slice(0, 10);
}

function yearForMonthDay(month: number, day: number): number {
  const today = todayISO();
  const currentYear = Number(today.slice(0, 4));
  const candidate = toISODate(currentYear, month, day);
  if (candidate && candidate >= today) return currentYear;
  return currentYear + 1;
}

export function expandDateRange(start: string, end: string): string[] {
  if (end < start) return [start];
  const dates: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    dates.push(cursor);
    cursor = addDaysISO(cursor, 1);
  }
  return dates;
}

export function extractDatesFromText(text: string): string[] {
  const dates = new Set<string>();
  const ranges: Array<[string, string]> = [];
  const monthNames = Object.keys(MONTHS).join("|");

  for (const match of text.matchAll(/\b(20\d{2}-\d{2}-\d{2})\s*(?:al|a|hasta|-|–|—)\s*(20\d{2}-\d{2}-\d{2})\b/gi)) {
    ranges.push([match[1], match[2]]);
  }

  for (const match of text.matchAll(/\b(20\d{2}-\d{2}-\d{2})\b/g)) {
    const parsed = parseISODate(match[1]);
    if (parsed) dates.add(parsed);
  }

  for (const match of text.matchAll(/\b(\d{1,2})[/-](\d{1,2})[/-](20\d{2})\b/g)) {
    const parsed = toISODate(Number(match[3]), Number(match[2]), Number(match[1]));
    if (parsed) dates.add(parsed);
  }

  const rangeByMonth = new RegExp(
    `\\b(\\d{1,2})\\s*(?:al|a|y|-|–)\\s*(\\d{1,2})\\s+de\\s+(${monthNames})(?:\\s+de\\s+(20\\d{2}))?`,
    "gi"
  );
  for (const match of text.matchAll(rangeByMonth)) {
    const month = MONTHS[match[3].toLowerCase()];
    const year = match[4] ? Number(match[4]) : yearForMonthDay(month, Number(match[1]));
    const start = toISODate(year, month, Number(match[1]));
    const end = toISODate(year, month, Number(match[2]));
    if (start && end) ranges.push([start, end]);
  }

  const singleByMonth = new RegExp(`\\b(\\d{1,2})\\s+de\\s+(${monthNames})(?:\\s+de\\s+(20\\d{2}))?`, "gi");
  for (const match of text.matchAll(singleByMonth)) {
    const month = MONTHS[match[2].toLowerCase()];
    const year = match[3] ? Number(match[3]) : yearForMonthDay(month, Number(match[1]));
    const parsed = toISODate(year, month, Number(match[1]));
    if (parsed) dates.add(parsed);
  }

  for (const [start, end] of ranges) {
    for (const date of expandDateRange(start, end)) dates.add(date);
  }

  return [...dates].sort();
}
