import type { Metadata } from "next";
import { AmenitiesEditor } from "@/components/admin/AmenitiesEditor";
import { CostsEditor } from "@/components/admin/CostsEditor";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { adminPrimaryButtonClass } from "@/components/admin/styles";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Alquiler — administración",
};

export default async function AdminAlquilerPage() {
  const [content, submissions] = await Promise.all([getSiteContent(), listSubmissions()]);
  const rows = submissions.filter((row) => row.type === "alquiler").map(toAdminTableRow);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <header className="surface rounded-sm p-4 sm:p-6">
        <h1 className="text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Alquiler
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ermita-muted)]">
          Preguntas del formulario, costos, amenidades y solicitudes recibidas.
        </p>
      </header>

      <FormFieldsEditor form="alquiler" initialFields={content.forms.alquiler} />
      <CostsEditor initialCosts={content.costs} />
      <AmenitiesEditor initialAmenities={content.amenities} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-ermita-ink)]">Registro de alquileres</h2>
          <p className="mt-1 text-sm text-[var(--color-ermita-muted)]">{rows.length} solicitudes</p>
        </div>
        <a href="/api/admin/submissions?format=csv&type=alquiler" className={adminPrimaryButtonClass}>
          Descargar CSV
        </a>
      </div>
      <SubmissionsTable rows={rows} mode="alquiler" className="mt-4" />
    </div>
  );
}
