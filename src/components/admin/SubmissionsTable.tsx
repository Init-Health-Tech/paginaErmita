"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Copy, Trash2 } from "lucide-react";
import type { AdminTableRow } from "@/lib/adminRows";
import { formatAdminDate, isoDateInTimeZone, MEXICO_TZ } from "@/lib/dates";
import styles from "./admin.module.css";
import { adminInlineLinkClass, adminInputClass, adminSecondaryButtonClass, adminSectionTitleClass } from "./styles";

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

const STATUS_FILTERS = [
  { value: "", label: "Todos" },
  { value: "confirmado", label: "Confirmado" },
  { value: "pendiente", label: "Pendiente" },
  { value: "bloqueo", label: "Bloqueo" },
  { value: "sin-estado", label: "Sin estado" },
];

const filterLabelClass = "block font-sans text-[13px] leading-5 text-[var(--color-text)]";

function recordDay(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt.slice(0, 10);
  return isoDateInTimeZone(date, MEXICO_TZ);
}

function matchesFilters(row: AdminTableRow, query: string, from: string, to: string, status: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle && !`${row.nombre} ${row.email}`.toLowerCase().includes(needle)) return false;
  const day = recordDay(row.createdAt);
  if (from && day < from) return false;
  if (to && day > to) return false;
  if (status === "sin-estado") return !row.status.trim();
  if (status && row.status.trim().toLowerCase() !== status) return false;
  return true;
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

function DeleteCell({ row, pending, onRemove }: { row: AdminTableRow; pending: boolean; onRemove: () => void }) {
  return (
    <td>
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center bg-transparent text-[#8f5348] disabled:opacity-40"
        aria-label={`Eliminar registro de ${row.nombre}`}
        disabled={pending}
        onClick={onRemove}
      >
        <Trash2 strokeWidth={1.5} className="h-4 w-4" />
      </button>
    </td>
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
  manage = false,
}: {
  title: string;
  rows: AdminTableRow[];
  mode: SubmissionTableMode;
  retreats?: { id: string; name: string }[];
  csvHref: string;
  emptyLabel?: string;
  beforeTable?: React.ReactNode;
  className?: string;
  manage?: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState(rows);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const rowIds = rows.map((row) => row.id).join("|");

  useEffect(() => {
    setItems(rows);
  }, [rowIds, rows]);

  const filtered = useMemo(
    () => items.filter((row) => matchesFilters(row, query, from, to, status)),
    [items, query, from, to, status]
  );
  const filtering = Boolean(query.trim() || from || to || status);
  const headers = [...headersFor(mode), ...(manage ? ["acciones"] : [])];
  const showVisit = mode === "visitas" || mode === "all";

  async function remove(row: AdminTableRow) {
    const who = row.nombre.trim() && row.nombre !== "—" ? row.nombre : "este registro";
    if (!window.confirm(`¿Eliminar el registro de ${who}? Esta acción no se puede deshacer.`)) return;
    setActionError("");
    setPendingId(row.id);
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(data?.error ?? "No se pudo eliminar.");
      setItems((current) => current.filter((item) => item.id !== row.id));
      router.refresh();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : "No se pudo eliminar.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className={`min-w-0 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className={adminSectionTitleClass}>{title}</h2>
          <p className="text-sm text-[var(--color-muted)]">
            {filtering ? `${filtered.length} de ${countPhrase(mode, items.length)}` : countPhrase(mode, items.length)}
          </p>
        </div>
        <a href={csvHref} className={adminSecondaryButtonClass}>
          Descargar CSV
        </a>
      </div>
      {beforeTable ? <div className="mt-8">{beforeTable}</div> : null}
      {manage && (items.length > 0 || filtering) ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <label htmlFor={`${mode}-buscar`} className={filterLabelClass}>
              Nombre o correo
            </label>
            <input
              id={`${mode}-buscar`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={adminInputClass}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor={`${mode}-desde`} className={filterLabelClass}>
              Desde
            </label>
            <input id={`${mode}-desde`} type="date" value={from} onChange={(event) => setFrom(event.target.value)} className={adminInputClass} />
          </div>
          <div className="min-w-0">
            <label htmlFor={`${mode}-hasta`} className={filterLabelClass}>
              Hasta
            </label>
            <input id={`${mode}-hasta`} type="date" value={to} onChange={(event) => setTo(event.target.value)} className={adminInputClass} />
          </div>
          <div className="min-w-0">
            <label htmlFor={`${mode}-estado`} className={filterLabelClass}>
              Estado
            </label>
            <select id={`${mode}-estado`} value={status} onChange={(event) => setStatus(event.target.value)} className={adminInputClass}>
              {STATUS_FILTERS.map((option) => (
                <option key={option.value || "todos"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {filtering ? (
            <button
              type="button"
              className="justify-self-start bg-transparent text-sm text-[var(--color-muted)] underline-offset-4 hover:underline"
              onClick={() => {
                setQuery("");
                setFrom("");
                setTo("");
                setStatus("");
              }}
            >
              Limpiar filtro
            </button>
          ) : null}
        </div>
      ) : null}
      {actionError ? (
        <p className="mt-4 text-sm text-[#8f5348]" role="alert">
          {actionError}
        </p>
      ) : null}
      {items.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-[var(--color-muted)]">{emptyLabel ?? EMPTY_LABEL[mode]}</p>
      ) : filtered.length === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-[var(--color-muted)]">Ningún registro coincide con el filtro.</p>
      ) : (
        <div className={`${styles.scroll} mt-8`}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header || "acciones"} scope="col">
                    {header === "acciones" ? <span className="sr-only">Eliminar</span> : header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
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
                      {manage ? <DeleteCell row={row} pending={pendingId === row.id} onRemove={() => remove(row)} /> : null}
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
                      {manage ? <DeleteCell row={row} pending={pendingId === row.id} onRemove={() => remove(row)} /> : null}
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
                      {manage ? <DeleteCell row={row} pending={pendingId === row.id} onRemove={() => remove(row)} /> : null}
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
                      {manage ? <DeleteCell row={row} pending={pendingId === row.id} onRemove={() => remove(row)} /> : null}
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
