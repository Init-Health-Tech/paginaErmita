import { CoverPhoto } from "@/components/CoverPhoto";

type Amenidad = {
  title: string;
  phrase: string;
  src?: string;
  alt?: string;
  icon: "capilla" | "comedor" | "cuartos";
};

const amenidades: Amenidad[] = [
  {
    title: "Capilla",
    phrase: "Oración y silencio",
    src: "/Fotos/casa/exterior-vista-casa-05.jpeg",
    alt: "Fachada de piedra de la capilla, con arco Silentium tibi laus y campanario",
    icon: "capilla",
  },
  {
    title: "Comedor",
    phrase: "Mesa en comunidad",
    src: "/Fotos/itza/exterior-vista-itza-08.jpeg",
    alt: "Vista de la casa y techos de teja entre el bosque",
    icon: "comedor",
  },
  {
    title: "Cuartos",
    phrase: "Descanso sencillo",
    src: "/Fotos/casa/exterior-vista-casa-06.jpeg",
    alt: "Torre de piedra con techo de teja y vista al bosque",
    icon: "cuartos",
  },
];

function AmenidadIcon({ name }: { name: Amenidad["icon"] }) {
  const common = "h-7 w-7 text-[var(--color-accent-dark)]";
  if (name === "capilla") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path
          d="M12 3v4M10 5h4M6 10.5 12 7l6 3.5V20H6V10.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 20v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === "comedor") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
        <path d="M4 10h16M6 10v8M18 10v8M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 7.5c0-1 .8-1.5 2-1.5s2 .5 2 1.5M14 7.5c0-1 .8-1.5 2-1.5s2 .5 2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden>
      <path d="M4 18V9.5A1.5 1.5 0 0 1 5.5 8H12v10H4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 18V8h6.5A1.5 1.5 0 0 1 20 9.5V18" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Amenidades() {
  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="amenidades-title">
      <h2
        id="amenidades-title"
        className="text-2xl font-medium text-[var(--color-text)] sm:text-3xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Amenidades
      </h2>
      <ul className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-3">
        {amenidades.map((item) => (
          <li key={item.title} className="surface overflow-hidden rounded-2xl">
            {item.src ? (
              <div className="relative aspect-[4/3] bg-[var(--color-bg-alt)]">
                <CoverPhoto src={item.src} alt={item.alt ?? item.title} sizes="(min-width: 768px) 280px, 100vw" />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-[var(--color-bg-alt)]" />
            )}
            <div className="flex items-start gap-3 p-4 sm:p-5">
              <AmenidadIcon name={item.icon} />
              <div>
                <p className="font-medium text-[var(--color-text)]" style={{ fontFamily: "var(--font-serif)" }}>
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.phrase}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
