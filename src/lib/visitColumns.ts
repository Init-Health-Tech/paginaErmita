import { parseISODate } from "@/lib/dates";

export function visitColumnsFromPayload(
  type: string,
  payload: Record<string, unknown>
): { visitDate: string | null; visitTime: string | null } {
  if (type !== "visitas") return { visitDate: null, visitTime: null };
  const rawDate = typeof payload.fecha_preferida === "string" ? payload.fecha_preferida.trim() : "";
  const rawTime = typeof payload.hora_aproximada === "string" ? payload.hora_aproximada.trim() : "";
  return {
    visitDate: parseISODate(rawDate),
    visitTime: rawTime.length > 0 ? rawTime : null,
  };
}
