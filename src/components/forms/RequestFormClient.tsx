"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { addDaysISO, todayISO } from "@/lib/dates";
import { visitDateField, type FormField, type FormSection } from "@/lib/contentModel";
import { buttonClass, inputClass, labelClass } from "../formStyles";

type Registration = {
  id: string;
  qrDataUrl: string;
  verifyUrl: string;
  emailSent: boolean;
  payload: Record<string, string>;
};

function autoCompleteFor(id: string): string | undefined {
  if (id === "nombre") return "name";
  if (id === "email") return "email";
  if (id === "telefono") return "tel";
  return undefined;
}

export function RequestFormClient({
  type,
  fields,
  submitLabel,
  successMessage,
  retreatOptions = [],
  initialRetreat = "",
}: {
  type: FormSection;
  fields: FormField[];
  submitLabel: string;
  successMessage: string;
  retreatOptions?: { id: string; label: string }[];
  initialRetreat?: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const minDate = useMemo(() => addDaysISO(todayISO(), 1), []);
  const visitDateId = type === "visitas" ? visitDateField(fields)?.id : undefined;
  const retreatDefault = retreatOptions.some((option) => option.id === initialRetreat) ? initialRetreat : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string> = { type };
    for (const field of fields) {
      payload[field.id] = String(data.get(field.id) ?? "");
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo enviar. Compruebe los datos o intente más tarde.");
      if (type === "visitas") {
        setRegistration({
          id: String(json.id ?? ""),
          qrDataUrl: String(json.qrDataUrl ?? ""),
          verifyUrl: String(json.verifyUrl ?? ""),
          emailSent: Boolean(json.emailSent),
          payload,
        });
      } else {
        setCode(String(json.id ?? ""));
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo enviar. Compruebe los datos o intente más tarde.");
    }
  }

  if (status === "success" && type === "visitas" && registration) {
    return (
      <div className="space-y-4 border-t border-[var(--color-line)] pt-8 text-[var(--color-text)]">
        <p className="text-lg font-medium" style={{ fontFamily: "var(--font-serif)" }}>
          Visita registrada
        </p>
        <p>Paz y bien, {registration.payload.nombre}. Su ingreso quedó confirmado. Presente este código QR al llegar.</p>
        <dl className="grid gap-1 text-sm">
          {(visitDateId ? registration.payload[visitDateId] : "") ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Fecha</dt>
              <dd>{visitDateId ? registration.payload[visitDateId] : ""}</dd>
            </div>
          ) : null}
          {fields.find((field) => field.type === "time" && registration.payload[field.id]) ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Hora aproximada</dt>
              <dd>{registration.payload[fields.find((field) => field.type === "time")?.id ?? ""]}</dd>
            </div>
          ) : null}
          {registration.payload.personas ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Personas</dt>
              <dd>{registration.payload.personas}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[var(--color-text-muted)]">Código</dt>
            <dd className="font-mono text-xs">{registration.id}</dd>
          </div>
        </dl>
        {registration.qrDataUrl ? (
          <Image
            src={registration.qrDataUrl}
            alt="QR de registro de visita"
            width={180}
            height={180}
            unoptimized
            className="h-44 w-44 border border-[var(--color-line)] bg-white p-1"
          />
        ) : null}
        <p className="break-all text-xs text-[var(--color-text-muted)]">{registration.verifyUrl}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {registration.emailSent
            ? "También le enviamos este código QR a su correo electrónico."
            : "Guarde este código QR y preséntelo al llegar."}
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="border-t border-[var(--color-line)] pt-8 text-[var(--color-text)]">
        <p>{successMessage}</p>
        {code ? <p className="mt-2 font-mono text-xs text-[var(--color-ermita-muted)]">Codigo de registro: {code}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      {fields.map((field) => {
        const inputId = `${type}-${field.id}`;
        const choices =
          field.type === "retreat"
            ? retreatOptions.map((option) => ({ value: option.id, label: option.label }))
            : (field.options ?? []).map((option) => ({ value: option.value, label: option.label }));
        return (
          <div key={field.id} className={field.type === "textarea" ? "form-span" : undefined}>
            <label htmlFor={inputId} className={labelClass}>
              {field.label} {field.required ? <span className="text-red-800">*</span> : null}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={inputId}
                name={field.id}
                rows={4}
                required={field.required}
                placeholder={field.placeholder}
                className={`${inputClass} min-h-[8rem]`}
              />
            ) : field.type === "select" || field.type === "retreat" ? (
              <select
                id={inputId}
                name={field.id}
                required={field.required}
                defaultValue={field.type === "retreat" ? retreatDefault : ""}
                className={inputClass}
              >
                <option value="" disabled={field.required}>
                  {field.required ? "Seleccione una opción" : "Sin especificar"}
                </option>
                {choices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={inputId}
                name={field.id}
                type={field.type === "number" ? "text" : field.type}
                inputMode={field.type === "number" ? "numeric" : undefined}
                required={field.required}
                placeholder={field.placeholder}
                autoComplete={autoCompleteFor(field.id)}
                min={field.id === visitDateId ? minDate : undefined}
                className={inputClass}
              />
            )}
          </div>
        );
      })}
      {status === "error" ? (
        <p className="form-span text-sm text-red-800" role="alert">
          {message}
        </p>
      ) : null}
      <div className="form-span">
        <button type="submit" disabled={status === "loading"} className={buttonClass}>
          {status === "loading" ? "Enviando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
