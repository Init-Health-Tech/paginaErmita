import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormVisitas } from "@/components/FormVisitas";
import { PageHero } from "@/components/PageHero";
import { pageHeroes } from "@/lib/homePhotos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visitas",
  description: "Registro para visitar la Ermita del Silencio.",
};

export default function VisitasPage() {
  return (
    <>
      <PageHero eyebrow="Visitas" title="Visitas" src={pageHeroes.visitas.src} alt={pageHeroes.visitas.alt} />
      <div className="shell section-pad">
        <p className="intro-copy">
          La Ermita es ante todo un lugar de oración. Las visitas se coordinan para no interferir con los retiros ni con la vida comunitaria.
          Las visitas deben registrarse con al menos un día de anticipación para control de acceso. Verificaremos la disponibilidad y te
          confirmaremos tu ingreso.
        </p>

        <Amenidades />

        <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24">
          <p className="eyebrow">Acceso</p>
          <h2 className="heading-2 mt-4">Registro de visita</h2>
          <div className="mt-10">
            <FormVisitas />
          </div>
        </section>
      </div>
    </>
  );
}
