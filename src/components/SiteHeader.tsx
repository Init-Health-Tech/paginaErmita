"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/alquiler", label: "Alquiler" },
  { href: "/retiros", label: "Retiros" },
  { href: "/visitas", label: "Visitas" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color-mix(in_srgb,var(--color-border)_80%,transparent)] bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] shadow-[0_8px_30px_-12px_color-mix(in_srgb,var(--color-text)_8%,transparent)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--color-bg)_74%,transparent)]">
      <div className="relative mx-auto max-w-6xl px-4 pb-3 pt-3 sm:px-6 sm:pb-5 sm:pt-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="group min-w-0 flex-1 text-left sm:flex-none"
            onClick={() => setOpen(false)}
          >
            <span
              className="block text-xl font-medium tracking-[0.02em] text-[var(--color-text)] sm:text-2xl md:text-[1.7rem]"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ermita del Silencio
            </span>
            <span className="mt-0.5 block text-[0.7rem] font-normal leading-snug tracking-[0.14em] text-[var(--color-text-muted)] sm:mt-1 sm:text-xs sm:tracking-[0.18em]">
              Orden Franciscana Seglar — TOR
            </span>
          </Link>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
            <span className="relative block h-3.5 w-5" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-full rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-full rounded-full bg-current transition-transform duration-200 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </span>
          </button>

          <nav
            className="hidden items-center gap-x-1 gap-y-1 text-sm tracking-[0.05em] md:flex lg:gap-x-2"
            aria-label="Principal"
          >
            {nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative rounded-lg px-3 py-2 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 after:pointer-events-none after:absolute after:inset-x-2 after:bottom-1 after:h-px after:origin-left after:rounded-full after:bg-[var(--color-accent)] after:transition-transform after:duration-300 ${
                    active
                      ? "font-medium text-[var(--color-text)] after:scale-x-100"
                      : "text-[var(--color-text-muted)] after:scale-x-0 hover:text-[var(--color-accent)] hover:after:scale-x-100"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {open ? (
          <div id="mobile-nav" className="md:hidden">
            <div
              className="fixed inset-0 z-40 bg-[var(--color-accent-dark)]/25 backdrop-blur-[2px]"
              aria-hidden
              onClick={() => setOpen(false)}
            />
            <nav
              className="relative z-50 mt-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_16px_48px_-20px_color-mix(in_srgb,var(--color-text)_18%,transparent)]"
              aria-label="Principal móvil"
            >
              <ul className="divide-y divide-[var(--color-border)]">
                {nav.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`block min-h-12 px-4 py-3.5 text-[0.95rem] tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]/40 ${
                          active
                            ? "bg-[var(--color-bg-alt)] font-medium text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)] hover:text-[var(--color-accent)]"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
