import { CoverPhoto } from "@/components/CoverPhoto";
import type { SitePhoto } from "@/lib/homePhotos";

export function PageGallery({ photos }: { photos: readonly SitePhoto[] }) {
  return (
    <section aria-label="Fotografías de la Ermita">
      <ul className="grid gap-2 sm:grid-cols-3 sm:gap-3">
        {photos.map((photo) => (
          <li key={photo.src}>
            <figure className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/4] md:aspect-[4/5]">
              <CoverPhoto src={photo.src} alt={photo.alt} sizes="(min-width: 640px) 33vw, 100vw" />
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
