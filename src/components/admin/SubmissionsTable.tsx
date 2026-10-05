"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import type { AdminTableRow } from "@/lib/adminRows";
import { formatAdminDate } from "@/lib/dates";
import styles from "./admin.module.css";
import { adminInlineLinkClass, adminSecondaryButtonClass, adminSectionTitleClass } from "./styles";

export type SubmissionTableMode = "all" | "alquiler" | "retiros" | "visitas";

const EMPTY_LABEL: Record<SubmissionTableMode, string> = {
  all: "Aún no hay registros.",
  alquiler: "Aún no hay solicitudes de alquiler.",
  retiros: "Aún no hay inscripciones de retiros.",
  visitas: "Aún no hay visitas registradas.",
};

function retreatName(id: string, retreats: { id: string; name: string }[]): string {
  if (!id) return "—";
  if (id === "otro") return "Otro / futuras fechas";
  return retreats.find((item) => item.id === id)?.name ?? id;
}

function headersFor(mode: SubmissionTableMode): string[] {
  if (mode === "visitas") return ["Fecha", "Nombre", "Email", "Estado", "QR", "ID"];
  if (mode === "retiros") return ["Fecha", "Retiro", "Nombre", "Email", "Estado", "ID"];
  if (mode === "alquiler") return ["Fecha", "Nombre", "Email", "Estado", "ID"];
  return ["Fecha", "Tipo", "Nombre", "Email", "Estado", "ID"];
}

function countPhrase(mode: SubmissionTableMode, count: number): string {
  if (mode === "visitas") return `${count} ${count === 1 ? "visita" : "visitas"}`;
  if (mode === "alquiler") return `${count} ${count === 1 ? "solicitud" : "solicitudes"}`;
  return `${count} ${count === 1 ? "registro" : "registros"}`;
}

function when(value: string): string {
  if (!value) return "—";
  return formatAdminDate(value) || "—";
}

function StatusMark({ status }: { status: string }) {
  const key = status.trim().toLowerCase();
  if (!key) return <span className="text-[var(--color-muted)]">—</span>;

  const known: Record<string, { label: string; color: string }> = {
    confirmado: { label: "Confirmado", color: "var(--color-accent)" },
    bloqueo: { label: "Bloqueo", color: "#9a7a45" },
    pendiente: { label: "Pendiente", color: "var(--color-muted)" },
  };
  const item = known[key] ?? { label: status, color: "var(--color-muted)" };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} aria-hidden />
      {item.label}
    </span>
  );
}

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-xs" title={id}>
        {id.slice(0, 8)}
      </span>
      <button
        type="button"
        className={`${styles.copyBtn} inline-flex h-7 w-7 items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-accent)]`}
        aria-label={copied ? "Identificador copiado" : "Copiar identificador"}
        onClick={() => {
          void navigator.clipboard.writeText(id).then(() => setCopied(true)).catch(() => setCopied(false));
        }}
      >
        {copied ? <Check strokeWidth={1.5} className="h-3.5 w-3.5" /> : <Copy strokeWidth={1.5} className="h-3.5 w-3.5" />}
      </button>
    </span>
  );
}

function DateCell({ row, showVisit }: { row: AdminTableRow; showVisit: boolean }) {
  return (
    <td>
      {when(row.createdAt)}
      {showVisit && row.visitDate ? (
        <span className="mt-1 block text-xs text-[var(--color-muted)]">Visita: {formatAdminDate(row.visitDate)}</span>
      ) : null}
    </td>
  );
}

export function SubmissionsTable({
  title,
  rows,
  mode,
  retreats = [],
  csvHref,
  emptyLabel,
  beforeTable,
  className = "",
}: {
  title: string;
  rows: AdminTableRow[];
  mode: SubmissionTableMode;
  retreats?: { id: string; name: string }[];
  csvHref: string;
  emptyLabel?: string;
  beforeTable?: React.ReactNode;
  className?: string;
}) {
  const headers = headersFor(mode);
  const showVisit = mode === "visitas" || mode === "all";

  return (
    <section className={`min-w-0 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className={adminSectionTitleClass}>{title}</h2>
          <p className="text-sm text-[var(--color-muted)]">{countPhrase(mode, rows.length)}</p>
        </div>
        <a href={csvHref} className={adminSecondaryButtonClass}>
          Descargar CSV
        </a>
      </div>
      {beforeTable ? <div className="mt-8">{beforeTable}</div> : null}
      {rows.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-[var(--color-muted)]">{emptyLabel ?? EMPTY_LABEL[mode]}</p>
      ) : (
        <div className={`${styles.scroll} mt-8`}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} scope="col">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {mode === "visitas" ? (
                    <>
                      <DateCell row={row} showVisit />
                      <td>{row.nombre}</td>
                      <td>{row.email}</td>
                      <td>
                        <StatusMark status={row.status} />
                      </td>
                      <td>
                        {row.qrDataUrl ? (
                          <span className="flex flex-col items-start gap-1">
                            <Image
                              src={row.qrDataUrl}
                              alt={`QR de ${row.nombre}`}
                              width={72}
                              height={72}
                              unoptimized
                              className="h-16 w-16 border border-[var(--color-line)] bg-[var(--color-bg)] p-0.5"
                            />
                            <a href={row.verifyUrl || `/verificar/${row.id}`} className={`text-xs ${adminInlineLinkClass}`}>
                              Comprobante
                            </a>
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        <CopyId id={row.id} />
                      </td>
                    </>
                  ) : mode === "retiros" ? (
                    <>
                      <DateCell row={row} showVisit={false} />
                      <td>{retreatName(row.retreatId, retreats)}</td>
                      <td>{row.nombre}</td>
                      <td>{row.email}</td>
                      <td>
                        <StatusMark status={row.status} />
                      </td>
                      <td>
                        <CopyId id={row.id} />
                      </td>
                    </>
                  ) : mode === "alquiler" ? (
                    <>
                      <DateCell row={row} showVisit={false} />
                      <td>{row.nombre}</td>
                      <td>{row.email}</td>
                      <td>
                        <StatusMark status={row.status} />
                      </td>
                      <td>
                        <CopyId id={row.id} />
                      </td>
                    </>
                  ) : (
                    <>
                      <DateCell row={row} showVisit={showVisit} />
                      <td className="capitalize">{row.type}</td>
                      <td>{row.nombre}</td>
                      <td>{row.email}</td>
                      <td>
                        <StatusMark status={row.status} />
                      </td>
                      <td>
                        <CopyId id={row.id} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
