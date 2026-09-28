import { CoverPhoto } from "@/components/CoverPhoto";
import { Reveal } from "@/components/Reveal";
import type { SitePhoto } from "@/lib/homePhotos";

export function PageGallery({ photos }: { photos: readonly SitePhoto[] }) {
  const [featured, ...rest] = photos;

  if (!featured) return null;

  return (
    <section aria-label="Fotografías de la Ermita">
      <div className="grid gap-3 md:grid-cols-12 md:gap-4">
        <Reveal className="md:col-span-7">
          <figure className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] md:aspect-[4/5] md:min-h-[28rem]">
            <CoverPhoto
              src={featured.src}
              alt={featured.alt}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="gallery-zoom"
            />
          </figure>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2 md:col-span-5 md:grid-cols-1 md:gap-4">
          {rest.map((photo, index) => (
            <Reveal key={photo.src} delay={120 + index * 90}>
              <figure
                className={`relative overflow-hidden ${
                  index === 0 ? "aspect-[4/3] md:aspect-[5/4]" : "aspect-[4/3] md:aspect-[4/5]"
                }`}
              >
                <CoverPhoto
                  src={photo.src}
                  alt={photo.alt}
                  sizes="(min-width: 768px) 40vw, 50vw"
                  className="gallery-zoom"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
