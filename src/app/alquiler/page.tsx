import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormAlquiler } from "@/components/FormAlquiler";
import { PageHero } from "@/components/PageHero";
import { formatMxn } from "@/lib/contentModel";
import { pageHeroes } from "@/lib/homePhotos";
import { getRentalCosts } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alquiler para retiros",
  description:
    "Solicitud de alquiler de la Ermita del Silencio para retiros espirituales de grupos católicos.",
};

export default async function AlquilerPage() {
  const costs = await getRentalCosts();
  const price =
    costs.model === "per_person_per_day" && costs.pricePerPersonPerDay != null
      ? `${formatMxn(costs.pricePerPersonPerDay)} por persona por día`
      : costs.model === "flat_rate" && costs.flatRate != null
        ? formatMxn(costs.flatRate)
        : null;

  return (
    <>
      <PageHero
        eyebrow="Alquiler"
        title="Alquiler para retiros espirituales"
        src={pageHeroes.alquiler.src}
        alt={pageHeroes.alquiler.alt}
      />
      <div className="shell section-pad">
        <p className="intro-copy">
          La casa puede acoger retiros de grupos parroquiales, movimientos eclesiales y comunidades que busquen un tiempo de oración en
          silencio. La solicitud no supone reserva: nos pondremos en contacto para concretar fechas, capacidad y condiciones pastorales.
        </p>

        <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24" aria-labelledby="costo-alquiler-title">
          <p className="eyebrow">Condiciones</p>
          <h2 id="costo-alquiler-title" className="heading-2 mt-4">
            Costo del alquiler
          </h2>
          {costs.summary ? <p className="measure mt-6 text-[var(--color-muted)]">{costs.summary}</p> : null}
          {price ? <p className="mt-6">Tarifa vigente: {price}.</p> : null}
          {costs.packages.length > 0 ? (
            <ul className="mt-8 border-b border-[var(--color-line)]">
              {costs.packages.map((item) => (
                <li key={item.id} className="border-t border-[var(--color-line)] py-6">
                  <p className="font-medium">{item.name}</p>
                  {item.description ? <p className="mt-2 max-w-[62ch] text-[var(--color-muted)]">{item.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <Amenidades />

        <section className="mt-16 border-t border-[var(--color-line)] pt-10 md:mt-24">
          <p className="eyebrow">Solicitud</p>
          <h2 className="heading-2 mt-4">Formulario de solicitud</h2>
          <div className="mt-10">
            <FormAlquiler />
          </div>
        </section>
      </div>
    </>
  );
}
