import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormVisitas } from "@/components/FormVisitas";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visitas",
  description: "Registro para visitar la Ermita del Silencio.",
};

export default function VisitasPage() {
  return (
    <>
      <PageHero eyebrow="Visitas" title="Visitas" src={pageHeroes.visitas.src} alt={pageHeroes.visitas.alt} />
      <section className="band-bg section-pad">
        <div className="shell">
          <p className="copy-wide">
            La Ermita es ante todo un lugar de oración. Las visitas se coordinan para no interferir con los retiros ni con la vida comunitaria.
            Las visitas deben registrarse con al menos un día de anticipación para control de acceso. Verificaremos la disponibilidad y te
            confirmaremos tu ingreso.
          </p>
          <div className="mt-10">
            <PageGallery photos={pageGalleries.visitas} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad">
        <div className="shell">
          <Amenidades />
        </div>
      </section>

      <section className="band-sage section-pad">
        <div className="shell">
          <p className="eyebrow">Acceso</p>
          <h2 className="heading-2 mt-4">Registro de visita</h2>
          <div className="mt-10">
            <FormVisitas />
          </div>
        </div>
      </section>
    </>
  );
}
