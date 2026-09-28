import Link from "next/link";
import { formatRetreatDates } from "@/lib/contentModel";
import { listRetreats } from "@/lib/siteContent";

export async function ProximosRetiros() {
  const retreats = await listRetreats();

  return (
    <section className="mt-16 md:mt-24" aria-labelledby="proximos-retiros-title">
      <p className="eyebrow">Agenda</p>
      <h2 id="proximos-retiros-title" className="heading-2 mt-4">
        Próximos retiros
      </h2>
      {retreats.length === 0 ? (
        <p className="mt-8 text-[var(--color-muted)]">Por ahora no hay retiros programados.</p>
      ) : (
        <ul className="mt-8 border-b border-[var(--color-line)]">
          {retreats.map((retiro) => (
            <li
              key={retiro.id}
              className="grid gap-4 border-t border-[var(--color-line)] py-8 md:grid-cols-[11rem_1fr_auto] md:items-center md:gap-10"
            >
              <p className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-none">
                {formatRetreatDates(retiro.startDate, retiro.endDate)}
              </p>
              <div>
                <h3 className="heading-3">{retiro.name}</h3>
                {retiro.description ? <p className="mt-3 text-[var(--color-muted)]">{retiro.description}</p> : null}
                {retiro.capacity != null ? (
                  <p className="mt-3 text-sm text-[var(--color-muted)]">Cupo: {retiro.capacity} personas</p>
                ) : null}
              </div>
              <Link href={`/retiros?retiro=${retiro.id}#formulario-retiro`} className="link-arrow">
                Inscribirme
                <span className="arrow" aria-hidden>
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
