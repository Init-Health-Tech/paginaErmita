import Link from "next/link";

const cards = [
  {
    href: "/alquiler",
    title: "Alquiler para retiros",
    text: "Grupos parroquiales, movimientos o comunidades que deseen celebrar un retiro espiritual en un entorno de silencio y oración.",
  },
  {
    href: "/retiros",
    title: "Retiros",
    text: "Información sobre convocatorias, espiritualidad y actividades. Déjanos sus datos para recibir noticias con discreción.",
  },
  {
    href: "/visitas",
    title: "Visitas",
    text: "Quienes deseen conocer la casa o pasar un tiempo breve de recogimiento pueden solicitar una visita coordinada.",
  },
];

export function QuickAccessCards() {
  return (
    <ul className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 md:mt-20 md:grid-cols-3">
      {cards.map((card) => (
        <li key={card.href}>
          <Link
            href={card.href}
            className="surface group relative block h-full overflow-hidden rounded-2xl p-5 transition duration-500 ease-out active:scale-[0.99] sm:p-6 md:p-7 md:hover:-translate-y-1 md:hover:border-[var(--color-accent)] md:hover:shadow-[0_20px_40px_-16px_color-mix(in_srgb,var(--color-accent-dark)_22%,transparent)]"
          >
            <h2
              className="text-xl font-medium text-[var(--color-text)] sm:text-2xl"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {card.title}
              <span className="ml-2 inline-block text-[var(--color-text-muted)] transition duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]">
                →
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:leading-7">{card.text}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
