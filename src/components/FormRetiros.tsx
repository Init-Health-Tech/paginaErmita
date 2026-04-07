"use client";

import { useState } from "react";
import { buttonClass, inputClass, labelClass } from "./formStyles";

export function FormRetiros() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [code, setCode] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      type: "retiros" as const,
      nombre: String(fd.get("nombre") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      ciudad: String(fd.get("ciudad") ?? ""),
      como_conocio: String(fd.get("como_conocio") ?? ""),
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
        <p>Gracias. Recibira informacion sobre los retiros cuando este disponible. Paz y bien.</p>
        {code ? <p className="mt-2 font-mono text-xs text-[var(--color-ermita-muted)]">Codigo de registro: {code}</p> : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rnombre" className={labelClass}>
          Nombre completo <span className="text-red-800">*</span>
        </label>
        <input id="rnombre" name="nombre" required className={inputClass} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="remail" className={labelClass}>
          Correo electrónico <span className="text-red-800">*</span>
        </label>
        <input id="remail" name="email" type="email" required className={inputClass} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="rtelefono" className={labelClass}>
          Teléfono
        </label>
        <input id="rtelefono" name="telefono" type="tel" className={inputClass} autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="ciudad" className={labelClass}>
          Ciudad o localidad
        </label>
        <input id="ciudad" name="ciudad" className={inputClass} />
      </div>
      <div>
        <label htmlFor="como_conocio" className={labelClass}>
          ¿Cómo conoció la Ermita?
        </label>
        <input id="como_conocio" name="como_conocio" className={inputClass} />
      </div>
      <div>
        <label htmlFor="rmensaje" className={labelClass}>
          Comentario o petición
        </label>
        <textarea id="rmensaje" name="mensaje" rows={4} className={inputClass} />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-800" role="alert">
          {message}
        </p>
      )}
      <div>
        <button type="submit" disabled={status === "loading"} className={buttonClass}>
          {status === "loading" ? "Enviando…" : "Solicitar información"}
        </button>
      </div>
    </form>
  );
}
