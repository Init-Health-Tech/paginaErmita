import Link from "next/link";
import { upcomingRetreats } from "@/lib/upcomingRetreats";

export function ProximosRetiros() {
  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="proximos-retiros-title">
      <h2
        id="proximos-retiros-title"
        className="text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Próximos retiros
      </h2>
      {/* TODO: reemplazar fechas de ejemplo con las convocatorias reales cuando estén definidas */}
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)]">
        Contenido de ejemplo a reemplazar. Las fechas siguientes son ilustrativas hasta confirmar las convocatorias reales.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {upcomingRetreats.map((retiro) => (
          <li key={retiro.id} className="surface flex h-full flex-col rounded-2xl p-5 sm:p-6">
            <span className="pill w-fit">Ejemplo</span>
            <h3
              className="mt-4 text-xl font-medium text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {retiro.title}
            </h3>
            <p className="mt-2 text-sm font-medium tracking-wide text-[var(--color-accent-dark)]">{retiro.datesLabel}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">{retiro.description}</p>
            <Link
              href={`/retiros?retiro=${retiro.id}#formulario-retiro`}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--color-accent-dark)] px-5 py-2 text-sm font-medium tracking-[0.05em] text-[var(--color-accent-dark)] transition hover:bg-[var(--color-accent-dark)] hover:text-white"
            >
              Inscribirme
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
