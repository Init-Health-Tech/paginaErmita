"use client";

import { FormEvent, useState } from "react";

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
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="admin-password" className="block text-sm font-medium">
          Clave de administrador
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-sm border border-[var(--color-ermita-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-ermita-brown)] focus:outline-none"
        />
      </div>
      {error ? <p className="text-sm text-red-800">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm border border-[var(--color-ermita-brown)] bg-[var(--color-ermita-brown)] px-5 py-2 text-sm text-white disabled:opacity-60"
      >
        {loading ? "Ingresando..." : "Entrar al panel"}
      </button>
    </form>
  );
}
