import { CoverPhoto } from "@/components/CoverPhoto";
import { Reveal } from "@/components/Reveal";
import type { Amenity } from "@/lib/contentModel";
import { listAmenities } from "@/lib/siteContent";

function AmenidadRow({ item, reverse }: { item: Amenity; reverse: boolean }) {
  return (
    <li className="border-t border-[var(--color-line)] py-10">
      <div
        className={`grid items-center gap-8 md:gap-12 ${item.src ? "md:grid-cols-2" : ""} ${
          item.src && reverse ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""
        }`}
      >
        {item.src ? (
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
              <CoverPhoto
                src={item.src}
                alt={item.alt ?? item.title}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="gallery-zoom"
              />
            </div>
          </Reveal>
        ) : null}
        <Reveal delay={100}>
          <p className="eyebrow">Espacio</p>
          <h3 className="heading-3 mt-3">{item.title}</h3>
          {item.phrase ? <p className="mt-4 max-w-[42ch] text-[var(--color-muted)]">{item.phrase}</p> : null}
        </Reveal>
      </div>
    </li>
  );
}

export async function Amenidades() {
  const amenities = await listAmenities();

  return (
    <section aria-labelledby="amenidades-title">
      <Reveal>
        <p className="eyebrow">La casa</p>
        <h2 id="amenidades-title" className="heading-2 mt-4">
          Amenidades
        </h2>
        <p className="copy-wide mt-5 max-w-[52ch] text-[var(--color-muted)]">
          Capilla, comedor y cuartos pensados para el recogimiento: lo necesario, sin distracciones.
        </p>
      </Reveal>
      {amenities.length === 0 ? (
        <p className="mt-8 text-[var(--color-muted)]">Pronto publicaremos las amenidades de la casa.</p>
      ) : (
        <ul className="mt-4 border-b border-[var(--color-line)]">
          {amenities.map((item, index) => (
            <AmenidadRow key={item.id} item={item} reverse={index % 2 === 1} />
          ))}
        </ul>
      )}
    </section>
  );
}
