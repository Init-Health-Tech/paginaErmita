"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const LEAVE_MESSAGE = "Tienes cambios sin guardar. ¿Salir sin guardar?";

const UnsavedContext = createContext<{
  dirty: boolean;
  setDirty: (value: boolean) => void;
}>({
  dirty: false,
  setDirty: () => {},
});

export function UnsavedScope({ children }: { children: React.ReactNode }) {
  const [dirty, setDirty] = useState(false);
  return <UnsavedContext.Provider value={{ dirty, setDirty }}>{children}</UnsavedContext.Provider>;
}

export function useUnsavedDirty() {
  return useContext(UnsavedContext);
}

export function useConfirmOnLeave(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (window.confirm(LEAVE_MESSAGE)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
}

export function UnsavedChangesBar({
  visible,
  saving,
  onDiscard,
  onSave,
}: {
  visible: boolean;
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cambios sin guardar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-line)] bg-[var(--color-bg)] md:left-60"
    >
      <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-center gap-x-3 gap-y-2 px-6 py-3 text-sm text-[var(--color-text)] md:px-12">
        <p>Tienes cambios sin guardar</p>
        <span className="text-[var(--color-muted)]" aria-hidden>
          ·
        </span>
        <button
          type="button"
          onClick={onDiscard}
          disabled={saving}
          className="underline-offset-4 hover:underline disabled:opacity-40"
        >
          Descartar
        </button>
        <span className="text-[var(--color-muted)]" aria-hidden>
          ·
        </span>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="font-medium text-[var(--color-accent)] underline-offset-4 hover:underline disabled:opacity-40"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
