"use client";

import { FormEvent, useState } from "react";
import { adminInputClass, adminPrimaryButtonClass } from "@/components/admin/styles";

export function AdminLoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-password" className="block text-sm text-[var(--color-text)]">
          Clave de administrador
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          className={adminInputClass}
        />
      </div>
      {error ? <p className="text-sm text-[#8f5348]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className={`${adminPrimaryButtonClass} w-full sm:w-auto`}
      >
        {loading ? "Ingresando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
