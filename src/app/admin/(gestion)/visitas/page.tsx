import type { Metadata } from "next";
import { ActivityChart } from "@/components/admin/ActivityChart";
import { FormFieldsEditor } from "@/components/admin/FormFieldsEditor";
import { SectionTabs } from "@/components/admin/SectionTabs";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { adminSectionClass } from "@/components/admin/styles";
import { toAdminTableRow } from "@/lib/adminRows";
import { getSiteContent } from "@/lib/siteContent";
import { getDailyVisitStats, listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Visitas — administración",
};

export default async function AdminVisitasPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const [content, submissions, stats] = await Promise.all([
    getSiteContent(),
    listSubmissions(),
    getDailyVisitStats(14),
  ]);
  const rows = submissions.filter((row) => row.type === "visitas").map(toAdminTableRow);

  return (
    <SectionTabs
      title="Visitas"
      description="Preguntas del formulario y visitas registradas."
      activeTab={typeof tab === "string" ? tab : undefined}
      tabs={[
        {
          id: "registros",
          label: "Registros",
          content: (
            <>
              <ActivityChart stats={stats} className="" />
              <SubmissionsTable
                className={adminSectionClass}
                title="Registro de visitas"
                rows={rows}
                mode="visitas"
                csvHref="/api/admin/submissions?format=csv&type=visitas"
              />
            </>
          ),
        },
        {
          id: "formulario",
          label: "Formulario",
          content: <FormFieldsEditor form="visitas" initialFields={content.forms.visitas} />,
        },
      ]}
    />
  );
}
