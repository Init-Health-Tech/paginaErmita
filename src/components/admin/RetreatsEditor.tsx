"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2, X } from "lucide-react";
import { newClientId, type ScheduledRetreat } from "@/lib/contentModel";
import { formatAdminDate, todayISO } from "@/lib/dates";
import { EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import { adminInputClass, adminMutedClass, adminPrimaryButtonClass } from "./styles";
import { UnsavedChangesBar, useConfirmOnLeave, useUnsavedDirty } from "./UnsavedChangesBar";

const labelClass = "block font-sans text-[13px] leading-5 text-[var(--color-text)]";

function blankRetreat(): ScheduledRetreat {
  return { id: newClientId(), name: "", startDate: "", endDate: "", description: "", capacity: null };
}

function validateOne(retreat: ScheduledRetreat): string {
  if (!retreat.name.trim()) return "Cada retiro necesita un nombre.";
  if (!retreat.startDate || !retreat.endDate) return `«${retreat.name || "Retiro"}» necesita fecha de inicio y de fin.`;
  if (retreat.endDate < retreat.startDate) return `«${retreat.name}»: la fecha de fin no puede ser anterior a la de inicio.`;
  if (retreat.capacity != null && (!Number.isInteger(retreat.capacity) || retreat.capacity < 1)) {
    return `«${retreat.name}»: el cupo debe ser un entero mayor a cero, o quedar vacío.`;
  }
  return "";
}

function validateAll(retreats: ScheduledRetreat[]): string {
  for (const retreat of retreats) {
    const problem = validateOne(retreat);
    if (problem) return problem;
  }
  return "";
}

function dateLabel(retreat: ScheduledRetreat): string {
  if (!retreat.startDate || !retreat.endDate) return "Sin fechas";
  if (retreat.startDate === retreat.endDate) return formatAdminDate(retreat.startDate);
  return `${formatAdminDate(retreat.startDate)} – ${formatAdminDate(retreat.endDate)}`;
}

function isPast(retreat: ScheduledRetreat, today: string): boolean {
  return Boolean(retreat.endDate) && retreat.endDate < today;
}

function mergeRetreat(retreats: ScheduledRetreat[], draft: ScheduledRetreat): ScheduledRetreat[] {
  const exists = retreats.some((item) => item.id === draft.id);
  if (!exists) return [...retreats, draft];
  return retreats.map((item) => (item.id === draft.id ? draft : item));
}

export function RetreatsEditor({ initialRetreats }: { initialRetreats: ScheduledRetreat[] }) {
  const router = useRouter();
  const { setDirty } = useUnsavedDirty();
  const [retreats, setRetreats] = useState<ScheduledRetreat[]>(() => structuredClone(initialRetreats));
  const baselineRef = useRef<string | null>(null);
  if (baselineRef.current === null) baselineRef.current = JSON.stringify(retreats);
  const [draft, setDraft] = useState<ScheduledRetreat | null>(null);
  const [draftOrigin, setDraftOrigin] = useState<ScheduledRetreat | null>(null);
  const [pastOpen, setPastOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [drawerError, setDrawerError] = useState("");
  const listDirty = JSON.stringify(retreats) !== baselineRef.current;
  const draftDirty = draft != null && draftOrigin != null && JSON.stringify(draft) !== JSON.stringify(draftOrigin);
  const dirty = listDirty || draftDirty;
  const today = todayISO();
  const closeRef = useRef<() => void>(() => {});

  useConfirmOnLeave(dirty);

  useLayoutEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  function openDraft(retreat: ScheduledRetreat) {
    const copy = structuredClone(retreat);
    setDraft(copy);
    setDraftOrigin(structuredClone(copy));
    setDrawerError("");
  }

  function requestClose() {
    if (draft && draftOrigin && JSON.stringify(draft) !== JSON.stringify(draftOrigin)) {
      if (!window.confirm("¿Descartar los cambios de este retiro?")) return;
    }
    setDraft(null);
    setDraftOrigin(null);
    setDrawerError("");
  }
  closeRef.current = requestClose;

  useEffect(() => {
    if (!draft) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [draft]);

  function applyDraft() {
    if (!draft) return;
    const problem = validateOne(draft);
    if (problem) {
      setDrawerError(problem);
      return;
    }
    setRetreats((current) => mergeRetreat(current, draft));
    setDraft(null);
    setDraftOrigin(null);
    setDrawerError("");
    setMessage("");
    setError("");
  }

  function remove(id: string) {
    if (!window.confirm("¿Eliminar este retiro? Las inscripciones ya recibidas se conservan.")) return;
    setRetreats((current) => current.filter((item) => item.id !== id));
    if (draft?.id === id) {
      setDraft(null);
      setDraftOrigin(null);
      setDrawerError("");
    }
    setMessage("");
  }

  function discard() {
    setRetreats(JSON.parse(baselineRef.current ?? "[]") as ScheduledRetreat[]);
    setDraft(null);
    setDraftOrigin(null);
    setDrawerError("");
    setMessage("");
    setError("");
  }

  async function save() {
    setError("");
    setMessage("");
    setDrawerError("");
    let next = retreats;
    if (draft) {
      const problem = validateOne(draft);
      if (problem) {
        setDrawerError(problem);
        setError(problem);
        return;
      }
      next = mergeRetreat(retreats, draft);
    }
    const problem = validateAll(next);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAdminContent({ section: "retreats", retreats: next });
      const stored = saved.retreats;
      baselineRef.current = JSON.stringify(stored);
      setRetreats(stored);
      setDraft(null);
      setDraftOrigin(null);
      setMessage("Retiros guardados. La página pública y el formulario ya usan esta lista.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  const upcoming = retreats.filter((item) => !isPast(item, today)).sort((a, b) => (a.startDate || "9999").localeCompare(b.startDate || "9999"));
  const past = retreats.filter((item) => isPast(item, today)).sort((a, b) => b.endDate.localeCompare(a.endDate));
  const draftIsStored = draft != null && retreats.some((item) => item.id === draft.id);

  return (
    <div className={dirty ? "pb-24" : undefined}>
      <p className={`max-w-3xl ${adminMutedClass}`}>
        Esta lista alimenta «Próximos retiros» y el selector del formulario público. Las fechas de cada retiro bloquean el registro de visitas en esos días.
      </p>

      <div className="mt-8">
        {upcoming.length > 0 ? <p className="font-sans text-[13px] text-[var(--color-muted)]">Próximos</p> : null}
        {retreats.length === 0 ? <p className={`mt-4 ${adminMutedClass}`}>No hay retiros programados.</p> : null}
        <div className={upcoming.length > 0 ? "mt-2" : "mt-4"}>
          {upcoming.map((retreat) => (
            <RetreatRow key={retreat.id} retreat={retreat} past={false} onEdit={() => openDraft(structuredClone(retreat))} onRemove={() => remove(retreat.id)} />
          ))}
          <button
            type="button"
            onClick={() => openDraft(blankRetreat())}
            className="flex min-h-14 w-full items-center border-t border-[var(--color-line)] text-left text-sm text-[var(--color-accent)]"
          >
            + Agregar retiro
          </button>
          {past.length > 0 ? (
            <>
              <button
                type="button"
                aria-expanded={pastOpen}
                onClick={() => setPastOpen((value) => !value)}
                className="flex min-h-14 w-full items-center gap-2 border-t border-[var(--color-line)] text-left text-sm text-[var(--color-muted)]"
              >
                <ChevronDown strokeWidth={1.5} className={`h-4 w-4 transition-transform ${pastOpen ? "rotate-180" : ""}`} />
                Pasados
                <span>{past.length}</span>
              </button>
              {pastOpen
                ? past.map((retreat) => (
                    <RetreatRow key={retreat.id} retreat={retreat} past onEdit={() => openDraft(structuredClone(retreat))} onRemove={() => remove(retreat.id)} />
                  ))
                : null}
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4">
        <EditorStatus message={message} error={error} />
      </div>
      <UnsavedChangesBar visible={dirty} saving={saving} onDiscard={discard} onSave={save} />

      {draft ? (
        <div className="fixed inset-0 z-[70]">
          <button type="button" aria-label="Cerrar panel" className="absolute inset-0 bg-[color-mix(in_srgb,var(--color-text)_12%,transparent)]" onClick={requestClose} />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="retiro-drawer-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-[var(--color-line)] bg-[var(--color-bg)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[var(--color-line)] px-6 py-5">
              <h2 id="retiro-drawer-title" className="font-serif text-3xl font-light leading-tight text-[var(--color-text)]">
                {draftIsStored ? "Editar retiro" : "Nuevo retiro"}
              </h2>
              <button type="button" aria-label="Cerrar" onClick={requestClose} className="inline-flex h-9 w-9 items-center justify-center text-[var(--color-muted)]">
                <X strokeWidth={1.5} className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div>
                <label htmlFor="retiro-nombre" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="retiro-nombre"
                  value={draft.name}
                  maxLength={120}
                  autoFocus
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor="retiro-inicio" className={labelClass}>
                    Fecha de inicio
                  </label>
                  <input
                    id="retiro-inicio"
                    type="date"
                    value={draft.startDate}
                    onChange={(event) => setDraft({ ...draft, startDate: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="retiro-fin" className={labelClass}>
                    Fecha de fin
                  </label>
                  <input
                    id="retiro-fin"
                    type="date"
                    value={draft.endDate}
                    onChange={(event) => setDraft({ ...draft, endDate: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="retiro-desc" className={labelClass}>
                  Descripción
                </label>
                <textarea
                  id="retiro-desc"
                  rows={4}
                  maxLength={800}
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  className={`${adminInputClass} min-h-[8rem]`}
                />
              </div>
              <div>
                <label htmlFor="retiro-cupo" className={labelClass}>
                  Cupo (opcional)
                </label>
                <input
                  id="retiro-cupo"
                  type="number"
                  min={1}
                  step={1}
                  value={draft.capacity ?? ""}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      capacity: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  className={adminInputClass}
                />
              </div>
              {drawerError ? (
                <p className="text-sm text-[#8f5348]" role="alert">
                  {drawerError}
                </p>
              ) : null}
              {draftIsStored ? (
                <div className="flex justify-end">
                  <button type="button" onClick={() => remove(draft.id)} className="bg-transparent text-sm text-[#8f5348] underline-offset-4 hover:underline">
                    Eliminar retiro
                  </button>
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-end gap-4 border-t border-[var(--color-line)] px-6 py-4">
              <button type="button" onClick={requestClose} className="bg-transparent text-sm text-[var(--color-text)] underline-offset-4 hover:underline">
                Cancelar
              </button>
              <button type="button" onClick={applyDraft} className={adminPrimaryButtonClass}>
                Listo
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function RetreatRow({
  retreat,
  past,
  onEdit,
  onRemove,
}: {
  retreat: ScheduledRetreat;
  past: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const tone = past ? "text-[var(--color-muted)]" : "text-[var(--color-text)]";
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-line)] py-4 sm:flex-row sm:items-center sm:gap-6">
      <p className={`font-serif text-2xl font-light leading-tight sm:w-56 sm:shrink-0 ${tone}`}>{dateLabel(retreat)}</p>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-sans text-sm ${tone}`}>{retreat.name.trim() || "Sin nombre"}</p>
        {retreat.capacity != null ? <p className="mt-1 font-sans text-xs text-[var(--color-muted)]">Cupo {retreat.capacity}</p> : null}
      </div>
      <div className="flex items-center gap-4 sm:shrink-0">
        <span className={`inline-flex items-center gap-2 font-sans text-sm ${tone}`}>
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: past ? "var(--color-muted)" : "var(--color-accent)" }}
            aria-hidden
          />
          {past ? "Pasado" : "Próximo"}
        </span>
        <button type="button" onClick={onEdit} className="bg-transparent font-sans text-sm text-[var(--color-text)] underline-offset-4 hover:underline">
          Editar
        </button>
        <button type="button" aria-label="Eliminar retiro" onClick={onRemove} className="inline-flex h-9 w-9 items-center justify-center bg-transparent text-[#8f5348]">
          <Trash2 strokeWidth={1.5} className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
