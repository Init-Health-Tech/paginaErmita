import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[color-mix(in_srgb,var(--color-ermita-line)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-ermita-paper)_88%,var(--color-ermita-soft))] pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_-28px_rgba(43,43,43,0.06)] backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-[var(--color-ermita-muted)] sm:px-6 sm:py-12">
        <p
          className="font-[family-name:var(--font-serif)] text-[0.95rem] tracking-[0.03em] text-[var(--color-ermita-ink)] sm:text-base"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Ermita del Silencio
        </p>
        <p className="mx-auto mt-3 max-w-xl text-pretty leading-relaxed sm:leading-8">
          Centro de retiros espirituales — Iglesia Católica Romana y Apostólica. Un espacio de recogimiento
          y oración.
        </p>
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3">
          <Link
            href="/contacto"
            className="rounded-full border border-[var(--color-ermita-line)]/90 bg-[color-mix(in_srgb,var(--color-ermita-paper)_85%,white)] px-4 py-2 font-medium tracking-wide text-[var(--color-ermita-muted)] shadow-sm transition duration-300 hover:border-[var(--color-ermita-muted)]/40 hover:text-[var(--color-ermita-ink)] hover:shadow-md"
          >
            Contacto
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-transparent px-4 py-2 tracking-wide text-[var(--color-ermita-muted)]/90 transition hover:text-[var(--color-ermita-ink)]"
          >
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
