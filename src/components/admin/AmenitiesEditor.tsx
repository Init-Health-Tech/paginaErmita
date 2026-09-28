"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AMENITY_ICON_LABELS, newClientId, type Amenity, type AmenityIcon } from "@/lib/contentModel";
import { AdminPanel, EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import {
  adminDangerButtonClass,
  adminInputClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "./styles";

export function AmenitiesEditor({ initialAmenities }: { initialAmenities: Amenity[] }) {
  const router = useRouter();
  const [amenities, setAmenities] = useState<Amenity[]>(() => structuredClone(initialAmenities));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<Amenity>) {
    setAmenities((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function save() {
    setError("");
    setMessage("");
    if (amenities.some((item) => !item.title.trim())) {
      setError("Cada amenidad necesita un nombre.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAdminContent({ section: "amenities", amenities });
      setAmenities(saved.amenities);
      setMessage("Amenidades guardadas. Ya se ven en Alquiler y en Visitas.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPanel
      title="Amenidades"
      description="Esta lista se publica en Alquiler y en Visitas. Capilla, Comedor y Cuartos conservan su fotografía; las que agregue aparecen sin foto."
    >
      <div className="space-y-3">
        {amenities.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-sm border border-[var(--color-ermita-line)] bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor={`${item.id}-titulo`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                  Nombre
                </label>
                <input
                  id={`${item.id}-titulo`}
                  value={item.title}
                  maxLength={80}
                  onChange={(event) => update(item.id, { title: event.target.value })}
                  className={adminInputClass}
                />
              </div>
              <div>
                <label htmlFor={`${item.id}-icono`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                  Ícono
                </label>
                <select
                  id={`${item.id}-icono`}
                  value={item.icon}
                  onChange={(event) => update(item.id, { icon: event.target.value as AmenityIcon })}
                  className={adminInputClass}
                >
                  {(Object.entries(AMENITY_ICON_LABELS) as [AmenityIcon, string][]).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={`${item.id}-frase`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                Frase
              </label>
              <input
                id={`${item.id}-frase`}
                value={item.phrase}
                maxLength={140}
                onChange={(event) => update(item.id, { phrase: event.target.value })}
                className={adminInputClass}
              />
            </div>
            <p className="text-xs text-[var(--color-ermita-muted)]">
              {item.src ? "Conserva su fotografía en la página pública." : "Se publicará sin fotografía."}
            </p>
            <button
              type="button"
              className={adminDangerButtonClass}
              onClick={() => {
                if (!window.confirm("¿Quitar esta amenidad de la página pública?")) return;
                setAmenities((current) => current.filter((amenity) => amenity.id !== item.id));
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
        <button
          type="button"
          className={adminSecondaryButtonClass}
          onClick={() =>
            setAmenities((current) => [
              ...current,
              { id: newClientId(), title: "", phrase: "", icon: "general" },
            ])
          }
        >
          Agregar amenidad
        </button>
      </div>
      <div className="mt-5">
        <button type="button" className={adminPrimaryButtonClass} disabled={saving} onClick={save}>
          {saving ? "Guardando…" : "Guardar amenidades"}
        </button>
      </div>
      <div className="mt-3">
        <EditorStatus message={message} error={error} />
      </div>
    </AdminPanel>
  );
}
