"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, GripVertical, Lock, Trash2 } from "lucide-react";
import {
  FIELD_TYPE_LABELS,
  newClientId,
  type FieldType,
  type FormField,
  type FormSection,
} from "@/lib/contentModel";
import { EditorStatus } from "./AdminPanel";
import { saveAdminContent } from "./saveContent";
import { adminInputClass, adminMutedClass } from "./styles";
import { UnsavedChangesBar, useConfirmOnLeave, useUnsavedDirty } from "./UnsavedChangesBar";

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

function isFixed(field: FormField) {
  return field.id === "nombre" || field.id === "email";
}

function typeLabel(type: FieldType) {
  if (type === "retreat") return "Retiro";
  return FIELD_TYPE_LABELS[type];
}

function restoreFixed(original: FormField[], moved: FormField[]) {
  const next = [...moved];
  original.forEach((field, index) => {
    if (!isFixed(field)) return;
    const current = next.findIndex((item) => item.id === field.id);
    if (current < 0 || current === index) return;
    const [item] = next.splice(current, 1);
    next.splice(index, 0, item!);
  });
  return next;
}

function canShift(list: FormField[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= list.length) return false;
  if (isFixed(list[index]) || isFixed(list[target])) return false;
  return true;
}

function iconButtonClass(danger = false) {
  return `inline-flex h-9 w-9 shrink-0 items-center justify-center bg-transparent ${
    danger ? "text-[#8f5348]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
  } disabled:opacity-30`;
}

function QuestionRow({
  form,
  field,
  expanded,
  canUp,
  canDown,
  onToggle,
  onMove,
  onRemove,
  onUpdate,
  onChangeType,
}: {
  form: FormSection;
  field: FormField;
  expanded: boolean;
  canUp: boolean;
  canDown: boolean;
  onToggle: () => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onUpdate: (patch: Partial<FormField>) => void;
  onChangeType: (type: Exclude<FieldType, "retreat">) => void;
}) {
  const fixed = isFixed(field);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    disabled: fixed,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const labelId = `${form}-${field.id}-label`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-t border-[var(--color-line)] ${isDragging ? "relative z-10 bg-[var(--color-bg)]" : ""}`}
    >
      <div className="flex min-h-14 items-center gap-1 sm:gap-2">
        {fixed ? (
          <span className="inline-flex h-9 w-9 shrink-0" aria-hidden />
        ) : (
          <button
            type="button"
            className={`${iconButtonClass()} cursor-grab touch-none active:cursor-grabbing`}
            aria-label="Reordenar"
            {...attributes}
            {...listeners}
          >
            <GripVertical strokeWidth={1.5} className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 flex-col justify-center py-2 text-left sm:flex-row sm:items-center sm:gap-3"
        >
          <span className={`min-w-0 truncate text-sm sm:flex-1 ${field.label.trim() ? "text-[var(--color-text)]" : "text-[var(--color-muted)]"}`}>
            {field.label.trim() || "Sin etiqueta"}
          </span>
          <span className="truncate text-xs text-[var(--color-muted)] sm:shrink-0">{typeLabel(field.type)}</span>
        </button>
        <span className="shrink-0 text-xs text-[var(--color-muted)]">{field.required ? "Obligatoria" : "Opcional"}</span>
        {fixed ? (
          <span className={iconButtonClass()} title="Campo fijo" aria-label="Campo fijo">
            <Lock strokeWidth={1.5} className="h-4 w-4" />
          </span>
        ) : (
          <>
            <button type="button" className={iconButtonClass()} aria-label="Subir" disabled={!canUp} onClick={() => onMove(-1)}>
              <ArrowUp strokeWidth={1.5} className="h-4 w-4" />
            </button>
            <button type="button" className={iconButtonClass()} aria-label="Bajar" disabled={!canDown} onClick={() => onMove(1)}>
              <ArrowDown strokeWidth={1.5} className="h-4 w-4" />
            </button>
            {field.locked ? (
              <span className="inline-flex h-9 w-9 shrink-0" aria-hidden />
            ) : (
              <button type="button" className={iconButtonClass(true)} aria-label="Eliminar" onClick={onRemove}>
                <Trash2 strokeWidth={1.5} className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      {expanded ? (
        <div className="border-t border-[var(--color-line)] px-1 py-6 sm:px-11">
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={labelId} className="block text-xs text-[var(--color-muted)]">
                Etiqueta
              </label>
              <input
                id={labelId}
                value={field.label}
                maxLength={140}
                onChange={(event) => onUpdate({ label: event.target.value })}
                className={adminInputClass}
              />
            </div>
            <div className="min-w-0">
              {field.type === "retreat" ? (
                <p className={`sm:pt-5 ${adminMutedClass}`}>
                  Las opciones salen de «Retiros programados», más la alternativa de futuras fechas.
                </p>
              ) : (
                <>
                  <label htmlFor={`${labelId}-tipo`} className="block text-xs text-[var(--color-muted)]">
                    Tipo de respuesta
                  </label>
                  <select
                    id={`${labelId}-tipo`}
                    value={field.type}
                    disabled={fixed}
                    onChange={(event) => onChangeType(event.target.value as Exclude<FieldType, "retreat">)}
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
            <div className="mt-6 space-y-3 border-t border-[var(--color-line)] pt-4">
              <p className="text-xs text-[var(--color-muted)]">Opciones</p>
              {(field.options ?? []).map((option) => (
                <div key={option.value} className="flex min-w-0 items-center gap-3">
                  <input
                    value={option.label}
                    maxLength={80}
                    aria-label="Texto de la opción"
                    onChange={(event) =>
                      onUpdate({
                        options: (field.options ?? []).map((item) =>
                          item.value === option.value ? { ...item, label: event.target.value } : item
                        ),
                      })
                    }
                    className={`${adminInputClass} min-w-0 flex-1`}
                  />
                  <button
                    type="button"
                    className="shrink-0 bg-transparent py-2 text-sm text-[#8f5348] underline-offset-4 hover:underline"
                    onClick={() =>
                      onUpdate({
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
                className="bg-transparent py-2 text-sm text-[var(--color-text)] underline-offset-4 hover:underline"
                onClick={() =>
                  onUpdate({
                    options: [...(field.options ?? []), { value: newClientId(), label: "" }],
                  })
                }
              >
                Agregar opción
              </button>
            </div>
          ) : null}

          <label className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-text)]">
            <input
              type="checkbox"
              checked={field.required}
              disabled={fixed}
              onChange={(event) => onUpdate({ required: event.target.checked })}
            />
            Obligatoria
          </label>
        </div>
      ) : null}
    </div>
  );
}

export function FormFieldsEditor({ form, initialFields }: { form: FormSection; initialFields: FormField[] }) {
  const router = useRouter();
  const { setDirty } = useUnsavedDirty();
  const [fields, setFields] = useState<FormField[]>(() => structuredClone(initialFields));
  const baselineRef = useRef<string | null>(null);
  if (baselineRef.current === null) baselineRef.current = JSON.stringify(fields);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const dirty = JSON.stringify(fields) !== baselineRef.current;

  useConfirmOnLeave(dirty);

  useLayoutEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function update(id: string, patch: Partial<FormField>) {
    setFields((current) => current.map((field) => (field.id === id ? { ...field, ...patch } : field)));
  }

  function move(index: number, direction: -1 | 1) {
    setFields((current) => {
      if (!canShift(current, index, direction)) return current;
      return arrayMove(current, index, index + direction);
    });
  }

  function remove(field: FormField) {
    if (field.locked || isFixed(field)) return;
    if (!window.confirm("¿Quitar esta pregunta del formulario público?")) return;
    setFields((current) => current.filter((item) => item.id !== field.id));
    setExpandedId((current) => (current === field.id ? null : current));
  }

  function addField() {
    const id = newClientId();
    setFields((current) => [...current, { id, label: "", type: "text", required: false, locked: false }]);
    setExpandedId(id);
  }

  function changeType(field: FormField, type: Exclude<FieldType, "retreat">) {
    if (isFixed(field)) return;
    if (type === "select") {
      update(field.id, {
        type,
        options: field.options?.length ? field.options : [{ value: newClientId(), label: "" }],
      });
      return;
    }
    update(field.id, { type, options: undefined });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFields((current) => {
      const oldIndex = current.findIndex((field) => field.id === active.id);
      const newIndex = current.findIndex((field) => field.id === over.id);
      if (oldIndex < 0 || newIndex < 0 || isFixed(current[oldIndex])) return current;
      return restoreFixed(current, arrayMove(current, oldIndex, newIndex));
    });
  }

  function discard() {
    setFields(JSON.parse(baselineRef.current ?? "[]") as FormField[]);
    setExpandedId(null);
    setMessage("");
    setError("");
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
      const next = saved.forms[form];
      baselineRef.current = JSON.stringify(next);
      setFields(next);
      setMessage("Cambios guardados. Ya se ven en el formulario público.");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={dirty ? "pb-24" : undefined}>
      <p className={`max-w-3xl ${adminMutedClass}`}>{descriptionFor(form)}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-6">
            {fields.map((field, index) => (
              <QuestionRow
                key={field.id}
                form={form}
                field={field}
                expanded={expandedId === field.id}
                canUp={canShift(fields, index, -1)}
                canDown={canShift(fields, index, 1)}
                onToggle={() => setExpandedId((current) => (current === field.id ? null : field.id))}
                onMove={(direction) => move(index, direction)}
                onRemove={() => remove(field)}
                onUpdate={(patch) => update(field.id, patch)}
                onChangeType={(type) => changeType(field, type)}
              />
            ))}
            <button
              type="button"
              onClick={addField}
              className="flex min-h-14 w-full items-center border-t border-[var(--color-line)] text-left text-sm text-[var(--color-accent)]"
            >
              + Agregar pregunta
            </button>
          </div>
        </SortableContext>
      </DndContext>
      <div className="mt-4">
        <EditorStatus message={message} error={error} />
      </div>
      <UnsavedChangesBar visible={dirty} saving={saving} onDiscard={discard} onSave={save} />
    </div>
  );
}
