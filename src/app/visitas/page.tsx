import type { Metadata } from "next";
import { FormVisitas } from "@/components/FormVisitas";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Visitas",
  description: "Registro para visitar la Ermita del Silencio.",
};

export default function VisitasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <SectionTitle>Visitas</SectionTitle>
      <p className="mt-6 max-w-3xl text-pretty text-[var(--color-ermita-ink)]/75 leading-relaxed sm:mt-8 sm:leading-8">
        La Ermita es ante todo un lugar de oración. Las visitas se coordinan para no interferir con los retiros ni con la vida comunitaria.
        Indique sus datos y una franja aproximada; le responderemos según disponibilidad.
      </p>
      <div className="surface mt-10 rounded-xl p-5 sm:mt-12 sm:rounded-2xl sm:p-8 md:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Registro de visita</h2>
        <div className="mt-7">
          <FormVisitas />
        </div>
      </div>
    </div>
  );
}
