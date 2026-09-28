import { CoverPhoto } from "@/components/CoverPhoto";
import { homePhotos } from "@/lib/homePhotos";

export function QuoteSection() {
  return (
    <section className="relative min-h-[70vh]">
      <CoverPhoto src={homePhotos.quote.src} alt={homePhotos.quote.alt} sizes="100vw" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative flex min-h-[70vh] items-center justify-center px-6 py-20 text-center text-[var(--color-on-dark)]">
        <figure className="max-w-[40ch]">
          <blockquote className="quote-lg">
            «El hombre es tan solo lo que es ante los ojos de Dios, y nada más.»
          </blockquote>
          <figcaption className="eyebrow mt-8 text-[var(--color-on-dark)]">— San Francisco de Asís</figcaption>
        </figure>
      </div>
    </section>
  );
}
