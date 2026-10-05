"use client";

import { useState } from "react";
import { formatAdminDate } from "@/lib/dates";
import { adminMutedClass, adminSectionClass, adminSectionTitleClass } from "./styles";

function shortDay(iso: string): string {
  const full = formatAdminDate(iso);
  const [day, month] = full.split(" ");
  if (!day || !month) return full;
  return `${day} ${month}`;
}

export function ActivityChart({
  stats,
  className = adminSectionClass,
}: {
  stats: Array<{ date: string; visits: number }>;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(0, ...stats.map((item) => item.visits));
  const empty = stats.every((item) => item.visits === 0);

  return (
    <section className={className}>
      <h2 className={adminSectionTitleClass}>Actividad · últimos 14 días</h2>
      {empty ? (
        <div className="mt-8">
          <div className="border-t border-[var(--color-line)]" />
          <p className={`mt-4 ${adminMutedClass}`}>Sin registros en este periodo</p>
        </div>
      ) : (
        <div
          className="mt-8 grid gap-x-1 sm:gap-x-2"
          style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
        >
          {stats.map((item, index) => {
            const label = shortDay(item.date);
            const height = item.visits === 0 ? 0 : Math.max(8, (item.visits / max) * 100);
            const tooltipAtStart = index === 0;
            const tooltipAtEnd = index === stats.length - 1;
            return (
              <div key={item.date} className="min-w-0">
                <div
                  tabIndex={0}
                  className="relative flex h-36 items-end border-b border-[var(--color-line)] outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-accent)]"
                  onMouseEnter={() => setActive(item.date)}
                  onMouseLeave={() => setActive((current) => (current === item.date ? null : current))}
                  onFocus={() => setActive(item.date)}
                  onBlur={() => setActive((current) => (current === item.date ? null : current))}
                >
                  {active === item.date ? (
                    <span
                      className={`pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap text-[11px] tabular-nums text-[var(--color-text)] ${
                        tooltipAtStart ? "left-0" : tooltipAtEnd ? "right-0" : "left-1/2 -translate-x-1/2"
                      }`}
                    >
                      {item.visits}
                    </span>
                  ) : null}
                  {item.visits > 0 ? (
                    <svg
                      viewBox="0 0 10 10"
                      preserveAspectRatio="none"
                      className="block w-full"
                      style={{ height: `${height}%` }}
                      role="img"
                      aria-label={`${label}: ${item.visits}`}
                    >
                      <rect width="10" height="10" fill="var(--color-accent)" />
                    </svg>
                  ) : (
                    <span className="sr-only">{`${label}: 0`}</span>
                  )}
                </div>
                <p className="mt-2 text-center text-[10px] leading-tight text-[var(--color-muted)] sm:text-[11px]">
                  <span className="sm:hidden">
                    {label.split(" ")[0]}
                    <br />
                    {label.split(" ")[1]}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
