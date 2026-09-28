"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRetreatDates, newClientId, type ScheduledRetreat } from "@/lib/contentModel";
import { AdminPanel, EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import {
  adminDangerButtonClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "./styles";

export function RetreatsEditor({ initialRetreats }: { initialRetreats: ScheduledRetreat[] }) {
  const router = useRouter();
  const [retreats, setRetreats] = useState<ScheduledRetreat[]>(() => structuredClone(initialRetreats));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<ScheduledRetreat>) {
    setRetreats((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function save() {
    setError("");
    setMessage("");
    for (const retreat of retreats) {
      if (!retreat.name.trim()) {
        setError("Cada retiro necesita un nombre.");
        return;
      }
      if (!retreat.startDate || !retreat.endDate) {
        setError(`«${retreat.name || "Retiro"}» necesita fecha de inicio y de fin.`);
        return;
      }
      if (retreat.endDate < retreat.startDate) {
        setError(`«${retreat.name}»: la fecha de fin no puede ser anterior a la de inicio.`);
        return;
      }
      if (retreat.capacity != null && (!Number.isInteger(retreat.capacity) || retreat.capacity < 1)) {
        setError(`«${retreat.name}»: el cupo debe ser un entero mayor a cero, o quedar vacío.`);
        return;
      }
    }
    setSaving(true);
    try {
      const saved = await saveAdminContent({ section: "retreats", retreats });
      setRetreats(saved.retreats);
      setMessage("Retiros guardados. La página pública y el formulario ya usan esta lista.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPanel
      title="Retiros programados"
      description="Esta lista alimenta «Próximos retiros» y el selector del formulario público. Las fechas de cada retiro bloquean el registro de visitas en esos días."
    >
      <div className="space-y-3">
        {retreats.length === 0 ? (
          <p className="text-sm text-[var(--color-ermita-muted)]">No hay retiros programados.</p>
        ) : null}
        {retreats.map((retreat) => {
          const dates = formatRetreatDates(retreat.startDate, retreat.endDate);
          return (
            <div key={retreat.id} className="grid gap-3 rounded-sm border border-[var(--color-ermita-line)] bg-white p-4">
              <div>
                <label htmlFor={`${retreat.id}-nombre`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                  Nombre
                </label>
                <input
                  id={`${retreat.id}-nombre`}
                  value={retreat.name}
                  maxLength={120}
                  onChange={(event) => update(retreat.id, { name: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${retreat.id}-inicio`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                    Fecha de inicio
                  </label>
                  <input
                    id={`${retreat.id}-inicio`}
                    type="date"
                    value={retreat.startDate}
                    onChange={(event) => update(retreat.id, { startDate: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
                <div>
                  <label htmlFor={`${retreat.id}-fin`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                    Fecha de fin
                  </label>
                  <input
                    id={`${retreat.id}-fin`}
                    type="date"
                    value={retreat.endDate}
                    onChange={(event) => update(retreat.id, { endDate: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
              </div>
              {dates ? <p className="text-sm text-[var(--color-accent-dark)]">{dates}</p> : null}
              <div>
                <label htmlFor={`${retreat.id}-desc`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                  Descripción
                </label>
                <textarea
                  id={`${retreat.id}-desc`}
                  rows={3}
                  maxLength={800}
                  value={retreat.description}
                  onChange={(event) => update(retreat.id, { description: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <div>
                <label htmlFor={`${retreat.id}-cupo`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                  Cupo (opcional)
                </label>
                <input
                  id={`${retreat.id}-cupo`}
                  type="number"
                  min={1}
                  step={1}
                  value={retreat.capacity ?? ""}
                  onChange={(event) =>
                    update(retreat.id, {
                      capacity: event.target.value === "" ? null : Number(event.target.value),
                    })
                  }
                  className={adminInputClass}
                />
              </div>
              <button
                type="button"
                className={adminDangerButtonClass}
                onClick={() => {
                  if (!window.confirm("¿Eliminar este retiro? Las inscripciones ya recibidas se conservan.")) return;
                  setRetreats((current) => current.filter((item) => item.id !== retreat.id));
                }}
              >
                Eliminar retiro
              </button>
            </div>
          );
        })}
        <button
          type="button"
          className={adminSecondaryButtonClass}
          onClick={() =>
            setRetreats((current) => [
              ...current,
              {
                id: newClientId(),
                name: "",
                startDate: "",
                endDate: "",
                description: "",
                capacity: null,
              },
            ])
          }
        >
          Agregar retiro
        </button>
      </div>
      <div className="mt-5">
        <button type="button" className={adminPrimaryButtonClass} disabled={saving} onClick={save}>
          {saving ? "Guardando…" : "Guardar retiros"}
        </button>
      </div>
      <div className="mt-3">
        <EditorStatus message={message} error={error} />
      </div>
    </AdminPanel>
  );
}
