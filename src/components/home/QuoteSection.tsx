import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function QuoteSection() {
  return (
    <section className="mt-16 grid items-stretch gap-5 sm:mt-24 md:grid-cols-2 md:gap-8">
      <figure className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[var(--color-border)] sm:min-h-[340px] md:h-auto md:min-h-full">
        <CoverPhoto
          src={homePhotos.quote.src}
          alt={homePhotos.quote.alt}
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </figure>
      <blockquote className="flex flex-col justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_12px_36px_-18px_color-mix(in_srgb,var(--color-text)_12%,transparent)] sm:p-8">
        <div
          className="mb-4 h-px w-12 rounded-full bg-gradient-to-r from-[var(--color-accent-gold)] via-[var(--color-accent-gold)]/80 to-transparent sm:mb-5"
          aria-hidden
        />
        <p
          className="text-sm italic leading-[1.75] text-[var(--color-text)] sm:text-base sm:leading-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          «El Señor me dio la gracia de comenzar en la conversión; que Él me dé la gracia de perseverar hasta el fin.»
        </p>
        <footer className="mt-4 text-[0.65rem] not-italic tracking-[0.12em] text-[var(--color-text-muted)] sm:mt-5 sm:text-xs sm:tracking-[0.14em]">
          — San Francisco de Asís
        </footer>
      </blockquote>
    </section>
  );
}
