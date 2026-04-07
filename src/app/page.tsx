import Link from "next/link";
import { HomeShowcase } from "@/components/HomeShowcase";
import { SectionTitle } from "@/components/SectionTitle";
import { getGalleryImages } from "@/lib/gallery";

const cards = [
  {
    href: "/alquiler",
    title: "Alquiler para retiros",
    text: "Grupos parroquiales, movimientos o comunidades que deseen celebrar un retiro espiritual en un entorno de silencio y oración.",
  },
  {
    href: "/retiros",
    title: "Retiros",
    text: "Información sobre convocatorias, espiritualidad y actividades. Déjenos sus datos para recibir noticias con discreción.",
  },
  {
    href: "/visitas",
    title: "Visitas",
    text: "Quienes deseen conocer la casa o pasar un tiempo breve de recogimiento pueden solicitar una visita coordinada.",
  },
];

export default async function HomePage() {
  const images = await getGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <header className="ui-fade-in text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-ermita-muted)]">Iglesia Católica Romana y Apostólica</p>
        <SectionTitle as="h1" className="mt-5">
          Ermita del Silencio
        </SectionTitle>
        <p
          className="mx-auto mt-8 max-w-2xl text-lg leading-9 text-[var(--color-ermita-ink)]/80"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Un lugar humilde para el encuentro con Dios, al servicio de la vida interior, en la tradición franciscana de los Terciarios
          Regulares.
        </p>
        <p className="mt-5 text-sm tracking-[0.17em] text-[var(--color-ermita-muted)]" style={{ fontFamily: "var(--font-serif)" }}>
          Humildad · Sencillez · Obediencia
        </p>
      </header>

      <ul className="mt-20 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="surface group block h-full rounded-xl p-7 transition duration-300 hover:border-[var(--color-ermita-muted)] hover:bg-white"
            >
              <h2
                className="font-[family-name:var(--font-serif)] text-2xl text-[var(--color-ermita-ink)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {card.title}
                <span className="ml-2 text-[var(--color-ermita-muted)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-ermita-gold)]">→</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-ermita-ink)]/70">{card.text}</p>
            </Link>
          </li>
        ))}
      </ul>

      <HomeShowcase images={images} />

      <blockquote className="mx-auto mt-24 max-w-3xl border-l border-[var(--color-ermita-line)] pl-8 text-[var(--color-ermita-muted)]">
        <p className="text-base italic leading-8" style={{ fontFamily: "var(--font-serif)" }}>
          «El Señor me dio la gracia de comenzar en la conversión; que Él me dé la gracia de perseverar hasta el fin.»
        </p>
        <footer className="mt-4 text-xs not-italic tracking-[0.12em]">— San Francisco de Asís</footer>
      </blockquote>
    </div>
  );
}
