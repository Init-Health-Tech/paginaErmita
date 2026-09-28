import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { DailyStats } from "@/components/admin/DailyStats";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { toAdminTableRow } from "@/lib/adminRows";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getGuardAccessPath } from "@/lib/guardAccess";
import { getDailyVisitStats, listSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel administrador",
};

export default async function AdminPage() {
  const authorized = await isAdminAuthenticated();

  if (!authorized) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
        <section className="surface rounded-sm p-5 sm:p-8">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
            Panel de administracion
          </h1>
          <p className="mt-3 text-sm text-[var(--color-ermita-muted)]">
            Acceso restringido. Ingrese su clave para consultar registros y estadisticas.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    );
  }

  const submissions = await listSubmissions();
  const rows = submissions.map(toAdminTableRow);
  const stats = await getDailyVisitStats(14);
  const visitsToday = stats.at(-1)?.visits ?? 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const guardPath = getGuardAccessPath();
  const guardUrl = siteUrl ? `${siteUrl}${guardPath}` : guardPath;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <header className="surface rounded-sm p-4 sm:p-6">
        <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Panel administrador
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ermita-muted)]">
          Registros totales: <strong>{rows.length}</strong> - Visitas registradas hoy: <strong>{visitsToday}</strong>
        </p>
        <p className="mt-3 break-all text-xs text-[var(--color-ermita-muted)]">
          Lista de acceso para guardias (no compartir en público):{" "}
          <a href={guardPath} className="underline underline-offset-4">
            {guardUrl}
          </a>
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <a
            href="/api/admin/submissions?format=csv"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-ermita-brown)] bg-[var(--color-ermita-brown)] px-4 py-2 text-center text-sm text-white sm:min-h-0"
          >
            Descargar registros (CSV)
          </a>
          <a
            href="/api/admin/logout"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)] px-4 py-2 text-center text-sm sm:min-h-0"
          >
            Cerrar sesion
          </a>
        </div>
      </header>

      <DailyStats stats={stats} />
      <SubmissionsTable rows={rows} mode="all" />
    </div>
  );
}
