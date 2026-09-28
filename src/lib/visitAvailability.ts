import { expandDateRange, extractDatesFromText, parseISODate } from "@/lib/dates";
import type { ScheduledRetreat } from "@/lib/contentModel";
import { listRetreats } from "@/lib/siteContent";
import { listSubmissions, type SubmissionRecord } from "@/lib/submissions";

export function datesOccupiedByRecord(record: SubmissionRecord, retreats: ScheduledRetreat[]): string[] {
  if (record.type !== "alquiler" && record.type !== "retiros") return [];

  const payload = record.payload;
  const dates = new Set<string>();
  const textKeys = ["fechas", "fecha", "fecha_inicio", "fecha_fin", "fecha_preferida"] as const;

  for (const key of textKeys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      for (const date of extractDatesFromText(value)) dates.add(date);
    }
  }

  const start = typeof payload.fecha_inicio === "string" ? parseISODate(payload.fecha_inicio) : null;
  const end = typeof payload.fecha_fin === "string" ? parseISODate(payload.fecha_fin) : null;
  if (start && end) {
    for (const date of expandDateRange(start, end)) dates.add(date);
  }

  const retiroId = String(payload.retiro_interes ?? "");
  const retreat = retreats.find((item) => item.id === retiroId);
  if (retreat) {
    for (const date of expandDateRange(retreat.startDate, retreat.endDate)) dates.add(date);
  }

  return [...dates].sort();
}

export async function isDateBlockedForVisits(isoDate: string): Promise<boolean> {
  const [list, retreats] = await Promise.all([listSubmissions(), listRetreats()]);
  return list.some((record) => datesOccupiedByRecord(record, retreats).includes(isoDate));
}
