"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { buttonClass, inputClass, labelClass } from "./formStyles";
import { addDaysISO, todayISO } from "@/lib/dates";

type Registration = {
  id: string;
  qrDataUrl: string;
  verifyUrl: string;
  emailSent: boolean;
  fecha: string;
  hora: string;
  personas: string;
  nombre: string;
};

export function FormVisitas() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const minDate = useMemo(() => addDaysISO(todayISO(), 1), []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "visitas" as const,
      nombre: String(fd.get("nombre") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      fecha_preferida: String(fd.get("fecha_preferida") ?? ""),
      hora_aproximada: String(fd.get("hora_aproximada") ?? ""),
      personas: String(fd.get("personas") ?? ""),
      mensaje: String(fd.get("mensaje") ?? ""),
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setRegistration({
        id: String(data.id ?? ""),
        qrDataUrl: String(data.qrDataUrl ?? ""),
        verifyUrl: String(data.verifyUrl ?? ""),
        emailSent: Boolean(data.emailSent),
        fecha: payload.fecha_preferida,
        hora: payload.hora_aproximada,
        personas: payload.personas,
        nombre: payload.nombre,
      });
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo enviar. Compruebe los datos o intente más tarde.");
    }
  }

  if (status === "success" && registration) {
    return (
      <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-4 py-5 text-sm text-[var(--color-text)] sm:px-5">
        <p className="text-lg font-medium" style={{ fontFamily: "var(--font-serif)" }}>
          Visita registrada
        </p>
        <p>Paz y bien, {registration.nombre}. Su ingreso quedó confirmado. Presente este código QR al llegar.</p>
        <dl className="grid gap-1 text-sm">
          <div>
            <dt className="text-[var(--color-text-muted)]">Fecha</dt>
            <dd>{registration.fecha}</dd>
          </div>
          {registration.hora ? (
            <div>
              <dt className="text-[var(--color-text-muted)]">Hora aproximada</dt>
              <dd>{registration.hora}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-[var(--color-text-muted)]">Personas</dt>
            <dd>{registration.personas}</dd>
          </div>
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
            className="h-44 w-44 rounded-sm border border-[var(--color-border)] bg-white p-1"
          />
        ) : null}
        <p className="text-xs text-[var(--color-text-muted)] break-all">{registration.verifyUrl}</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {registration.emailSent
            ? "También le enviamos este código QR a su correo electrónico."
            : "Guarde este código QR y preséntelo al llegar."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="vnombre" className={labelClass}>
          Nombre completo <span className="text-red-800">*</span>
        </label>
        <input id="vnombre" name="nombre" required className={inputClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="vemail" className={labelClass}>
          Correo electrónico <span className="text-red-800">*</span>
        </label>
        <input id="vemail" name="email" type="email" required className={inputClass} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="vtelefono" className={labelClass}>
          Teléfono <span className="text-red-800">*</span>
        </label>
        <input id="vtelefono" name="telefono" type="tel" required className={inputClass} autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="fecha_preferida" className={labelClass}>
          Fecha preferida <span className="text-red-800">*</span>
        </label>
        <input
          id="fecha_preferida"
          name="fecha_preferida"
          type="date"
          required
          min={minDate}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="hora_aproximada" className={labelClass}>
          Hora aproximada
        </label>
        <input id="hora_aproximada" name="hora_aproximada" type="time" className={inputClass} />
      </div>
      <div>
        <label htmlFor="vpersonas" className={labelClass}>
          Número de personas <span className="text-red-800">*</span>
        </label>
        <input id="vpersonas" name="personas" required className={inputClass} inputMode="numeric" />
      </div>
      <div>
        <label htmlFor="vmensaje" className={labelClass}>
          Motivo u observaciones
        </label>
        <textarea id="vmensaje" name="mensaje" rows={4} className={`${inputClass} min-h-[8rem]`} />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-800" role="alert">
          {message}
        </p>
      )}
      <div>
        <button type="submit" disabled={status === "loading"} className={buttonClass}>
          {status === "loading" ? "Enviando…" : "Registrar visita"}
        </button>
      </div>
    </form>
  );
}
