import { promises as fs } from "fs";
import path from "path";

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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

type SaveSubmissionExtra = {
  id?: string;
  qrDataUrl?: string;
  verifyUrl?: string;
  status?: VisitStatus;
};

export async function saveSubmission(
  type: SubmissionType,
  payload: Record<string, unknown>,
  extra?: SaveSubmissionExtra
): Promise<SubmissionRecord> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list: SubmissionRecord[] = JSON.parse(raw);
  const { id: extraId, ...rest } = extra ?? {};
  const record: SubmissionRecord = {
    id: extraId ?? crypto.randomUUID(),
    type,
    createdAt: new Date().toISOString(),
    payload,
    ...rest,
  };
  list.push(record);
  await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  return record;
}

export async function listSubmissions(): Promise<SubmissionRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const list: SubmissionRecord[] = JSON.parse(raw);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSubmissionById(id: string): Promise<SubmissionRecord | null> {
  const list = await listSubmissions();
  return list.find((item) => item.id === id) ?? null;
}

export async function getDailyVisitStats(limitDays = 30): Promise<Array<{ date: string; visits: number }>> {
  const list = await listSubmissions();
  const counters = new Map<string, number>();
  const onlyVisits = list.filter((item) => item.type === "visitas");

  for (const item of onlyVisits) {
    const date = item.createdAt.slice(0, 10);
    counters.set(date, (counters.get(date) ?? 0) + 1);
  }

  const today = new Date();
  const output: Array<{ date: string; visits: number }> = [];
  for (let i = 0; i < limitDays; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const date = day.toISOString().slice(0, 10);
    output.push({ date, visits: counters.get(date) ?? 0 });
  }

  return output.reverse();
}

export async function listVisitsForDate(isoDate: string): Promise<SubmissionRecord[]> {
  const list = await listSubmissions();
  return list
    .filter((item) => item.type === "visitas" && String(item.payload.fecha_preferida ?? "") === isoDate)
    .sort((a, b) => String(a.payload.hora_aproximada ?? "").localeCompare(String(b.payload.hora_aproximada ?? "")));
}
