import { CoverPhoto } from "@/components/CoverPhoto";
import type { Amenity } from "@/lib/contentModel";
import { listAmenities } from "@/lib/siteContent";

function AmenidadRow({ item }: { item: Amenity }) {
  return (
    <li className="grid gap-6 border-t border-[var(--color-line)] py-8 md:grid-cols-[220px_1fr] md:items-center">
      {item.src ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <CoverPhoto src={item.src} alt={item.alt ?? item.title} sizes="(min-width: 768px) 220px, 100vw" />
        </div>
      ) : null}
      <div className={item.src ? "" : "md:col-span-2"}>
        <h3 className="heading-3">{item.title}</h3>
        {item.phrase ? <p className="mt-3 max-w-[52ch] text-[var(--color-muted)]">{item.phrase}</p> : null}
      </div>
    </li>
  );
}

export async function Amenidades() {
  const amenities = await listAmenities();

  return (
    <section aria-labelledby="amenidades-title">
      <p className="eyebrow">La casa</p>
      <h2 id="amenidades-title" className="heading-2 mt-4">
        Amenidades
      </h2>
      {amenities.length === 0 ? (
        <p className="mt-8 text-[var(--color-muted)]">Pronto publicaremos las amenidades de la casa.</p>
      ) : (
        <ul className="mt-8 border-b border-[var(--color-line)]">
          {amenities.map((item) => (
            <AmenidadRow key={item.id} item={item} />
          ))}
        </ul>
      )}
    </section>
  );
}
