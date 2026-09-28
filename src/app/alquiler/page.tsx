import type { Metadata } from "next";
import { Amenidades } from "@/components/Amenidades";
import { FormAlquiler } from "@/components/FormAlquiler";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { formatMxn } from "@/lib/contentModel";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";
import { getRentalCosts } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Alquiler para retiros",
  description:
    "Solicitud de alquiler de la Ermita del Silencio para retiros espirituales de grupos católicos.",
};

const highlights = [
  { title: "Grupos eclesiales", text: "Parroquias, movimientos y comunidades en busca de silencio." },
  { title: "Casa completa", text: "Capilla, comedor y cuartos para un tiempo de oración compartida." },
  { title: "Sin reserva automática", text: "Recibimos la solicitud y concretamos fechas y condiciones." },
];

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
        lead="Un espacio para que su grupo se retire a orar, en un clima de recogimiento franciscano."
        src={pageHeroes.alquiler.src}
        alt={pageHeroes.alquiler.alt}
        cta={{ href: "#formulario-alquiler", label: "Solicitar alquiler" }}
      />

      <section className="band-bg section-pad">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">La casa</p>
              <h2 className="heading-2 mt-4 max-w-[16ch]">Para grupos que buscan silencio</h2>
              <p className="copy-wide mt-6 text-[var(--color-muted)]">
                La casa puede acoger retiros de grupos parroquiales, movimientos eclesiales y comunidades que busquen un tiempo de
                oración en silencio. La solicitud no supone reserva: nos pondremos en contacto para concretar fechas, capacidad y
                condiciones pastorales.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ol className="border-t border-[var(--color-line)]">
                {highlights.map((item, index) => (
                  <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--color-line)] py-5">
                    <span className="font-serif text-2xl font-light text-[var(--color-accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-[var(--color-muted)]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="mt-14 md:mt-16">
            <PageGallery photos={pageGalleries.alquiler} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad" aria-labelledby="costo-alquiler-title">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Condiciones</p>
            <h2 id="costo-alquiler-title" className="heading-2 mt-4">
              Costo del alquiler
            </h2>
            {costs.summary ? <p className="copy-wide mt-6 max-w-[56ch] text-[var(--color-muted)]">{costs.summary}</p> : null}
            {price ? (
              <p className="mt-8 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-tight">
                Tarifa vigente: {price}
              </p>
            ) : null}
          </Reveal>
          {costs.packages.length > 0 ? (
            <ul className="mt-10 border-b border-[var(--color-line)]">
              {costs.packages.map((item, index) => (
                <li key={item.id} className="border-t border-[var(--color-line)] py-7">
                  <Reveal delay={index * 70}>
                    <div className="grid gap-3 md:grid-cols-[12rem_1fr] md:gap-10">
                      <p className="font-medium">{item.name}</p>
                      {item.description ? <p className="text-[var(--color-muted)]">{item.description}</p> : null}
                    </div>
                  </Reveal>
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

      <section id="formulario-alquiler" className="band-bg section-pad scroll-mt-28">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Solicitud</p>
              <h2 className="heading-2 mt-4 max-w-[12ch]">Formulario de solicitud</h2>
              <p className="mt-5 max-w-[36ch] text-[var(--color-muted)]">
                Cuéntenos sobre su grupo y las fechas deseadas. Le responderemos para confirmar disponibilidad.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <FormAlquiler />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
