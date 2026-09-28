import type { Metadata } from "next";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { RetreatRecords } from "@/components/admin/RetreatRecords";
import { RetreatsEditor } from "@/components/admin/RetreatsEditor";
import { adminPrimaryButtonClass } from "@/components/admin/styles";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Retiros — administración",
};

export default async function AdminRetirosPage() {
  const [content, submissions] = await Promise.all([getSiteContent(), listSubmissions()]);
  const rows = submissions.filter((row) => row.type === "retiros").map(toAdminTableRow);
  const retreats = content.retreats.map((retreat) => ({ id: retreat.id, name: retreat.name }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <header className="surface rounded-sm p-4 sm:p-6">
        <h1 className="text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Retiros
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ermita-muted)]">
          Preguntas del formulario, retiros programados e inscripciones recibidas.
        </p>
      </header>

      <FormFieldsEditor form="retiros" initialFields={content.forms.retiros} />
      <RetreatsEditor initialRetreats={content.retreats} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-ermita-ink)]">Registro de retiros pasados</h2>
        <a href="/api/admin/submissions?format=csv&type=retiros" className={adminPrimaryButtonClass}>
          Descargar CSV
        </a>
      </div>
      <RetreatRecords rows={rows} retreats={retreats} />
    </div>
  );
}
