"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bed, Church, Leaf, Trash2, Utensils, type LucideIcon } from "lucide-react";
import { AMENITY_ICON_LABELS, newClientId, type Amenity, type AmenityIcon } from "@/lib/contentModel";
import { EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import { adminInputClass, adminMutedClass } from "./styles";
import { UnsavedChangesBar, useConfirmOnLeave, useUnsavedDirty } from "./UnsavedChangesBar";

const ICONS: Record<AmenityIcon, LucideIcon> = {
  capilla: Church,
  comedor: Utensils,
  cuartos: Bed,
  general: Leaf,
};

const labelClass = "block font-sans text-[13px] leading-5 text-[var(--color-muted)]";

export function AmenitiesEditor({ initialAmenities }: { initialAmenities: Amenity[] }) {
  const router = useRouter();
  const { setDirty } = useUnsavedDirty();
  const [amenities, setAmenities] = useState<Amenity[]>(() => structuredClone(initialAmenities));
  const baselineRef = useRef<string | null>(null);
  if (baselineRef.current === null) baselineRef.current = JSON.stringify(amenities);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(amenities) !== baselineRef.current;

  useConfirmOnLeave(dirty);

  useLayoutEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  function update(id: string, patch: Partial<Amenity>) {
    setAmenities((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function discard() {
    setAmenities(JSON.parse(baselineRef.current ?? "[]") as Amenity[]);
    setExpandedId(null);
    setMessage("");
    setError("");
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
      const next = saved.amenities;
      baselineRef.current = JSON.stringify(next);
      setAmenities(next);
      setMessage("Amenidades guardadas. Ya se ven en Alquiler y en Visitas.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={dirty ? "pb-24" : undefined}>
      <p className={`max-w-3xl ${adminMutedClass}`}>
        Esta lista se publica en Alquiler y en Visitas. Capilla, Comedor y Cuartos conservan su fotografía; las que agregue aparecen sin foto.
      </p>
      <div className="mt-6">
        {amenities.map((item) => {
          const Icon = ICONS[item.icon] ?? Leaf;
          const expanded = expandedId === item.id;
          return (
            <div key={item.id} className="border-t border-[var(--color-line)]">
              <div className="flex min-h-14 items-center gap-2 sm:gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-muted)]" aria-hidden>
                  <Icon strokeWidth={1.5} className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  onClick={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                  aria-expanded={expanded}
                  className="flex min-w-0 flex-1 flex-col justify-center py-2 text-left sm:flex-row sm:items-center sm:gap-3"
                >
                  <span className={`min-w-0 truncate text-sm sm:flex-1 ${item.title.trim() ? "text-[var(--color-text)]" : "text-[var(--color-muted)]"}`}>
                    {item.title.trim() || "Sin nombre"}
                  </span>
                  <span className="truncate text-xs text-[var(--color-muted)] sm:shrink-0">{item.phrase.trim() || "Sin frase"}</span>
                </button>
                {item.src ? <span className="shrink-0 text-xs text-[var(--color-muted)]">Con fotografía</span> : null}
                <button
                  type="button"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center bg-transparent text-[#8f5348]"
                  aria-label="Eliminar"
                  onClick={() => {
                    if (!window.confirm("¿Quitar esta amenidad de la página pública?")) return;
                    setAmenities((current) => current.filter((amenity) => amenity.id !== item.id));
                    setExpandedId((current) => (current === item.id ? null : current));
                  }}
                >
                  <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                </button>
              </div>
              {expanded ? (
                <div className="border-t border-[var(--color-line)] px-1 py-6 sm:px-12">
                  <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label htmlFor={`${item.id}-titulo`} className={labelClass}>
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
                    <div className="min-w-0">
                      <label htmlFor={`${item.id}-icono`} className={labelClass}>
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
                  <div className="mt-4">
                    <label htmlFor={`${item.id}-frase`} className={labelClass}>
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
                  <p className={`mt-4 ${adminMutedClass}`}>
                    {item.src ? "Conserva su fotografía en la página pública." : "Se publicará sin fotografía."}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const id = newClientId();
            setAmenities((current) => [...current, { id, title: "", phrase: "", icon: "general" }]);
            setExpandedId(id);
          }}
          className="flex min-h-14 w-full items-center border-t border-[var(--color-line)] text-left text-sm text-[var(--color-accent)]"
        >
          + Agregar amenidad
        </button>
      </div>
      <div className="mt-4">
        <EditorStatus message={message} error={error} />
      </div>
      <UnsavedChangesBar visible={dirty} saving={saving} onDiscard={discard} onSave={save} />
    </div>
  );
}
