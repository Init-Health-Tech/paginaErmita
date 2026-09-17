import { CoverPhoto } from "@/components/CoverPhoto";
import { surroundingsPhotos } from "@/lib/homePhotos";

export function Surroundings() {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24" aria-labelledby="entorno-titulo">
      <p className="pill mx-auto">Entorno natural</p>
      <h2
        id="entorno-titulo"
        className="mt-4 text-center text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Faldas del Iztaccíhuatl
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-[var(--color-text-muted)] sm:leading-8">
        La casa se abre al bosque y al volcán: un paisaje de silencio, altura y oración.
      </p>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
        {surroundingsPhotos.map((photo) => (
          <li key={photo.src}>
            <figure className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-[0_16px_40px_-24px_color-mix(in_srgb,var(--color-text)_18%,transparent)] sm:aspect-[4/5]">
              <CoverPhoto src={photo.src} alt={photo.alt} sizes="(min-width: 768px) 33vw, 100vw" />
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
