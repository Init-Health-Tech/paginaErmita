import type { Metadata } from "next";
import { FormAlquiler } from "@/components/FormAlquiler";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Alquiler para retiros",
  description:
    "Solicitud de alquiler de la Ermita del Silencio para retiros espirituales de grupos católicos.",
};

export default function AlquilerPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionTitle>Alquiler para retiros espirituales</SectionTitle>
      <p className="mt-8 max-w-3xl text-[var(--color-ermita-ink)]/75 leading-8">
        La casa puede acoger retiros de grupos parroquiales, movimientos eclesiales y comunidades que busquen un tiempo de oración en
        silencio. La solicitud no supone reserva: nos pondremos en contacto para concretar fechas, capacidad y condiciones pastorales.
      </p>
      <div className="surface mt-12 rounded-2xl p-7 sm:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Formulario de solicitud</h2>
        <div className="mt-7">
          <FormAlquiler />
        </div>
      </div>
    </div>
  );
}
