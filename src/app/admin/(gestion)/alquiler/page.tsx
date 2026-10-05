import type { Metadata } from "next";
import { AmenitiesEditor } from "@/components/admin/AmenitiesEditor";
import { CostsEditor } from "@/components/admin/CostsEditor";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { SectionTabs } from "@/components/admin/SectionTabs";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Alquiler — administración",
};

export default async function AdminAlquilerPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const [content, submissions] = await Promise.all([getSiteContent(), listSubmissions()]);
  const rows = submissions.filter((row) => row.type === "alquiler").map(toAdminTableRow);

  return (
    <SectionTabs
      title="Alquiler"
      description="Preguntas del formulario, costos, amenidades y solicitudes recibidas."
      activeTab={typeof tab === "string" ? tab : undefined}
      tabs={[
        {
          id: "solicitudes",
          label: "Solicitudes",
          content: (
            <SubmissionsTable
              title="Registro de alquileres"
              rows={rows}
              mode="alquiler"
              csvHref="/api/admin/submissions?format=csv&type=alquiler"
            />
          ),
        },
        {
          id: "formulario",
          label: "Formulario",
          content: <FormFieldsEditor form="alquiler" initialFields={content.forms.alquiler} />,
        },
        {
          id: "costos",
          label: "Costos",
          content: <CostsEditor initialCosts={content.costs} />,
        },
        {
          id: "amenidades",
          label: "Amenidades",
          content: <AmenitiesEditor initialAmenities={content.amenities} />,
        },
      ]}
    />
  );
}
