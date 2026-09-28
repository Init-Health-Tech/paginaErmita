import Link from "next/link";
import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function Hero() {
  return (
    <section className="relative h-svh min-h-[36rem]">
      <CoverPhoto src={homePhotos.hero.src} alt={homePhotos.hero.alt} sizes="100vw" priority />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15),rgba(0,0,0,0.45))]" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="shell pb-20 text-[var(--color-on-dark)] md:pb-24">
          <p className="eyebrow text-[var(--color-on-dark)]">Ermita del Silencio · Orden Franciscana Seglar</p>
          <h1 className="display mt-5 max-w-[12ch]">¿Buscas silencio y oración?</h1>
          <p className="mt-5 max-w-[36ch] text-[1.125rem] leading-relaxed">Una casa franciscana en las faldas del Itza.</p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link href="/retiros" className="btn-primary">
              Próximos retiros
            </Link>
            <Link href="/visitas" className="link-arrow">
              Planea tu visita
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
