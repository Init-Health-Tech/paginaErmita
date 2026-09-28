"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CoverPhoto } from "@/components/CoverPhoto";
import { lifeGallery } from "@/lib/homePhotos";

const galleryRows = [lifeGallery.slice(0, 2), lifeGallery.slice(2, 5), lifeGallery.slice(5)];

export function LifeAtErmita() {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(() => {
    setIndex((current) => (current == null ? current : (current - 1 + lifeGallery.length) % lifeGallery.length));
  }, []);
  const next = useCallback(() => {
    setIndex((current) => (current == null ? current : (current + 1) % lifeGallery.length));
  }, []);

  useEffect(() => {
    if (index == null) return;
    const root = dialogRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>("button") ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key !== "Tab") return;
      const nodes = focusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [index, close, next, prev]);

  const active = index == null ? null : lifeGallery[index];

  return (
    <section className="band-bg section-pad">
      <div className="shell">
        <p className="eyebrow">Vida en la Ermita</p>
        <h2 className="heading-2 mt-5">La casa, la capilla y el bosque</h2>
        <p className="copy-wide mt-6 text-[var(--color-muted)]">
          La Ermita del Silencio acoge a quienes buscan retiro, oración y acompañamiento. La comunidad cuida una vida sencilla, con
          silencio, liturgia y servicio. La capilla, las salas, los cuartos y los espacios exteriores están dispuestos para el
          recogimiento, con lo necesario y nada que distraiga.
        </p>

        <div className="mt-10 flex flex-col gap-6 md:mt-12 md:gap-8">
          {galleryRows.map((row) => (
            <ul key={row[0]?.src} className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
              {row.map((photo) => {
                const photoIndex = lifeGallery.findIndex((item) => item.src === photo.src);
                return (
                  <li key={photo.src} className={photo.frame}>
                    <figure>
                      <button
                        type="button"
                        className="relative block h-40 w-full overflow-hidden text-left sm:h-52 md:h-64"
                        onClick={() => setIndex(photoIndex)}
                      >
                        <CoverPhoto
                          src={photo.src}
                          alt={photo.alt}
                          sizes="(min-width: 768px) 40vw, 50vw"
                          className="gallery-zoom"
                        />
                      </button>
                      <figcaption className="mt-3 text-sm text-[var(--color-muted)]">{photo.caption}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          ))}
        </div>

        <p className="eyebrow mt-14 border-t border-[var(--color-line)] pt-8">
          Capilla <span className="text-[var(--color-accent)]">·</span> Comedor <span className="text-[var(--color-accent)]">·</span>{" "}
          Cuartos
        </p>
      </div>

      {active && index != null ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 px-4 py-8 text-[var(--color-on-dark)]"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchX.current;
            const end = event.changedTouches[0]?.clientX;
            if (start == null || end == null) return;
            if (end - start > 40) prev();
            if (start - end > 40) next();
          }}
        >
          <button type="button" className="absolute right-4 top-4 px-3 py-2 text-2xl leading-none" onClick={close}>
            <span className="sr-only">Cerrar</span>
            <span aria-hidden>×</span>
          </button>
          <button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-4 text-3xl md:left-6" onClick={prev}>
            <span className="sr-only">Anterior</span>
            <span aria-hidden>←</span>
          </button>
          <figure className="flex max-h-full w-full max-w-5xl flex-col items-center">
            <div className="relative h-[68vh] w-full">
              <CoverPhoto src={active.src} alt={active.alt} sizes="100vw" />
            </div>
            <figcaption className="mt-4 text-sm text-[color-mix(in_srgb,var(--color-on-dark)_80%,transparent)]">
              {active.caption}
            </figcaption>
          </figure>
          <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-4 text-3xl md:right-6" onClick={next}>
            <span className="sr-only">Siguiente</span>
            <span aria-hidden>→</span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
