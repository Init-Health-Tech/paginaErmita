"use client";

import Image from "next/image";
import { useState } from "react";
import { buttonClass, inputClass, labelClass } from "./formStyles";

export function FormVisitas() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [registration, setRegistration] = useState<{ id: string; qrDataUrl: string; verifyUrl: string } | null>(null);

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
      });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("No se pudo enviar. Compruebe los datos o intente más tarde.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-4 rounded-sm border border-[var(--color-ermita-accent-soft)] bg-[var(--color-ermita-accent-soft)] px-4 py-4 text-sm text-[var(--color-ermita-ink)]">
        <p>Hemos registrado su solicitud de visita. Le confirmaremos segun disponibilidad. Paz y bien.</p>
        {registration ? (
          <div className="rounded-sm border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)] p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--color-ermita-muted)]">Comprobante de registro</p>
            <p className="mt-1 font-mono text-xs">Codigo: {registration.id}</p>
            {registration.qrDataUrl ? (
              <Image
                src={registration.qrDataUrl}
                alt="QR de registro de visita"
                width={144}
                height={144}
                unoptimized
                className="mt-3 h-36 w-36 rounded-sm border border-[var(--color-ermita-line)] bg-white p-1"
              />
            ) : null}
            <p className="mt-2 text-xs text-[var(--color-ermita-muted)] break-all">{registration.verifyUrl}</p>
          </div>
        ) : null}
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
          Fecha o franja preferida <span className="text-red-800">*</span>
        </label>
        <input id="fecha_preferida" name="fecha_preferida" required className={inputClass} />
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
