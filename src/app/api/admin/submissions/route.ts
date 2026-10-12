import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteSubmission, getDailyVisitStats, listSubmissions, type SubmissionType } from "@/lib/submissions";

const TYPES: SubmissionType[] = ["alquiler", "retiros", "visitas"];

function toCsv(rows: Awaited<ReturnType<typeof listSubmissions>>) {
  const header = ["id", "type", "createdAt", "payload"];
  const lines = rows.map((row) =>
    [row.id, row.type, row.createdAt, JSON.stringify(row.payload)]
      .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const url = new URL(request.url);
  const typeParam = url.searchParams.get("type");
  if (typeParam && !TYPES.includes(typeParam as SubmissionType)) {
    return NextResponse.json({ ok: false, error: "Tipo no reconocido" }, { status: 400 });
  }

  const allRows = await listSubmissions();
  const rows = typeParam ? allRows.filter((row) => row.type === typeParam) : allRows;
  const stats = await getDailyVisitStats(14);
  const format = url.searchParams.get("format");

  if (format === "csv") {
    const filename = typeParam ? `registros-${typeParam}.csv` : "registros-ermita.csv";
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({ ok: true, rows, stats });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta el identificador" }, { status: 400 });
  }

  const removed = await deleteSubmission(id);
  if (!removed) {
    return NextResponse.json({ ok: false, error: "No se encontró el registro" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
