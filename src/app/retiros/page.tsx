import type { Metadata } from "next";
import { FormRetiros } from "@/components/FormRetiros";
import { PageHero } from "@/components/PageHero";
import { ProximosRetiros } from "@/components/ProximosRetiros";
import { pageHeroes } from "@/lib/homePhotos";

export const dynamic = "force-dynamic";

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
    <>
      <PageHero eyebrow="Retiros" title="Retiros" src={pageHeroes.retiros.src} alt={pageHeroes.retiros.alt} />
      <div className="shell section-pad">
        <p className="intro-copy">
          Los retiros se anuncian con tiempo y se viven en un clima de recogimiento y escucha de la Palabra. Si desea recibir información
          sobre próximas convocatorias o materiales de espiritualidad, puede dejarnos sus datos. Trataremos su información con respeto y
          solo para este fin.
        </p>

        <ProximosRetiros />

        <section id="formulario-retiro" className="mt-16 scroll-mt-28 border-t border-[var(--color-line)] pt-10 md:mt-24">
          <p className="eyebrow">Inscripción</p>
          <h2 className="heading-2 mt-4">Solicitar información</h2>
          <div className="mt-10">
            <FormRetiros key={retiro} initialRetiro={retiro} />
          </div>
        </section>
      </div>
    </>
  );
}
