import Image from "next/image";
import type { AdminTableRow } from "@/lib/adminRows";

export type SubmissionTableMode = "all" | "alquiler" | "retiros" | "visitas";

function formatVisitDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || "—";
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function retreatName(id: string, retreats: { id: string; name: string }[]): string {
  if (!id) return "—";
  if (id === "otro") return "Otro / futuras fechas";
  return retreats.find((item) => item.id === id)?.name ?? id;
}

function headersFor(mode: SubmissionTableMode): string[] {
  if (mode === "visitas") return ["Fecha de visita", "Nombre", "Email", "Estado", "QR"];
  if (mode === "retiros") return ["Fecha", "Retiro", "Nombre", "Email", "Estado", "ID"];
  if (mode === "alquiler") return ["Fecha", "Nombre", "Email", "Estado", "ID"];
  return ["Fecha", "Tipo", "Nombre", "Email", "Estado", "ID"];
}

export function SubmissionsTable({
  rows,
  mode,
  retreats = [],
  className = "mt-8",
}: {
  rows: AdminTableRow[];
  mode: SubmissionTableMode;
  retreats?: { id: string; name: string }[];
  className?: string;
}) {
  const headers = headersFor(mode);

  return (
    <section className={`surface rounded-sm p-0 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--color-ermita-line)] bg-[var(--color-ermita-brown-soft)]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-6 text-[var(--color-ermita-muted)]">
                  No hay registros.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-[var(--color-ermita-line)]/70">
                  {mode === "visitas" ? (
                    <>
                      <td className="px-4 py-3 text-[var(--color-ermita-muted)]">
                        {row.visitDate ? formatVisitDate(row.visitDate) : "—"}
                        <span className="mt-1 block text-xs">Registro: {new Date(row.createdAt).toLocaleString("es-MX")}</span>
                      </td>
                      <td className="px-4 py-3">{row.nombre}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3 capitalize">{row.status || "—"}</td>
                      <td className="px-4 py-3">
                        {row.qrDataUrl ? (
                          <span className="flex flex-col items-start gap-1">
                            <Image
                              src={row.qrDataUrl}
                              alt={`QR de ${row.nombre}`}
                              width={72}
                              height={72}
                              unoptimized
                              className="h-16 w-16 rounded-sm border border-[var(--color-ermita-line)] bg-white p-0.5"
                            />
                            <a href={row.verifyUrl || `/verificar/${row.id}`} className="text-xs underline underline-offset-4">
                              Comprobante
                            </a>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </>
                  ) : mode === "retiros" ? (
                    <>
                      <td className="px-4 py-3 text-[var(--color-ermita-muted)]">
                        {new Date(row.createdAt).toLocaleString("es-MX")}
                      </td>
                      <td className="px-4 py-3">{retreatName(row.retreatId, retreats)}</td>
                      <td className="px-4 py-3">{row.nombre}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3 capitalize">{row.status || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                    </>
                  ) : mode === "alquiler" ? (
                    <>
                      <td className="px-4 py-3 text-[var(--color-ermita-muted)]">
                        {new Date(row.createdAt).toLocaleString("es-MX")}
                      </td>
                      <td className="px-4 py-3">{row.nombre}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3 capitalize">{row.status || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-[var(--color-ermita-muted)]">
                        {new Date(row.createdAt).toLocaleString("es-MX")}
                        {row.visitDate ? <span className="mt-1 block text-xs">Visita: {row.visitDate}</span> : null}
                      </td>
                      <td className="px-4 py-3 capitalize">{row.type}</td>
                      <td className="px-4 py-3">{row.nombre}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3 capitalize">{row.status || "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
