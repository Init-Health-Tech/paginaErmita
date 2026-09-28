import type { Metadata } from "next";
import { DailyStats } from "@/components/admin/DailyStats";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { adminPrimaryButtonClass } from "@/components/admin/styles";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { getDailyVisitStats, listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Visitas — administración",
};

export default async function AdminVisitasPage() {
  const [content, submissions, stats] = await Promise.all([
    getSiteContent(),
    listSubmissions(),
    getDailyVisitStats(14),
  ]);
  const rows = submissions.filter((row) => row.type === "visitas").map(toAdminTableRow);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <header className="surface rounded-sm p-4 sm:p-6">
        <h1 className="text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Visitas
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ermita-muted)]">
          Preguntas del formulario y visitas registradas.
        </p>
      </header>

      <FormFieldsEditor form="visitas" initialFields={content.forms.visitas} />
      <DailyStats stats={stats} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ermita-ink)]">Registro de visitas</h2>
          <p className="mt-1 text-sm text-[var(--color-ermita-muted)]">{rows.length} visitas</p>
        </div>
        <a href="/api/admin/submissions?format=csv&type=visitas" className={adminPrimaryButtonClass}>
          Descargar CSV
        </a>
      </div>
      <SubmissionsTable rows={rows} mode="visitas" className="mt-4" />
    </div>
  );
}
