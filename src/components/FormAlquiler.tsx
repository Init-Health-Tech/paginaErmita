"use client";

import { useState } from "react";
import { buttonClass, inputClass, labelClass } from "./formStyles";

export function FormAlquiler() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "alquiler" as const,
      nombre: String(fd.get("nombre") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      institucion: String(fd.get("institucion") ?? ""),
      fechas: String(fd.get("fechas") ?? ""),
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
      setCode(String(data.id ?? ""));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar. Compruebe los datos o intente más tarde.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-[var(--color-ermita-accent-soft)] bg-[var(--color-ermita-accent-soft)] px-4 py-3 text-sm text-[var(--color-ermita-ink)]">
        <p>Hemos recibido su solicitud. Nos pondremos en contacto a la mayor brevedad. Paz y bien.</p>
        {code ? <p className="mt-2 font-mono text-xs text-[var(--color-ermita-muted)]">Codigo de registro: {code}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className={labelClass}>
          Nombre completo <span className="text-red-800">*</span>
        </label>
        <input id="nombre" name="nombre" required className={inputClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          Correo electrónico <span className="text-red-800">*</span>
        </label>
        <input id="email" name="email" type="email" required className={inputClass} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="telefono" className={labelClass}>
          Teléfono <span className="text-red-800">*</span>
        </label>
        <input id="telefono" name="telefono" type="tel" required className={inputClass} autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="institucion" className={labelClass}>
          Parroquia, movimiento o institución
        </label>
        <input id="institucion" name="institucion" className={inputClass} />
      </div>
      <div>
        <label htmlFor="fechas" className={labelClass}>
          Fechas aproximadas o flexibilidad <span className="text-red-800">*</span>
        </label>
        <input id="fechas" name="fechas" required className={inputClass} placeholder="Ej.: segunda quincena de mayo" />
      </div>
      <div>
        <label htmlFor="personas" className={labelClass}>
          Número aproximado de participantes <span className="text-red-800">*</span>
        </label>
        <input id="personas" name="personas" required className={inputClass} inputMode="numeric" />
      </div>
      <div>
        <label htmlFor="mensaje" className={labelClass}>
          Mensaje u observaciones
        </label>
        <textarea id="mensaje" name="mensaje" rows={4} className={inputClass} />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-800" role="alert">
          {message}
        </p>
      )}
      <div>
        <button type="submit" disabled={status === "loading"} className={buttonClass}>
          {status === "loading" ? "Enviando…" : "Enviar solicitud"}
        </button>
      </div>
    </form>
  );
}
