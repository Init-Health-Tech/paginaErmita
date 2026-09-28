"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FIELD_TYPE_LABELS,
  newClientId,
  type FieldType,
  type FormField,
  type FormSection,
} from "@/lib/contentModel";
import { AdminPanel, EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import { adminDangerButtonClass, adminGhostButtonClass, adminInputClass, adminPrimaryButtonClass, adminSecondaryButtonClass } from "./styles";

const TYPE_OPTIONS = Object.entries(FIELD_TYPE_LABELS) as [Exclude<FieldType, "retreat">, string][];

function descriptionFor(form: FormSection): string {
  if (form === "retiros") {
    return "Estas preguntas aparecen en el formulario público de Retiros. Nombre y correo no se pueden quitar y siguen siendo obligatorios. «Retiro de interés» se conserva porque enlaza cada inscripción con un retiro programado; puede cambiar su texto y si es obligatoria.";
  }
  if (form === "visitas") {
    return "Estas preguntas aparecen en el formulario público de Visitas. Nombre y correo no se pueden quitar y siguen siendo obligatorios. Si deja una pregunta de tipo fecha, la visita sigue pidiendo al menos un día de anticipación y respeta los días ocupados por retiros.";
  }
  return "Estas preguntas aparecen en el formulario público de Alquiler. Nombre y correo no se pueden quitar y siguen siendo obligatorios.";
}

export function FormFieldsEditor({ form, initialFields }: { form: FormSection; initialFields: FormField[] }) {
  const router = useRouter();
  const [fields, setFields] = useState<FormField[]>(() => structuredClone(initialFields));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update(id: string, patch: Partial<FormField>) {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  }

  function move(index: number, direction: -1 | 1) {
    setFields((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  function remove(field: FormField) {
    if (field.locked) return;
    if (!window.confirm("¿Quitar esta pregunta del formulario público?")) return;
    setFields((current) => current.filter((item) => item.id !== field.id));
  }

  function addField() {
    setFields((current) => [
      ...current,
      { id: newClientId(), label: "", type: "text", required: false, locked: false },
    ]);
  }

  function changeType(field: FormField, type: Exclude<FieldType, "retreat">) {
    if (type === "select") {
      update(field.id, {
        type,
        options: field.options?.length ? field.options : [{ value: newClientId(), label: "" }],
      });
      return;
    }
    update(field.id, { type, options: undefined });
  }

  async function save() {
    setError("");
    setMessage("");
    if (fields.some((field) => !field.label.trim())) {
      setError("Cada pregunta necesita una etiqueta.");
      return;
    }
    if (fields.some((field) => field.type === "select" && (!field.options?.length || field.options.some((option) => !option.label.trim())))) {
      setError("Cada lista necesita al menos una opción con texto.");
      return;
    }
    setSaving(true);
    try {
      const saved = await saveAdminContent({ section: "form", form, fields });
      setFields(saved.forms[form]);
      setMessage("Cambios guardados. Ya se ven en el formulario público.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPanel title="Preguntas del formulario" description={descriptionFor(form)}>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const identity = field.id === "nombre" || field.id === "email";
          const labelId = `${form}-${field.id}-label`;
          return (
            <div key={field.id} className="rounded-sm border border-[var(--color-ermita-line)] bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={labelId} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                    Etiqueta
                  </label>
                  <input
                    id={labelId}
                    value={field.label}
                    maxLength={140}
                    onChange={(event) => update(field.id, { label: event.target.value })}
                    className={adminInputClass}
                  />
                </div>
                <div>
                  {field.type === "retreat" ? (
                    <p className="sm:pt-5 text-sm leading-relaxed text-[var(--color-ermita-muted)]">
                      Las opciones salen de «Retiros programados», más la alternativa de futuras fechas.
                    </p>
                  ) : (
                    <>
                      <label htmlFor={`${labelId}-tipo`} className="block text-xs font-medium text-[var(--color-ermita-muted)]">
                        Tipo de respuesta
                      </label>
                      <select
                        id={`${labelId}-tipo`}
                        value={field.type}
                        disabled={identity}
                        onChange={(event) => changeType(field, event.target.value as Exclude<FieldType, "retreat">)}
                        className={adminInputClass}
                      >
                        {TYPE_OPTIONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>

              {field.type === "select" ? (
                <div className="mt-3 space-y-2 rounded-sm border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)] p-3">
                  <p className="text-xs font-medium text-[var(--color-ermita-muted)]">Opciones</p>
                  {(field.options ?? []).map((option) => (
                    <div key={option.value} className="flex gap-2">
                      <input
                        value={option.label}
                        maxLength={80}
                        aria-label="Texto de la opción"
                        onChange={(event) =>
                          update(field.id, {
                            options: (field.options ?? []).map((item) =>
                              item.value === option.value ? { ...item, label: event.target.value } : item
                            ),
                          })
                        }
                        className={adminInputClass}
                      />
                      <button
                        type="button"
                        className={adminDangerButtonClass}
                        onClick={() =>
                          update(field.id, {
                            options: (field.options ?? []).filter((item) => item.value !== option.value),
                          })
                        }
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={adminGhostButtonClass}
                    onClick={() =>
                      update(field.id, {
                        options: [...(field.options ?? []), { value: newClientId(), label: "" }],
                      })
                    }
                  >
                    Agregar opción
                  </button>
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="mr-2 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-ermita-ink)]">
                  <input
                    type="checkbox"
                    checked={field.required}
                    disabled={identity}
                    onChange={(event) => update(field.id, { required: event.target.checked })}
                  />
                  Obligatoria
                </label>
                <button type="button" className={adminGhostButtonClass} disabled={index === 0} onClick={() => move(index, -1)}>
                  Subir
                </button>
                <button
                  type="button"
                  className={adminGhostButtonClass}
                  disabled={index === fields.length - 1}
                  onClick={() => move(index, 1)}
                >
                  Bajar
                </button>
                {field.locked ? null : (
                  <button type="button" className={adminDangerButtonClass} onClick={() => remove(field)}>
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" className={adminSecondaryButtonClass} onClick={addField}>
          Agregar pregunta
        </button>
        <button type="button" className={adminPrimaryButtonClass} disabled={saving} onClick={save}>
          {saving ? "Guardando…" : "Guardar preguntas"}
        </button>
      </div>
      <div className="mt-3">
        <EditorStatus message={message} error={error} />
      </div>
    </AdminPanel>
  );
}
