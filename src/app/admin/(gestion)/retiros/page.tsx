import type { Metadata } from "next";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { RetreatRecords } from "@/components/admin/RetreatRecords";
import { RetreatsEditor } from "@/components/admin/RetreatsEditor";
import { SectionTabs } from "@/components/admin/SectionTabs";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Retiros — administración",
};

export default async function AdminRetirosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const [content, submissions] = await Promise.all([getSiteContent(), listSubmissions()]);
  const rows = submissions.filter((row) => row.type === "retiros").map(toAdminTableRow);
  const retreats = content.retreats.map((retreat) => ({ id: retreat.id, name: retreat.name }));

  return (
    <SectionTabs
      title="Retiros"
      description="Preguntas del formulario, retiros programados e inscripciones recibidas."
      activeTab={typeof tab === "string" ? tab : undefined}
      tabs={[
        {
          id: "inscripciones",
          label: "Inscripciones",
          content: <RetreatRecords rows={rows} retreats={retreats} />,
        },
        {
          id: "programados",
          label: "Retiros programados",
          content: <RetreatsEditor initialRetreats={content.retreats} />,
        },
        {
          id: "formulario",
          label: "Formulario",
          content: <FormFieldsEditor form="retiros" initialFields={content.forms.retiros} />,
        },
      ]}
    />
  );
}
