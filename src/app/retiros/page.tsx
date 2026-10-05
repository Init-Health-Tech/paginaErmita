import type { Metadata } from "next";
import Link from "next/link";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { ProximosRetiros } from "@/components/ProximosRetiros";
import { Reveal } from "@/components/Reveal";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Retiros",
  description: "Información y convocatorias de retiros espirituales en la Ermita del Silencio.",
};

const moments = [
  { title: "Recogimiento", text: "Un clima de silencio que favorece la escucha interior." },
  { title: "Palabra", text: "Oración, liturgia y tiempos de meditación a lo largo del día." },
  { title: "Comunidad", text: "Convocatorias abiertas a quienes buscan retirarse con otros." },
];

export default function RetirosPage() {
  return (
    <>
      <PageHero
        eyebrow="Retiros"
        title="Retiros a lo largo del año"
        lead="Convocatorias de silencio, oración y escucha de la Palabra, en la casa de la Ermita."
        src={pageHeroes.retiros.src}
        alt={pageHeroes.retiros.alt}
        cta={{ href: "/retiros/inscripcion", label: "Inscribirme a un retiro", newTab: true }}
      />

      <section className="band-bg section-pad">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">Espiritualidad</p>
              <h2 className="heading-2 mt-4 max-w-[18ch]">Vividos en recogimiento</h2>
              <p className="copy-wide mt-6 text-[var(--color-muted)]">
                Los retiros se anuncian con tiempo y se viven en un clima de recogimiento y escucha de la Palabra. Si desea recibir
                información sobre próximas convocatorias o materiales de espiritualidad, puede dejarnos sus datos. Trataremos su
                información con respeto y solo para este fin.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ul className="grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
                {moments.map((item, index) => (
                  <li key={item.title} className="border-t border-[var(--color-line)] pt-5">
                    <p className="eyebrow text-[var(--color-accent)]">{String(index + 1).padStart(2, "0")}</p>
                    <h3 className="heading-3 mt-3">{item.title}</h3>
                    <p className="mt-2 text-[var(--color-muted)]">{item.text}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="mt-14 md:mt-16">
            <PageGallery photos={pageGalleries.retiros} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad">
        <div className="shell">
          <ProximosRetiros />
        </div>
      </section>

      <section className="band-sage section-pad">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Inscripción</p>
            <h2 className="heading-2 mt-4 max-w-[16ch]">Inscribirme a un retiro</h2>
            <p className="mt-5 max-w-[40ch] text-[var(--color-muted)]">
              Indique el retiro de su interés o deje sus datos para enterarse de próximas fechas.
            </p>
            <Link href="/retiros/inscripcion" target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
              Inscribirme a un retiro
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
