import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { GuardAccess } from "@/components/admin/GuardAccess";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { adminMutedClass, adminPageTitleClass, adminSectionClass, adminSectionTitleClass } from "@/components/admin/styles";
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
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-[2.5rem] font-light leading-tight text-[var(--color-text)]">Ermita del Silencio</h1>
        <p className="mt-3 text-[0.7rem] tracking-[0.14em] text-[var(--color-muted)]">Panel de administración</p>
        <p className="mt-10 text-sm leading-relaxed text-[var(--color-muted)]">
          Acceso restringido. Ingrese su clave para consultar registros y estadísticas.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
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
    <>
      <h1 className={adminPageTitleClass}>Resumen</h1>
      <div className="mt-10 flex items-stretch gap-8 sm:gap-12">
        <div>
          <p className="font-serif text-5xl font-light leading-none tabular-nums text-[var(--color-text)]">{rows.length}</p>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Registros totales</p>
        </div>
        <div className="w-px bg-[var(--color-line)]" aria-hidden />
        <div>
          <p className="font-serif text-5xl font-light leading-none tabular-nums text-[var(--color-text)]">{visitsToday}</p>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Visitas hoy</p>
        </div>
      </div>

      <section className={adminSectionClass}>
        <h2 className={adminSectionTitleClass}>Acceso para guardias</h2>
        <p className={`mt-3 max-w-xl ${adminMutedClass}`}>Comparte este enlace solo con el personal de caseta</p>
        <GuardAccess url={guardUrl} href={guardPath} />
      </section>

      <ActivityChart stats={stats} />
      <SubmissionsTable
        className={adminSectionClass}
        title="Registros recientes"
        rows={rows.slice(0, 10)}
        mode="all"
        csvHref="/api/admin/submissions?format=csv"
      />
    </>
  );
}
