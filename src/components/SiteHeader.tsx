import Link from "next/link";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/retiros", label: "Retiros" },
  { href: "/visitas", label: "Visitas" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="group text-center sm:text-left">
          <span
            className="font-[family-name:var(--font-serif)] text-2xl tracking-[0.02em] text-[var(--color-ermita-ink)]"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ermita del Silencio
          </span>
          <span className="mt-1 block text-xs font-normal tracking-[0.15em] text-[var(--color-ermita-muted)]">
            Orden Franciscana Seglar — TOR
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm tracking-[0.05em] text-[var(--color-ermita-muted)]"
          aria-label="Principal"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors duration-300 hover:text-[var(--color-ermita-ink)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
