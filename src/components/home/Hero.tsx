import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

const virtues = ["Humildad", "Sencillez", "Obediencia"];

export function Hero() {
  return (
    <header className="ui-fade-in text-center">
      <p className="pill mx-auto shadow-sm">Iglesia Católica Romana y Apostólica</p>

      <h1 className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:mt-7">
        <span
          className="text-[clamp(1.85rem,5.2vw+0.6rem,3.15rem)] font-medium leading-[1.12] tracking-[0.02em] text-[var(--color-text)] md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ermita del Silencio
        </span>
        <span
          className="inline-block h-[2px] w-10 shrink-0 rounded-full bg-gradient-to-r from-[var(--color-accent-gold)] via-[var(--color-accent-gold)]/75 to-transparent sm:w-16 md:w-20"
          aria-hidden
        />
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-[1.7] text-[var(--color-text-muted)] sm:mt-8 sm:text-lg sm:leading-9">
        Un lugar humilde para el encuentro con Dios, al servicio de la vida interior, en la tradición franciscana de los
        Terciarios Regulares.
      </p>

      <ul
        className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:mt-8 sm:gap-x-3"
        aria-label="Virtudes franciscanas"
      >
        {virtues.map((virtue, i) => (
          <li key={virtue} className="flex items-center gap-x-2 sm:gap-x-3">
            {i > 0 ? (
              <span className="text-[var(--color-accent-gold)]" aria-hidden>
                ·
              </span>
            ) : null}
            <span className="pill px-3.5 py-1 text-[0.68rem] tracking-[0.16em] sm:px-4 sm:text-[0.72rem] sm:tracking-[0.18em]">
              {virtue}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative mx-auto mt-10 aspect-[4/5] max-h-[36rem] w-full overflow-hidden rounded-2xl shadow-[0_24px_64px_-28px_color-mix(in_srgb,var(--color-accent-dark)_40%,transparent)] sm:mt-12 sm:aspect-[16/10] sm:rounded-3xl">
        <CoverPhoto
          src={homePhotos.hero.src}
          alt={homePhotos.hero.alt}
          sizes="(min-width: 1152px) 1152px, 100vw"
          priority
        />
      </div>
    </header>
  );
}
