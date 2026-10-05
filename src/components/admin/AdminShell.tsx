"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LayoutDashboard, Menu, Users, X, type LucideIcon } from "lucide-react";
import styles from "./admin.module.css";

const NAV: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/alquiler", label: "Alquiler", icon: Home },
  { href: "/admin/retiros", label: "Retiros", icon: CalendarDays },
  { href: "/admin/visitas", label: "Visitas", icon: Users },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="min-w-0">
      <p className={`font-serif font-light text-[var(--color-text)] ${compact ? "truncate text-xl leading-none" : "text-[1.65rem] leading-tight"}`}>
        Ermita del Silencio
      </p>
      <p className="mt-2 text-[0.7rem] tracking-[0.14em] text-[var(--color-muted)]">Panel de administración</p>
    </div>
  );
}

function NavLinks({ pathname, mobile = false, onNavigate }: { pathname: string; mobile?: boolean; onNavigate?: () => void }) {
  return (
    <>
      {NAV.map((item) => {
        const active = isActivePath(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={`relative flex items-center gap-3 text-sm ${mobile ? "min-h-12 px-4" : "px-6 py-2.5"} ${
              active ? "text-[var(--color-accent)]" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
          >
            {active ? <span className="absolute inset-y-0 left-0 w-0.5 bg-[var(--color-accent)]" aria-hidden /> : null}
            <Icon strokeWidth={1.5} className="h-[18px] w-[18px] shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function ShellLinks({ onNavigate, mobile = false }: { onNavigate?: () => void; mobile?: boolean }) {
  const itemClass = `block text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)] ${mobile ? "min-h-12 px-4 py-3" : "py-2"}`;
  return (
    <>
      <a href="/" target="_blank" rel="noreferrer" onClick={onNavigate} className={itemClass}>
        Ver sitio público ↗
      </a>
      <a href="/api/admin/logout" onClick={onNavigate} className={itemClass}>
        Cerrar sesión
      </a>
    </>
  );
}

export function AdminShell({ authorized, children }: { authorized: boolean; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!authorized) {
    return (
      <div className={`admin-shell ${styles.shell} flex min-h-dvh w-full min-w-0 flex-1 flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]`}>
        <main className="mx-auto w-full min-w-0 max-w-[1100px] px-6 py-16 md:px-12 md:py-24">{children}</main>
      </div>
    );
  }

  return (
    <div className={`admin-shell ${styles.shell} flex min-h-dvh w-full min-w-0 flex-1 flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]`}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col overflow-y-auto border-r border-[var(--color-line)] bg-[var(--color-bg)] md:flex">
        <div className="px-6 pt-10">
          <BrandLockup />
        </div>
        <nav className="mt-12 flex flex-col" aria-label="Administración">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="mt-auto border-t border-[var(--color-line)] px-6 py-6">
          <ShellLinks />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-60">
        <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[var(--color-bg)] md:hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <BrandLockup compact />
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-text)]"
              aria-expanded={open}
              aria-controls="admin-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
              {open ? <X strokeWidth={1.5} className="h-5 w-5" /> : <Menu strokeWidth={1.5} className="h-5 w-5" />}
            </button>
          </div>
          {open ? (
            <nav id="admin-menu" className="border-t border-[var(--color-line)] py-2" aria-label="Administración">
              <NavLinks pathname={pathname} mobile onNavigate={() => setOpen(false)} />
              <div className="mt-2 border-t border-[var(--color-line)] pt-2">
                <ShellLinks mobile onNavigate={() => setOpen(false)} />
              </div>
            </nav>
          ) : null}
        </header>
        <main className="mx-auto w-full min-w-0 max-w-[1100px] px-6 py-12 md:px-12 md:py-16">{children}</main>
      </div>
    </div>
  );
}
