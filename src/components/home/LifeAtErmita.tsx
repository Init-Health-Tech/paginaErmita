"use client";

import { useState } from "react";
import { CoverPhoto } from "@/components/CoverPhoto";
import { generalGallery, instalacionesGallery } from "@/lib/homePhotos";

type TabId = "general" | "instalaciones";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "general", label: "Información general" },
  { id: "instalaciones", label: "Instalaciones" },
];

const GALLERY = {
  general: generalGallery,
  instalaciones: instalacionesGallery,
};

const copy: Record<TabId, { text: string }> = {
  general: {
    text: "La Ermita del Silencio es un espacio de acogida para quienes buscan retiro, oración y acompañamiento espiritual. La comunidad cuida una vida sencilla, con ritmos de silencio, liturgia y servicio fraterno. Cada actividad se realiza en un ambiente de respeto, orden y discreción.",
  },
  instalaciones: {
    text: "Las instalaciones están orientadas al recogimiento: capilla, salas para dinámicas de retiro, zonas de descanso y espacios exteriores para oración personal. La casa ofrece lo necesario con sobriedad, privilegiando la funcionalidad y el clima espiritual por encima de lo accesorio.",
  },
};

const bullets = [
  "Ambiente franciscano: humildad, sencillez y obediencia.",
  "Espacios para grupos y retiro personal.",
  "Entorno sereno para jornadas de oración.",
];

const stats = [
  { value: "25", label: "Fotos" },
  { value: "3", label: "Servicios" },
  { value: "365", label: "Días de oración" },
];

export function LifeAtErmita() {
  const [tab, setTab] = useState<TabId>("general");
  const [index, setIndex] = useState(0);

  const images = GALLERY[tab];
  const activeTabLabel = tabs.find((item) => item.id === tab)?.label ?? "";
  const activeImage = images[index] ?? images[0];

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="surface relative mt-4 overflow-hidden rounded-2xl bg-[var(--color-bg-alt)] p-4 sm:mt-6 sm:rounded-3xl sm:p-6 md:p-8">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-5">
        <h2
          className="text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Vida en la Ermita
        </h2>
        <div
          className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 sm:flex sm:w-auto sm:rounded-full sm:p-1"
          role="tablist"
          aria-label="Secciones de la Ermita"
        >
          {tabs.map((item) => {
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setTab(item.id);
                  setIndex(0);
                }}
                className={`min-h-11 rounded-xl px-2 py-2.5 text-center text-[0.7rem] font-medium leading-tight tracking-[0.03em] transition-all duration-300 sm:min-h-0 sm:rounded-full sm:px-5 sm:py-2 sm:text-sm sm:tracking-[0.04em] ${
                  selected
                    ? "bg-[var(--color-accent-dark)] text-white shadow-md shadow-[var(--color-accent-dark)]/20"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-6 sm:mt-7 sm:gap-8 md:grid-cols-5">
        <article className="md:col-span-2">
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)] sm:leading-8">{copy[tab].text}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-5 sm:leading-7">
            {bullets.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-3 text-center shadow-sm sm:px-2 sm:py-4"
              >
                <p
                  className="text-xl font-medium tabular-nums text-[var(--color-text)] sm:text-2xl"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-[0.12em] text-[var(--color-text-muted)] sm:text-[10px] sm:tracking-[0.14em]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </article>

        <div className="md:col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-alt)] shadow-[0_16px_48px_-24px_color-mix(in_srgb,var(--color-text)_16%,transparent)]">
            <div className="relative h-56 w-full overflow-hidden sm:h-80 md:h-96">
              {activeImage ? (
                <CoverPhoto
                  key={activeImage.src}
                  src={activeImage.src}
                  alt={activeImage.alt}
                  sizes="(min-width: 768px) 55vw, 100vw"
                />
              ) : null}
            </div>
            <div className="absolute left-2 top-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/92 px-2.5 py-1 text-[0.65rem] tracking-[0.06em] text-[var(--color-text-muted)] sm:left-4 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.08em]">
              {activeTabLabel}
            </div>
            <div className="absolute bottom-2 left-2 right-2 grid grid-cols-2 gap-2 sm:bottom-3 sm:left-3 sm:right-3 sm:flex sm:items-center sm:justify-between">
              <span className="col-span-2 flex justify-center sm:order-2 sm:col-span-1 sm:flex-none">
                <span
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/92 px-2.5 py-1 text-[0.65rem] tabular-nums text-[var(--color-text-muted)] sm:px-2 sm:text-xs"
                  aria-live="polite"
                >
                  {index + 1} / {images.length}
                </span>
              </span>
              <button
                type="button"
                onClick={goPrev}
                className="min-h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] hover:text-white sm:order-1 sm:min-h-0 sm:py-2 sm:text-sm"
              >
                Anterior
              </button>
              <button
                type="button"
                onClick={goNext}
                className="min-h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] hover:text-white sm:order-3 sm:min-h-0 sm:py-2 sm:text-sm"
              >
                Siguiente
              </button>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-shadow duration-300 ${
                  i === index
                    ? "border-[var(--color-accent-gold)] shadow-md ring-2 ring-[var(--color-accent-gold)]/30"
                    : "border-[var(--color-border)] opacity-90 hover:border-[var(--color-accent)] hover:opacity-100"
                }`}
                aria-label={`Ir a ${image.alt}`}
                aria-current={i === index ? "true" : undefined}
              >
                <CoverPhoto src={image.src} alt="" sizes="80px" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
