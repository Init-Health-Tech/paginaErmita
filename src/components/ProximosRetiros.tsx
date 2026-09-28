import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { formatRetreatDates } from "@/lib/contentModel";
import { listRetreats } from "@/lib/siteContent";

export async function ProximosRetiros() {
  const retreats = await listRetreats();

  return (
    <section aria-labelledby="proximos-retiros-title">
      <Reveal>
        <p className="eyebrow">Agenda</p>
        <h2 id="proximos-retiros-title" className="heading-2 mt-4">
          Próximos retiros
        </h2>
        <p className="copy-wide mt-5 max-w-[52ch] text-[var(--color-muted)]">
          Convocatorias abiertas a lo largo del año. Elija una fecha y deje sus datos para recibir información.
        </p>
      </Reveal>
      {retreats.length === 0 ? (
        <Reveal>
          <p className="mt-10 border-t border-[var(--color-line)] pt-8 text-[var(--color-muted)]">
            Por ahora no hay retiros programados. Puede dejar sus datos más abajo para enterarse de las próximas convocatorias.
          </p>
        </Reveal>
      ) : (
        <ul className="mt-10 border-b border-[var(--color-line)]">
          {retreats.map((retiro, index) => (
            <li
              key={retiro.id}
              className="group border-t border-[var(--color-line)] py-9 md:py-11"
            >
              <Reveal delay={index * 80}>
                <div className="grid gap-5 md:grid-cols-[13rem_1fr_auto] md:items-center md:gap-12">
                  <p className="font-serif text-[clamp(1.85rem,3.4vw,2.75rem)] font-light leading-[1.05] tracking-tight">
                    {formatRetreatDates(retiro.startDate, retiro.endDate)}
                  </p>
                  <div>
                    <p className="eyebrow">
                      {String(index + 1).padStart(2, "0")}
                      {retiro.capacity != null ? ` · Cupo ${retiro.capacity}` : null}
                    </p>
                    <h3 className="heading-3 mt-3">{retiro.name}</h3>
                    {retiro.description ? (
                      <p className="mt-3 max-w-[48ch] text-[var(--color-muted)]">{retiro.description}</p>
                    ) : null}
                  </div>
                  <Link
                    href={`/retiros?retiro=${retiro.id}#formulario-retiro`}
                    className="link-arrow w-fit transition-transform duration-300 group-hover:translate-x-1"
                  >
                    Inscribirme
                    <span className="arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
