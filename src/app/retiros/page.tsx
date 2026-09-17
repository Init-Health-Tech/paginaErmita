import type { Metadata } from "next";
import { FormRetiros } from "@/components/FormRetiros";
import { ProximosRetiros } from "@/components/ProximosRetiros";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Retiros",
  description: "Información y convocatorias de retiros espirituales en la Ermita del Silencio.",
};

type Props = {
  searchParams: Promise<{ retiro?: string }>;
};

export default async function RetirosPage({ searchParams }: Props) {
  const { retiro = "" } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <SectionTitle>Retiros</SectionTitle>
      <p className="mt-6 max-w-3xl text-pretty text-[var(--color-ermita-ink)]/75 leading-relaxed sm:mt-8 sm:leading-8">
        Los retiros se anuncian con tiempo y se viven en un clima de recogimiento y escucha de la Palabra. Si desea recibir información
        sobre próximas convocatorias o materiales de espiritualidad, puede dejarnos sus datos. Trataremos su información con respeto y
        solo para este fin.
      </p>

      <ProximosRetiros />

      <div id="formulario-retiro" className="surface mt-10 scroll-mt-28 rounded-xl p-5 sm:mt-12 sm:rounded-2xl sm:p-8 md:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Solicitar información</h2>
        <div className="mt-7">
          <FormRetiros key={retiro} initialRetiro={retiro} />
        </div>
      </div>
    </div>
  );
}
