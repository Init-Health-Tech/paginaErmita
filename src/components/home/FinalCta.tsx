import Link from "next/link";
import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function FinalCta() {
  return (
    <section className="relative mt-16 overflow-hidden rounded-2xl px-5 py-12 text-center sm:mt-20 sm:rounded-3xl sm:px-8 sm:py-16 md:mt-24 md:py-20">
      <CoverPhoto src={homePhotos.cta.src} alt={homePhotos.cta.alt} sizes="(min-width: 1152px) 1152px, 100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-accent-dark)_62%,transparent)_0%,color-mix(in_srgb,var(--color-accent-dark)_72%,transparent)_100%)]" />

      <div className="relative z-10">
        <h2
          className="text-2xl font-medium text-white sm:text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ¿Buscas silencio y oración?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base sm:leading-8">
          Conoce nuestras opciones de retiro o solicita una visita coordinada a la Ermita.
        </p>
        <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/retiros"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium tracking-[0.04em] text-white transition hover:bg-[var(--color-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Ver Retiros
          </Link>
          <Link
            href="/visitas"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/80 bg-transparent px-6 py-2.5 text-sm font-medium tracking-[0.04em] text-white transition hover:bg-white hover:text-[var(--color-accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Solicitar Visita
          </Link>
        </div>
      </div>
    </section>
  );
}
