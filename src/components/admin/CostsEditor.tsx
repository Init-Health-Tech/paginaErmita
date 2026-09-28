"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COST_MODEL_LABELS, newClientId, type CostModel, type RentalCosts } from "@/lib/contentModel";
import { AdminPanel, EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import {
  adminDangerButtonClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "./styles";

export function CostsEditor({ initialCosts }: { initialCosts: RentalCosts }) {
  const router = useRouter();
  const [costs, setCosts] = useState<RentalCosts>(() => structuredClone(initialCosts));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updatePackage(id: string, patch: Partial<RentalCosts["packages"][number]>) {
    setCosts((current) => ({
      ...current,
      packages: current.packages.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
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
      setCosts(saved.costs);
      setMessage("Costos guardados. Ya pueden verse en la página de Alquiler.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPanel
      title="Costos"
      description="Defina cómo se explica el costo en la página pública y los paquetes de comida que quiera mostrar (por ejemplo, solo desayuno o pensión completa)."
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="modelo-costo" className="block text-sm font-medium text-[var(--color-ermita-ink)]">
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
            <label htmlFor="precio-persona" className="block text-sm font-medium text-[var(--color-ermita-ink)]">
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
            <label htmlFor="tarifa-fija" className="block text-sm font-medium text-[var(--color-ermita-ink)]">
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
          <label htmlFor="texto-costo" className="block text-sm font-medium text-[var(--color-ermita-ink)]">
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

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-[var(--color-ermita-ink)]">Paquetes de comida</h3>
          {costs.packages.length === 0 ? (
            <p className="text-sm text-[var(--color-ermita-muted)]">Aún no hay paquetes.</p>
          ) : null}
          {costs.packages.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-sm border border-[var(--color-ermita-line)] bg-white p-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-ermita-muted)]" htmlFor={`${item.id}-nombre`}>
                  Nombre
                </label>
                <input
                  id={`${item.id}-nombre`}
                  value={item.name}
                  maxLength={80}
                  onChange={(event) => updatePackage(item.id, { name: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-ermita-muted)]" htmlFor={`${item.id}-desc`}>
                  Descripción
                </label>
                <textarea
                  id={`${item.id}-desc`}
                  rows={2}
                  maxLength={400}
                  value={item.description}
                  onChange={(event) => updatePackage(item.id, { description: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <button
                type="button"
                className={adminDangerButtonClass}
                onClick={() => {
                  if (!window.confirm("¿Eliminar este paquete?")) return;
                  setCosts((current) => ({ ...current, packages: current.packages.filter((pkg) => pkg.id !== item.id) }));
                }}
              >
                Eliminar paquete
              </button>
            </div>
          ))}
          <button
            type="button"
            className={adminSecondaryButtonClass}
            onClick={() =>
              setCosts((current) => ({
                ...current,
                packages: [...current.packages, { id: newClientId(), name: "", description: "" }],
              }))
            }
          >
            Agregar paquete
          </button>
        </div>
      </div>
      <div className="mt-5">
        <button type="button" className={adminPrimaryButtonClass} disabled={saving} onClick={save}>
          {saving ? "Guardando…" : "Guardar costos"}
        </button>
      </div>
      <div className="mt-3">
        <EditorStatus message={message} error={error} />
      </div>
    </AdminPanel>
  );
}
