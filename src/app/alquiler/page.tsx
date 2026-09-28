import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormAlquiler } from "@/components/FormAlquiler";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { formatMxn } from "@/lib/contentModel";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";
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
      <section className="band-bg section-pad">
        <div className="shell">
          <p className="copy-wide">
            La casa puede acoger retiros de grupos parroquiales, movimientos eclesiales y comunidades que busquen un tiempo de oración en
            silencio. La solicitud no supone reserva: nos pondremos en contacto para concretar fechas, capacidad y condiciones pastorales.
          </p>
          <div className="mt-10">
            <PageGallery photos={pageGalleries.alquiler} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad" aria-labelledby="costo-alquiler-title">
        <div className="shell">
          <p className="eyebrow">Condiciones</p>
          <h2 id="costo-alquiler-title" className="heading-2 mt-4">
            Costo del alquiler
          </h2>
          {costs.summary ? <p className="copy-wide mt-6 text-[var(--color-muted)]">{costs.summary}</p> : null}
          {price ? <p className="mt-6">Tarifa vigente: {price}.</p> : null}
          {costs.packages.length > 0 ? (
            <ul className="mt-8 border-b border-[var(--color-line)]">
              {costs.packages.map((item) => (
                <li key={item.id} className="border-t border-[var(--color-line)] py-6">
                  <p className="font-medium">{item.name}</p>
                  {item.description ? <p className="copy-wide mt-2 text-[var(--color-muted)]">{item.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="band-sage section-pad">
        <div className="shell">
          <Amenidades />
        </div>
      </section>

      <section className="band-bg section-pad">
        <div className="shell">
          <p className="eyebrow">Solicitud</p>
          <h2 className="heading-2 mt-4">Formulario de solicitud</h2>
          <div className="mt-10">
            <FormAlquiler />
          </div>
        </div>
      </section>
    </>
  );
}
