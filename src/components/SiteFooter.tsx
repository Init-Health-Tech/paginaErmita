import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-bg-alt)] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-[var(--color-text-muted)] sm:px-6 sm:py-12">
        <p
          className="text-[0.95rem] font-medium tracking-[0.03em] text-[var(--color-text)] sm:text-base"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ermita del Silencio
        </p>
        <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed sm:leading-8">
          Centro de retiros espirituales — Iglesia Católica Romana y Apostólica. Un espacio de recogimiento y oración.
        </p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3">
          <Link
            href="/contacto"
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 font-medium tracking-wide text-[var(--color-text-muted)] shadow-sm transition duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-accent-dark)]"
          >
            Contacto
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-transparent px-4 py-2 tracking-wide text-[var(--color-text-muted)] transition hover:text-[var(--color-accent)]"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
