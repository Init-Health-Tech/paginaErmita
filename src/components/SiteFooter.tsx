import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)]">
      <div className="mx-auto max-w-6xl px-6 py-12 text-center text-sm text-[var(--color-ermita-muted)]">
        <p className="font-[family-name:var(--font-serif)] text-base tracking-[0.03em] text-[var(--color-ermita-ink)]" style={{ fontFamily: "var(--font-serif)" }}>
          Ermita del Silencio
        </p>
        <p className="mx-auto mt-3 max-w-xl leading-8">
          Centro de retiros espirituales — Iglesia Católica Romana y Apostólica. Un espacio de recogimiento
          y oración.
        </p>
        <p className="mt-6 text-xs">
          <Link href="/contacto" className="underline underline-offset-4 transition-colors hover:text-[var(--color-ermita-ink)]">
            Contacto
          </Link>
          <span className="mx-2">·</span>
          <Link href="/admin" className="underline underline-offset-4 transition-colors hover:text-[var(--color-ermita-ink)]">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
