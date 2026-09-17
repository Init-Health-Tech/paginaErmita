import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormAlquiler } from "@/components/FormAlquiler";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Alquiler para retiros",
  description:
    "Solicitud de alquiler de la Ermita del Silencio para retiros espirituales de grupos católicos.",
};

export default function AlquilerPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <SectionTitle>Alquiler para retiros espirituales</SectionTitle>
      <p className="mt-6 max-w-3xl text-pretty text-[var(--color-ermita-ink)]/75 leading-relaxed sm:mt-8 sm:leading-8">
        La casa puede acoger retiros de grupos parroquiales, movimientos eclesiales y comunidades que busquen un tiempo de oración en
        silencio. La solicitud no supone reserva: nos pondremos en contacto para concretar fechas, capacidad y condiciones pastorales.
      </p>

      <section className="surface mt-10 rounded-2xl p-5 sm:mt-12 sm:p-8" aria-labelledby="costo-alquiler-title">
        <h2
          id="costo-alquiler-title"
          className="text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Costo del alquiler
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base sm:leading-8">
          El costo del alquiler se calcula según el número de personas y los días de estancia. Contamos con distintos paquetes de
          alimentación (desayuno, comida y cena) que se detallan al confirmar tu solicitud.
        </p>
      </section>

      <Amenidades />

      <div className="surface mt-10 rounded-xl p-5 sm:mt-12 sm:rounded-2xl sm:p-8 md:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Formulario de solicitud</h2>
        <div className="mt-7">
          <FormAlquiler />
        </div>
      </div>
    </div>
  );
}
