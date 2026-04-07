import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getDailyVisitStats, listSubmissions } from "@/lib/submissions";

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

  const rows = await listSubmissions();
  const stats = await getDailyVisitStats(14);
  const url = new URL(request.url);
  const format = url.searchParams.get("format");

  if (format === "csv") {
    return new NextResponse(toCsv(rows), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="registros-ermita.csv"',
      },
    });
  }

  return NextResponse.json({ ok: true, rows, stats });
}
