import type { Metadata } from "next";
import { FormRetiros } from "@/components/FormRetiros";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { ProximosRetiros } from "@/components/ProximosRetiros";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";

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
      <section className="band-bg section-pad">
        <div className="shell">
          <p className="copy-wide">
            Los retiros se anuncian con tiempo y se viven en un clima de recogimiento y escucha de la Palabra. Si desea recibir información
            sobre próximas convocatorias o materiales de espiritualidad, puede dejarnos sus datos. Trataremos su información con respeto y
            solo para este fin.
          </p>
          <div className="mt-10">
            <PageGallery photos={pageGalleries.retiros} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad">
        <div className="shell">
          <ProximosRetiros />
        </div>
      </section>

      <section id="formulario-retiro" className="band-sage section-pad scroll-mt-28">
        <div className="shell">
          <p className="eyebrow">Inscripción</p>
          <h2 className="heading-2 mt-4">Solicitar información</h2>
          <div className="mt-10">
            <FormRetiros key={retiro} initialRetiro={retiro} />
          </div>
        </div>
      </section>
    </>
  );
}
