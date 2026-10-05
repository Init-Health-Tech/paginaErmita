"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { COST_MODEL_LABELS, newClientId, type CostModel, type RentalCosts } from "@/lib/contentModel";
import { EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import { adminInputClass, adminMutedClass } from "./styles";
import { UnsavedChangesBar, useConfirmOnLeave, useUnsavedDirty } from "./UnsavedChangesBar";

const labelClass = "block font-sans text-[13px] leading-5 text-[var(--color-text)]";
const rowInputClass =
  "min-h-11 min-w-0 flex-1 border border-[var(--color-line)] bg-transparent px-3 font-sans text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)]";

export function CostsEditor({ initialCosts }: { initialCosts: RentalCosts }) {
  const router = useRouter();
  const { setDirty } = useUnsavedDirty();
  const [costs, setCosts] = useState<RentalCosts>(() => structuredClone(initialCosts));
  const baselineRef = useRef<string | null>(null);
  if (baselineRef.current === null) baselineRef.current = JSON.stringify(costs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(costs) !== baselineRef.current;

  useConfirmOnLeave(dirty);

  useLayoutEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  function updatePackage(id: string, patch: Partial<RentalCosts["packages"][number]>) {
    setCosts((current) => ({
      ...current,
      packages: current.packages.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function discard() {
    setCosts(JSON.parse(baselineRef.current ?? "null") as RentalCosts);
    setMessage("");
    setError("");
  }

  async function save() {
    setError("");
    setMessage("");
    if (costs.model === "per_person_per_day" && (costs.pricePerPersonPerDay == null || Number.isNaN(costs.pricePerPersonPerDay))) {
      setError("Indique el precio por persona por día.");
      return;
    }
    if (costs.model === "flat_rate" && (costs.flatRate == null || Number.isNaN(costs.flatRate))) {
      setError("Indique la tarifa fija.");
      return;
    }
    if (costs.packages.some((item) => !item.name.trim())) {
      setError("Cada paquete de comida necesita un nombre.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAdminContent({ section: "costs", costs });
      const next = saved.costs;
      baselineRef.current = JSON.stringify(next);
      setCosts(next);
      setMessage("Costos guardados. Ya pueden verse en la página de Alquiler.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={dirty ? "pb-24" : undefined}>
      <div className="max-w-[680px]">
        <p className={adminMutedClass}>
          Defina cómo se explica el costo en la página pública y los paquetes de comida que quiera mostrar (por ejemplo, solo desayuno o pensión completa).
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="modelo-costo" className={labelClass}>
              Modelo de costo
            </label>
            <select
              id="modelo-costo"
              className={adminInputClass}
              value={costs.model}
              onChange={(event) => setCosts((current) => ({ ...current, model: event.target.value as CostModel }))}
            >
              {(Object.entries(COST_MODEL_LABELS) as [CostModel, string][]).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {costs.model === "per_person_per_day" ? (
            <div>
              <label htmlFor="precio-persona" className={labelClass}>
                Precio por persona por día (MXN)
              </label>
              <input
                id="precio-persona"
                type="number"
                min={0}
                step="0.01"
                value={costs.pricePerPersonPerDay ?? ""}
                onChange={(event) =>
                  setCosts((current) => ({
                    ...current,
                    pricePerPersonPerDay: event.target.value === "" ? null : Number(event.target.value),
                  }))
                }
                className={adminInputClass}
              />
            </div>
          ) : null}

          {costs.model === "flat_rate" ? (
            <div>
              <label htmlFor="tarifa-fija" className={labelClass}>
                Tarifa fija (MXN)
              </label>
              <input
                id="tarifa-fija"
                type="number"
                min={0}
                step="0.01"
                value={costs.flatRate ?? ""}
                onChange={(event) =>
                  setCosts((current) => ({
                    ...current,
                    flatRate: event.target.value === "" ? null : Number(event.target.value),
                  }))
                }
                className={adminInputClass}
              />
            </div>
          ) : null}

          <div>
            <label htmlFor="texto-costo" className={labelClass}>
              Texto en la página pública
            </label>
            <textarea
              id="texto-costo"
              rows={4}
              maxLength={2000}
              value={costs.summary}
              onChange={(event) => setCosts((current) => ({ ...current, summary: event.target.value }))}
              className={`${adminInputClass} min-h-[8rem]`}
            />
          </div>
        </div>

        <div className="mt-10">
          <p className={labelClass}>Paquetes de comida</p>
          {costs.packages.length === 0 ? <p className={`mt-4 ${adminMutedClass}`}>Aún no hay paquetes.</p> : null}
          <div className="mt-4">
            {costs.packages.map((item) => (
              <div key={item.id} className="flex min-h-14 items-center gap-2 border-t border-[var(--color-line)] py-2">
                <input
                  aria-label="Nombre"
                  placeholder="Nombre"
                  value={item.name}
                  maxLength={80}
                  onChange={(event) => updatePackage(item.id, { name: event.target.value })}
                  className={rowInputClass}
                />
                <input
                  aria-label="Descripción"
                  placeholder="Descripción"
                  value={item.description}
                  maxLength={400}
                  onChange={(event) => updatePackage(item.id, { description: event.target.value })}
                  className={`${rowInputClass} flex-[1.4]`}
                />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-transparent text-[#8f5348]"
                  aria-label="Eliminar paquete"
                  onClick={() => {
                    if (!window.confirm("¿Eliminar este paquete?")) return;
                    setCosts((current) => ({ ...current, packages: current.packages.filter((pkg) => pkg.id !== item.id) }));
                  }}
                >
                  <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setCosts((current) => ({
                  ...current,
                  packages: [...current.packages, { id: newClientId(), name: "", description: "" }],
                }))
              }
              className="flex min-h-14 w-full items-center border-t border-[var(--color-line)] text-left text-sm text-[var(--color-accent)]"
            >
              + Agregar paquete
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 max-w-[680px]">
        <EditorStatus message={message} error={error} />
      </div>
      <UnsavedChangesBar visible={dirty} saving={saving} onDiscard={discard} onSave={save} />
    </div>
  );
}
