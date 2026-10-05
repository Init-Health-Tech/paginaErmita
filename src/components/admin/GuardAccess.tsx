"use client";

import { useEffect, useState } from "react";
import { adminSecondaryButtonClass } from "./styles";

export function GuardAccess({ url, href }: { url: string; href: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" className={adminSecondaryButtonClass} onClick={copy} aria-live="polite">
        {copied ? "Copiado ✓" : "Copiar enlace"}
      </button>
      <a href={href} className={adminSecondaryButtonClass}>
        Abrir
      </a>
    </div>
  );
}
