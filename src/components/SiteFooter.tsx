import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/retiros", label: "Retiros" },
  { href: "/visitas", label: "Visitas" },
  { href: "/contacto", label: "Contacto" },
];

export function SiteFooter({ isAdmin = false }: { isAdmin?: boolean }) {
  if (isAdmin) {
    return (
      <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-[var(--color-text-muted)] sm:px-6 sm:py-12">
          <p className="text-[0.95rem] font-medium tracking-[0.03em] text-[var(--color-text)] sm:text-base" style={{ fontFamily: "var(--font-serif)" }}>
            Ermita del Silencio
          </p>
          <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed sm:leading-8">
            Centro de retiros espirituales — Iglesia Católica Romana y Apostólica. Un espacio de recogimiento y oración.
          </p>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3">
            <Link href="/contacto" className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-medium tracking-wide text-[var(--color-text-muted)] shadow-sm transition duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent-dark)]">
              Contacto
            </Link>
            <Link href="/admin" className="rounded-full border border-transparent px-4 py-2 tracking-wide text-[var(--color-text-muted)] transition hover:text-[var(--color-accent)]">
              Admin
            </Link>
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mt-auto bg-[var(--color-dark)] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[var(--color-on-dark)]">
      <div className="border-t border-[color-mix(in_srgb,var(--color-on-dark)_15%,transparent)]">
        <div className="shell grid gap-12 py-16 md:grid-cols-3 md:py-20">
          <div>
            <p className="font-serif text-3xl font-light">Ermita del Silencio</p>
            <p className="eyebrow mt-4 text-[var(--color-on-dark)]">Orden Franciscana Seglar — TOR</p>
          </div>
          <nav aria-label="Pie de página">
            <ul className="space-y-3 text-sm">
              {links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-arrow link-on-dark">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="text-sm leading-relaxed">
            <p>Faldas del Itza · zona privada, acceso con registro previo</p>
            <p className="mt-4">
              <Link href="/contacto" className="link-arrow link-on-dark">
                Contacto
                <span className="arrow" aria-hidden>
                  →
                </span>
              </Link>
            </p>
          </div>
        </div>
        <div className="shell flex items-center justify-between border-t border-[color-mix(in_srgb,var(--color-on-dark)_15%,transparent)] py-5 text-xs tracking-[0.08em] text-[color-mix(in_srgb,var(--color-on-dark)_75%,transparent)]">
          <p>© {new Date().getFullYear()} Ermita del Silencio</p>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
