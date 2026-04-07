"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
};

type TabId = "general" | "instalaciones";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "general", label: "Información general" },
  { id: "instalaciones", label: "Instalaciones" },
];

export function HomeShowcase({ images }: Props) {
  const [tab, setTab] = useState<TabId>("general");
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;

  const selectedImages = useMemo(() => {
    if (!hasImages) return [];
    const midpoint = Math.ceil(images.length / 2);
    return tab === "general" ? images.slice(0, midpoint) : images.slice(midpoint);
  }, [tab, images, hasImages]);

  useEffect(() => {
    setIndex(0);
  }, [tab]);

  useEffect(() => {
    if (selectedImages.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % selectedImages.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [selectedImages]);

  const activeImage = selectedImages[index] ?? "";
  const featuredImage = images[0] ?? "";
  const ambientA = images[1] ?? featuredImage;
  const ambientB = images[2] ?? featuredImage;

  return (
    <section className="mt-12 sm:mt-16 md:mt-20">
      {hasImages ? (
        <div
          className="relative min-h-[240px] overflow-hidden rounded-2xl border border-white/15 p-5 shadow-[0_24px_64px_-28px_rgba(43,43,43,0.35)] ring-1 ring-white/10 sm:min-h-0 sm:rounded-3xl sm:p-8 md:p-12"
          style={{
            backgroundImage: `linear-gradient(115deg, rgba(43,43,43,0.72) 0%, rgba(43,43,43,0.45) 45%, rgba(43,43,43,0.38) 100%), url("${featuredImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-ermita-paper)]/92 backdrop-blur-sm sm:px-3 sm:text-xs sm:tracking-[0.2em]">
            Espiritualidad franciscana TOR
          </p>
          <h2
            className="mt-3 max-w-2xl text-pretty font-[family-name:var(--font-serif)] text-2xl leading-[1.15] text-[var(--color-ermita-paper)] sm:mt-4 sm:text-4xl sm:leading-tight md:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Una casa de retiro viva, acogedora y en silencio
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed tracking-[0.01em] text-[var(--color-ermita-paper)]/90 sm:mt-5 sm:leading-8">
            El diseño integra contemplación y funcionalidad para mostrar mejor la vida de la Ermita: oración, comunidad y espacios al
            servicio de los retiros.
          </p>
        </div>
      ) : null}

      <div className="surface relative mt-4 overflow-hidden rounded-2xl p-4 sm:mt-6 sm:rounded-3xl sm:p-6 md:p-8">
        {hasImages ? (
          <>
            <div
              className="animate-float-slow pointer-events-none absolute -left-16 -top-14 h-44 w-44 rounded-full opacity-20 blur-3xl"
              style={{
                backgroundImage: `url("${ambientA}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="animate-float-slow pointer-events-none absolute -bottom-14 -right-12 h-48 w-48 rounded-full opacity-20 blur-3xl"
              style={{
                backgroundImage: `url("${ambientB}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                animationDelay: "0.9s",
              }}
            />
          </>
        ) : null}
        <div className="flex flex-col gap-4 border-b border-[var(--color-ermita-line)] pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pb-5">
          <h2
            className="font-[family-name:var(--font-serif)] text-2xl text-[var(--color-ermita-ink)] sm:text-3xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Vida en la Ermita
          </h2>
          <div className="grid w-full grid-cols-2 gap-1 rounded-2xl border border-[var(--color-ermita-line)]/80 bg-[var(--color-ermita-soft)]/50 p-1.5 shadow-inner sm:flex sm:w-auto sm:rounded-full sm:p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`min-h-11 rounded-xl px-2 py-2.5 text-center text-[0.7rem] font-medium leading-tight tracking-[0.03em] transition-all duration-300 sm:min-h-0 sm:rounded-full sm:px-5 sm:py-2 sm:text-sm sm:tracking-[0.04em] ${
                  tab === item.id
                    ? "bg-[var(--color-ermita-ink)] text-[var(--color-ermita-paper)] shadow-md shadow-[var(--color-ermita-ink)]/15"
                    : "text-[var(--color-ermita-muted)] hover:bg-white/70 hover:text-[var(--color-ermita-ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-6 sm:mt-7 sm:gap-8 md:grid-cols-5">
          <article className="md:col-span-2">
            {tab === "general" ? (
              <p className="text-sm leading-relaxed text-[var(--color-ermita-ink)]/75 sm:leading-8">
                La Ermita del Silencio es un espacio de acogida para quienes buscan retiro, oración y acompañamiento espiritual.
                La comunidad cuida una vida sencilla, con ritmos de silencio, liturgia y servicio fraterno. Cada actividad
                se realiza en un ambiente de respeto, orden y discreción.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-[var(--color-ermita-ink)]/75 sm:leading-8">
                Las instalaciones están orientadas al recogimiento: capilla, salas para dinámicas de retiro, zonas de descanso
                y espacios exteriores para oración personal. La casa ofrece lo necesario con sobriedad, privilegiando
                la funcionalidad y el clima espiritual por encima de lo accesorio.
              </p>
            )}
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--color-ermita-ink)]/70 sm:mt-5 sm:leading-7">
              <li>• Ambiente franciscano: humildad, sencillez y obediencia.</li>
              <li>• Espacios para grupos y retiro personal.</li>
              <li>• Entorno sereno para jornadas de oración.</li>
            </ul>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-7 sm:gap-3">
              <div className="rounded-xl border border-[var(--color-ermita-line)]/90 bg-[color-mix(in_srgb,white_92%,var(--color-ermita-soft))] px-1.5 py-3 text-center shadow-sm sm:px-2 sm:py-4">
                <p className="text-base tabular-nums text-[var(--color-ermita-ink)] sm:text-lg">{images.length || "-"}</p>
                <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-wide text-[var(--color-ermita-muted)] sm:text-[10px]">
                  Fotos
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-ermita-line)]/90 bg-[color-mix(in_srgb,white_92%,var(--color-ermita-soft))] px-1.5 py-3 text-center shadow-sm sm:px-2 sm:py-4">
                <p className="text-base tabular-nums text-[var(--color-ermita-ink)] sm:text-lg">3</p>
                <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-wide text-[var(--color-ermita-muted)] sm:text-[10px]">
                  Servicios
                </p>
              </div>
              <div className="rounded-xl border border-[var(--color-ermita-line)]/90 bg-[color-mix(in_srgb,white_92%,var(--color-ermita-soft))] px-1.5 py-3 text-center shadow-sm sm:px-2 sm:py-4">
                <p className="text-base tabular-nums text-[var(--color-ermita-ink)] sm:text-lg">365</p>
                <p className="mt-0.5 text-[9px] uppercase leading-tight tracking-wide text-[var(--color-ermita-muted)] sm:text-[10px]">
                  Días de oración
                </p>
              </div>
            </div>
          </article>

          <div className="md:col-span-3">
            {hasImages && selectedImages.length > 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-[var(--color-ermita-line)]/90 bg-white shadow-[0_16px_48px_-24px_rgba(43,43,43,0.18)] ring-1 ring-black/[0.04]">
                <div
                  key={activeImage}
                  className="animate-fade-soft h-56 w-full overflow-hidden sm:h-80 md:h-96"
                  aria-label="Fotografía de la Ermita"
                >
                  <div
                    className="animate-ken-burns h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(rgba(43,43,43,0.2), rgba(43,43,43,0.2)), url("${activeImage}")` }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 opacity-10"
                  style={{ backgroundImage: `linear-gradient(rgba(43,43,43,0.2), rgba(43,43,43,0.2)), url("${activeImage}")` }}
                />
                <div className="absolute left-2 top-2 rounded-md bg-[var(--color-ermita-paper)]/92 px-2 py-1 text-[0.65rem] tracking-[0.06em] text-[var(--color-ermita-muted)] sm:left-4 sm:top-4 sm:px-3 sm:text-xs sm:tracking-[0.08em]">
                  {tab === "general" ? "Información general" : "Instalaciones"}
                </div>
                <div className="absolute bottom-2 left-2 right-2 grid grid-cols-2 gap-2 sm:bottom-3 sm:left-3 sm:right-3 sm:flex sm:items-center sm:justify-between">
                  <span className="col-span-2 flex justify-center sm:order-2 sm:col-span-1 sm:flex-none">
                    <span className="rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/92 px-2.5 py-1 text-[0.65rem] text-[var(--color-ermita-muted)] sm:px-2 sm:text-xs">
                      {index + 1} / {selectedImages.length}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)}
                    className="min-h-11 rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/95 px-3 text-xs text-[var(--color-ermita-ink)] transition hover:bg-white sm:order-1 sm:min-h-0 sm:py-2 sm:text-sm"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((prev) => (prev + 1) % selectedImages.length)}
                    className="min-h-11 rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/95 px-3 text-xs text-[var(--color-ermita-ink)] transition hover:bg-white sm:order-3 sm:min-h-0 sm:py-2 sm:text-sm"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-[var(--color-ermita-line)] bg-[var(--color-ermita-soft)] p-4 text-center text-sm leading-relaxed text-[var(--color-ermita-muted)] sm:h-96 sm:p-6">
                Agrega fotos en <code className="mx-1">public/Fotos</code> para activar automaticamente el carrusel.
              </div>
            )}
            {hasImages && selectedImages.length > 1 ? (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {selectedImages.map((image, i) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-shadow duration-300 ${
                      i === index
                        ? "border-[var(--color-ermita-gold)]/80 shadow-md ring-2 ring-[var(--color-ermita-gold)]/25"
                        : "border-[var(--color-ermita-line)] opacity-90 hover:border-[var(--color-ermita-muted)]/60 hover:opacity-100"
                    }`}
                    aria-label={`Ir a foto ${i + 1}`}
                  >
                    <span
                      className="block h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${image}")` }}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
