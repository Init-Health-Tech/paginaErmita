import { CoverPhoto } from "@/components/CoverPhoto";
import { artisanDetails } from "@/lib/homePhotos";

export function ArtisanDetails() {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24" aria-labelledby="detalles-titulo">
      <h2
        id="detalles-titulo"
        className="text-center text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Detalles de la casa
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--color-text-muted)] sm:leading-8">
        Azulejo, piedra y talla: oficios sencillos al servicio de la oración.
      </p>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
        {artisanDetails.map((item) => (
          <li key={item.src}>
            <figure className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_16px_40px_-24px_color-mix(in_srgb,var(--color-text)_14%,transparent)]">
              <div className="relative aspect-[3/4]">
                <CoverPhoto src={item.src} alt={item.alt} sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <figcaption
                className="px-4 py-3 text-center text-sm italic text-[var(--color-text)] sm:px-5 sm:py-4"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {item.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
