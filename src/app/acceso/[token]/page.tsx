import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { todayISO } from "@/lib/dates";
import { isValidGuardToken } from "@/lib/guardAccess";
import { listVisitsForDate } from "@/lib/submissions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Acceso de visitantes",
  robots: { index: false, follow: false },
};

function statusLabel(status: string | undefined) {
  if (status === "pendiente") return "Pendiente";
  return "Confirmado";
}

export default async function AccesoGuardiasPage({ params }: Props) {
  const { token } = await params;
  if (!isValidGuardToken(token)) {
    notFound();
  }

  const today = todayISO();
  const visits = await listVisitsForDate(today);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <section className="surface rounded-2xl p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Ermita del Silencio</p>
        <h1
          className="mt-3 text-3xl font-medium text-[var(--color-text)] sm:text-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Visitantes autorizados
        </h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">Lista del día {today}. Sin datos de contacto.</p>
      </section>

      <section className="surface mt-6 overflow-hidden rounded-2xl p-0 sm:mt-8">
        {visits.length === 0 ? (
          <p className="px-5 py-8 text-sm text-[var(--color-text-muted)]">No hay visitas registradas para hoy.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium">Hora aproximada</th>
                  <th className="px-4 py-3 font-medium">N° de personas</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id} className="border-b border-[var(--color-border)]/70">
                    <td className="px-4 py-3">{String(visit.payload.nombre ?? "—")}</td>
                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{String(visit.payload.hora_aproximada || "—")}</td>
                    <td className="px-4 py-3">{String(visit.payload.personas ?? "—")}</td>
                    <td className="px-4 py-3">{statusLabel(visit.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
