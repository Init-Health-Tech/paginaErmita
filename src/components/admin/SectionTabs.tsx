"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminPageHeader } from "./AdminPanel";
import { LEAVE_MESSAGE, UnsavedScope, useUnsavedDirty } from "./UnsavedChangesBar";

export type AdminTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

function resolveTab(tabs: AdminTab[], activeTab?: string) {
  return tabs.some((tab) => tab.id === activeTab) ? activeTab! : tabs[0].id;
}

function tabPath(pathname: string, id: string, firstId: string) {
  return id === firstId ? pathname : `${pathname}?tab=${encodeURIComponent(id)}`;
}

function SectionTabsView({
  title,
  description,
  tabs,
  activeTab,
}: {
  title: string;
  description: string;
  tabs: AdminTab[];
  activeTab?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { dirty, setDirty } = useUnsavedDirty();
  const resolved = resolveTab(tabs, activeTab);
  const [active, setActive] = useState(resolved);
  const expectedRef = useRef(resolved);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;

  useEffect(() => {
    const next = resolveTab(tabs, activeTab);
    if (next === expectedRef.current) return;
    if (dirtyRef.current && !window.confirm(LEAVE_MESSAGE)) {
      router.replace(tabPath(pathname, expectedRef.current, tabs[0].id), { scroll: false });
      return;
    }
    setDirty(false);
    expectedRef.current = next;
    setActive(next);
  }, [activeTab, pathname, router, setDirty, tabs]);

  function select(id: string) {
    if (id === active) return;
    if (dirty && !window.confirm(LEAVE_MESSAGE)) return;
    setDirty(false);
    expectedRef.current = id;
    setActive(id);
    router.replace(tabPath(pathname, id, tabs[0].id), { scroll: false });
  }

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <>
      <AdminPageHeader title={title} description={description} />
      <nav role="tablist" aria-label="Secciones" className="mt-8 flex gap-6 overflow-x-auto border-b border-[var(--color-line)]">
        {tabs.map((tab) => {
          const selected = tab.id === current.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              onClick={() => select(tab.id)}
              aria-selected={selected}
              className={`-mb-px shrink-0 border-b-2 pb-3 font-sans text-sm ${
                selected
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
      <div className="pt-10">{current.content}</div>
    </>
  );
}

export function SectionTabs(props: {
  title: string;
  description: string;
  tabs: AdminTab[];
  activeTab?: string;
}) {
  return (
    <UnsavedScope>
      <SectionTabsView {...props} />
    </UnsavedScope>
  );
}
