import type { Prisma } from "@prisma/client";
import { addDaysISO, isoDateInTimeZone, MEXICO_TZ, todayISO } from "@/lib/dates";
import { prisma } from "@/lib/db";
import { visitColumnsFromPayload } from "@/lib/visitColumns";

export type SubmissionType = "alquiler" | "retiros" | "visitas";
export type VisitStatus = "confirmado" | "pendiente";

export type SubmissionRecord = {
  id: string;
  type: SubmissionType;
  createdAt: string;
  payload: Record<string, unknown>;
  qrDataUrl?: string;
  verifyUrl?: string;
  status?: VisitStatus;
};

type SaveSubmissionExtra = {
  id?: string;
  qrDataUrl?: string;
  verifyUrl?: string;
  status?: VisitStatus;
};

function payloadRecord(value: Prisma.JsonValue): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function toRecord(row: {
  id: string;
  type: SubmissionType;
  createdAt: Date;
  status: VisitStatus | null;
  payload: Prisma.JsonValue;
  qrDataUrl: string | null;
  verifyUrl: string | null;
}): SubmissionRecord {
  return {
    id: row.id,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
    payload: payloadRecord(row.payload),
    ...(row.qrDataUrl ? { qrDataUrl: row.qrDataUrl } : {}),
    ...(row.verifyUrl ? { verifyUrl: row.verifyUrl } : {}),
    ...(row.status ? { status: row.status } : {}),
  };
}

export async function saveSubmission(
  type: SubmissionType,
  payload: Record<string, unknown>,
  extra?: SaveSubmissionExtra
): Promise<SubmissionRecord> {
  const { id: extraId, qrDataUrl, verifyUrl, status } = extra ?? {};
  const { visitDate, visitTime } = visitColumnsFromPayload(type, payload);
  const row = await prisma.submission.create({
    data: {
      id: extraId ?? crypto.randomUUID(),
      type,
      payload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
      qrDataUrl: qrDataUrl ?? null,
      verifyUrl: verifyUrl ?? null,
      status: status ?? null,
      visitDate,
      visitTime,
    },
  });
  return toRecord(row);
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  const rows = await prisma.submission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toRecord);
}

export async function getSubmissionById(id: string): Promise<SubmissionRecord | null> {
  const row = await prisma.submission.findUnique({ where: { id } });
  return row ? toRecord(row) : null;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const existing = await prisma.submission.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return false;
  await prisma.submission.delete({ where: { id } });
  return true;
}

export async function getDailyVisitStats(limitDays = 30): Promise<Array<{ date: string; visits: number }>> {
  const rows = await prisma.submission.findMany({
    where: { type: "visitas" },
    select: { createdAt: true },
  });
  const counters = new Map<string, number>();
  for (const row of rows) {
    const date = isoDateInTimeZone(row.createdAt, MEXICO_TZ);
    counters.set(date, (counters.get(date) ?? 0) + 1);
  }

  const today = todayISO(MEXICO_TZ);
  const output: Array<{ date: string; visits: number }> = [];
  for (let i = limitDays - 1; i >= 0; i -= 1) {
    const date = addDaysISO(today, -i);
    output.push({ date, visits: counters.get(date) ?? 0 });
  }
  return output;
}

export async function listVisitsForDate(isoDate: string): Promise<SubmissionRecord[]> {
  const rows = await prisma.submission.findMany({
    where: { type: "visitas", visitDate: isoDate },
    orderBy: [{ visitTime: { sort: "asc", nulls: "first" } }, { createdAt: "asc" }],
  });
  return rows.map(toRecord);
}
