const testimonials = [
  {
    quote: "Encontré un silencio que no sabía que necesitaba. La Ermita te devuelve a lo esencial.",
    attribution: "Grupo parroquial San José",
  },
  {
    quote: "Un espacio sencillo pero profundamente acogedor para el retiro personal.",
    attribution: "Retiro personal, comunidad TOR",
  },
  {
    quote: "La sobriedad del lugar ayuda a que la oración sea lo único que importa.",
    attribution: "Movimiento juvenil franciscano",
  },
];

export function Testimonials() {
  return (
    <section className="mt-16 sm:mt-20 md:mt-24" aria-labelledby="testimonios-titulo">
      <h2
        id="testimonios-titulo"
        className="text-center text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Voces de quienes han pasado por la Ermita
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
        Testimonios de ejemplo — sustituir más adelante
      </p>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-3">
        {testimonials.map((item) => (
          <li key={item.attribution}>
            <figure className="surface flex h-full flex-col rounded-2xl p-5 sm:p-6">
              <span
                className="text-3xl leading-none text-[var(--color-accent-gold)]"
                style={{ fontFamily: "var(--font-serif)" }}
                aria-hidden
              >
                “
              </span>
              <blockquote
                className="mt-3 flex-1 text-sm italic leading-relaxed text-[var(--color-text)] sm:text-[0.95rem] sm:leading-7"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {item.quote}
              </blockquote>
              <figcaption className="mt-5 text-xs tracking-[0.02em] text-[var(--color-text-muted)]">
                — {item.attribution}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
