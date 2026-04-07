import type { Metadata } from "next";
import { FormVisitas } from "@/components/FormVisitas";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Visitas",
  description: "Registro para visitar la Ermita del Silencio.",
};

export default function VisitasPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionTitle>Visitas</SectionTitle>
      <p className="mt-8 max-w-3xl text-[var(--color-ermita-ink)]/75 leading-8">
        La Ermita es ante todo un lugar de oración. Las visitas se coordinan para no interferir con los retiros ni con la vida comunitaria.
        Indique sus datos y una franja aproximada; le responderemos según disponibilidad.
      </p>
      <div className="surface mt-12 rounded-2xl p-7 sm:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Registro de visita</h2>
        <div className="mt-7">
          <FormVisitas />
        </div>
      </div>
    </div>
  );
}
