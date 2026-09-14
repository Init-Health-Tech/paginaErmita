import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function FeaturedBanner() {
  return (
    <section
      className="relative mt-12 min-h-[280px] overflow-hidden rounded-2xl p-5 shadow-[0_24px_64px_-28px_color-mix(in_srgb,var(--color-accent-dark)_45%,transparent)] sm:mt-16 sm:min-h-[340px] sm:rounded-3xl sm:p-8 md:mt-20 md:min-h-[420px] md:p-12"
      aria-label="Espiritualidad franciscana TOR"
    >
      <CoverPhoto
        src={homePhotos.banner.src}
        alt={homePhotos.banner.alt}
        sizes="(min-width: 1152px) 1152px, 100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,color-mix(in_srgb,var(--color-accent-dark)_78%,transparent)_0%,color-mix(in_srgb,var(--color-accent-dark)_42%,transparent)_55%,color-mix(in_srgb,var(--color-accent-dark)_28%,transparent)_100%)]" />

      <div className="relative z-10 max-w-2xl">
        <p className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-white/95 backdrop-blur-sm sm:px-3.5 sm:text-xs sm:tracking-[0.2em]">
          Espiritualidad franciscana TOR
        </p>
        <h2
          className="mt-3 text-pretty text-2xl font-medium leading-[1.15] text-white sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Una casa de retiro viva, acogedora y en silencio
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/85 sm:mt-5 sm:leading-8">
          El diseño integra contemplación y funcionalidad para mostrar mejor la vida de la Ermita: oración, comunidad y
          espacios al servicio de los retiros.
        </p>
      </div>
    </section>
  );
}
