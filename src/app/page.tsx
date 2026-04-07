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
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <header className="ui-fade-in text-center">
        <p className="mx-auto inline-flex max-w-md items-center justify-center rounded-full border border-[var(--color-ermita-line)]/80 bg-[color-mix(in_srgb,var(--color-ermita-paper)_75%,transparent)] px-3 py-1.5 text-pretty text-[0.62rem] uppercase leading-relaxed tracking-[0.18em] text-[var(--color-ermita-muted)] shadow-sm backdrop-blur-sm sm:px-4 sm:text-[0.65rem] sm:tracking-[0.22em] md:tracking-[0.25em]">
          Iglesia Católica Romana y Apostólica
        </p>
        <SectionTitle as="h1" className="mt-5 sm:mt-6">
          Ermita del Silencio
        </SectionTitle>
        <p
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.65] text-[var(--color-ermita-ink)]/80 sm:mt-8 sm:text-lg sm:leading-9"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Un lugar humilde para el encuentro con Dios, al servicio de la vida interior, en la tradición franciscana de los Terciarios
          Regulares.
        </p>
        <p
          className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs tracking-[0.12em] text-[var(--color-ermita-muted)] sm:mt-6 sm:gap-x-3 sm:text-sm sm:tracking-[0.17em]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span className="rounded-md bg-[var(--color-ermita-soft)]/65 px-2 py-0.5 text-[0.7rem] text-[var(--color-ermita-ink)]/75 sm:text-xs">
            Humildad
          </span>
          <span className="text-[var(--color-ermita-line)]" aria-hidden>
            ·
          </span>
          <span className="rounded-md bg-[var(--color-ermita-soft)]/65 px-2 py-0.5 text-[0.7rem] text-[var(--color-ermita-ink)]/75 sm:text-xs">
            Sencillez
          </span>
          <span className="text-[var(--color-ermita-line)]" aria-hidden>
            ·
          </span>
          <span className="rounded-md bg-[var(--color-ermita-soft)]/65 px-2 py-0.5 text-[0.7rem] text-[var(--color-ermita-ink)]/75 sm:text-xs">
            Obediencia
          </span>
        </p>
      </header>

      <ul className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:mt-20 md:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="surface group relative block h-full overflow-hidden rounded-2xl border-[var(--color-ermita-line)]/70 bg-[color-mix(in_srgb,var(--color-ermita-paper)_82%,transparent)] p-5 shadow-[0_2px_12px_-4px_rgba(43,43,43,0.08)] backdrop-blur-[2px] transition duration-500 ease-out active:scale-[0.99] sm:p-6 md:p-7 md:hover:-translate-y-1 md:hover:border-[var(--color-ermita-muted)]/50 md:hover:bg-[color-mix(in_srgb,var(--color-ermita-paper)_95%,white)] md:hover:shadow-[0_20px_40px_-16px_rgba(43,43,43,0.14)]"
            >
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-ermita-gold)]/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
                aria-hidden
              />
              <h2
                className="font-[family-name:var(--font-serif)] text-xl text-[var(--color-ermita-ink)] sm:text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {card.title}
                <span className="ml-2 inline-block text-[var(--color-ermita-muted)] transition duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-ermita-gold)]">
                  →
                </span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ermita-ink)]/70 sm:mt-4 sm:leading-7">{card.text}</p>
            </Link>
          </li>
        ))}
      </ul>

      <HomeShowcase images={images} />

      <blockquote className="mx-auto mt-16 max-w-3xl rounded-2xl border border-[var(--color-ermita-line)]/80 bg-[color-mix(in_srgb,var(--color-ermita-paper)_88%,var(--color-ermita-soft))] p-5 text-[var(--color-ermita-muted)] shadow-[0_12px_36px_-18px_rgba(43,43,43,0.12)] sm:mt-24 sm:p-8">
        <div className="mb-4 h-px w-12 rounded-full bg-gradient-to-r from-[var(--color-ermita-gold)]/30 via-[var(--color-ermita-gold)]/70 to-transparent sm:mb-5" aria-hidden />
        <p className="text-sm italic leading-[1.75] text-[var(--color-ermita-ink)]/80 sm:text-base sm:leading-8" style={{ fontFamily: "var(--font-serif)" }}>
          «El Señor me dio la gracia de comenzar en la conversión; que Él me dé la gracia de perseverar hasta el fin.»
        </p>
        <footer className="mt-4 text-[0.65rem] not-italic tracking-[0.12em] text-[var(--color-ermita-muted)] sm:mt-5 sm:text-xs sm:tracking-[0.14em]">
          — San Francisco de Asís
        </footer>
      </blockquote>
    </div>
  );
}
