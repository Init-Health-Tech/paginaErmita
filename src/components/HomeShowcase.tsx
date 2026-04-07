"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  images: string[];
};

type TabId = "general" | "instalaciones";

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "general", label: "Informacion general" },
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
    <section className="mt-20">
      {hasImages ? (
        <div
          className="relative overflow-hidden rounded-2xl border border-[var(--color-ermita-line)] p-8 sm:p-12"
          style={{
            backgroundImage: `linear-gradient(rgba(43,43,43,0.56), rgba(43,43,43,0.38)), url("${featuredImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ermita-paper)]/85">Espiritualidad franciscana TOR</p>
          <h2
            className="mt-4 max-w-2xl font-[family-name:var(--font-serif)] text-3xl leading-tight text-[var(--color-ermita-paper)] sm:text-5xl"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Una casa de retiro viva, acogedora y en silencio
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 tracking-[0.01em] text-[var(--color-ermita-paper)]/90">
            El diseño integra contemplacion y funcionalidad para mostrar mejor la vida de la Ermita: oracion, comunidad y espacios al
            servicio de los retiros.
          </p>
        </div>
      ) : null}

      <div className="surface relative mt-6 overflow-hidden rounded-2xl p-5 sm:p-8">
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-ermita-line)] pb-5">
          <h2 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-ink)]" style={{ fontFamily: "var(--font-serif)" }}>
            Vida en la Ermita
          </h2>
          <div className="inline-flex rounded-lg border border-[var(--color-ermita-line)] bg-white p-1">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`rounded-md px-4 py-2 text-sm tracking-[0.04em] transition ${
                  tab === item.id ? "bg-[var(--color-ermita-ink)] text-[var(--color-ermita-paper)]" : "text-[var(--color-ermita-muted)] hover:text-[var(--color-ermita-ink)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-8 md:grid-cols-5">
          <article className="md:col-span-2">
            {tab === "general" ? (
              <p className="text-sm leading-8 text-[var(--color-ermita-ink)]/75">
                La Ermita del Silencio es un espacio de acogida para quienes buscan retiro, oracion y acompanamiento espiritual.
                La comunidad cuida una vida sencilla, con ritmos de silencio, liturgia y servicio fraterno. Cada actividad
                se realiza en un ambiente de respeto, orden y discrecion.
              </p>
            ) : (
              <p className="text-sm leading-8 text-[var(--color-ermita-ink)]/75">
                Las instalaciones estan orientadas al recogimiento: capilla, salas para dinamicas de retiro, zonas de descanso
                y espacios exteriores para oracion personal. La casa ofrece lo necesario con sobriedad, privilegiando
                la funcionalidad y el clima espiritual por encima de lo accesorio.
              </p>
            )}
            <ul className="mt-5 space-y-2 text-sm leading-7 text-[var(--color-ermita-ink)]/70">
              <li>• Ambiente franciscano: humildad, sencillez y obediencia.</li>
              <li>• Espacios para grupos y retiro personal.</li>
              <li>• Entorno sereno para jornadas de oracion.</li>
            </ul>
            <div className="mt-7 grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-[var(--color-ermita-line)] bg-white px-2 py-4 text-center">
                <p className="text-lg text-[var(--color-ermita-ink)]">{images.length || "-"}</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-ermita-muted)]">Fotos</p>
              </div>
              <div className="rounded-lg border border-[var(--color-ermita-line)] bg-white px-2 py-4 text-center">
                <p className="text-lg text-[var(--color-ermita-ink)]">3</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-ermita-muted)]">Servicios</p>
              </div>
              <div className="rounded-lg border border-[var(--color-ermita-line)] bg-white px-2 py-4 text-center">
                <p className="text-lg text-[var(--color-ermita-ink)]">365</p>
                <p className="text-[10px] uppercase tracking-wide text-[var(--color-ermita-muted)]">Dias de oracion</p>
              </div>
            </div>
          </article>

          <div className="md:col-span-3">
            {hasImages && selectedImages.length > 0 ? (
              <div className="relative overflow-hidden rounded-xl border border-[var(--color-ermita-line)] bg-white">
                <div
                  key={activeImage}
                  className="animate-fade-soft h-72 w-full overflow-hidden sm:h-96"
                  aria-label="Fotografia de la Ermita"
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
                <div className="absolute left-4 top-4 rounded-md bg-[var(--color-ermita-paper)]/90 px-3 py-1 text-xs tracking-[0.08em] text-[var(--color-ermita-muted)]">
                  {tab === "general" ? "Informacion general" : "Instalaciones"}
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length)}
                    className="rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/92 px-3 py-1 text-sm text-[var(--color-ermita-ink)] transition hover:bg-white"
                  >
                    Anterior
                  </button>
                  <span className="rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/92 px-2 py-1 text-xs text-[var(--color-ermita-muted)]">
                    {index + 1} / {selectedImages.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIndex((prev) => (prev + 1) % selectedImages.length)}
                    className="rounded-md border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/92 px-3 py-1 text-sm text-[var(--color-ermita-ink)] transition hover:bg-white"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-[var(--color-ermita-line)] bg-[var(--color-ermita-soft)] p-6 text-center text-sm text-[var(--color-ermita-muted)] sm:h-96">
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
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border ${
                      i === index ? "border-[var(--color-ermita-ink)]" : "border-[var(--color-ermita-line)]"
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
