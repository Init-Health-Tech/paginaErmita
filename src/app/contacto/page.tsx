import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto de la Ermita del Silencio.",
};

export default function ContactoPage() {
  return (
    <div className="shell section-pad">
      <p className="eyebrow">Contacto</p>
      <h1 className="heading-2 mt-4">Contacto</h1>
      <p className="intro-copy mt-8">
        Sustituya los datos siguientes por la dirección, teléfono y correo reales de la comunidad. También puede usar los formularios de{" "}
        <Link href="/alquiler" className="link-arrow">
          alquiler
        </Link>
        ,{" "}
        <Link href="/retiros" className="link-arrow">
          retiros
        </Link>{" "}
        o{" "}
        <Link href="/visitas" className="link-arrow">
          visitas
        </Link>
        .
      </p>
      <address className="mt-12 max-w-[42ch] border-t border-[var(--color-line)] pt-8 not-italic">
        <p className="font-medium">Ermita del Silencio</p>
        <p className="mt-2 text-[var(--color-muted)]">[Dirección postal]</p>
        <p className="mt-2 text-[var(--color-muted)]">Tel.: [número]</p>
        <p className="mt-2 text-[var(--color-muted)]">
          Correo: <a href="mailto:contacto@ermita-ejemplo.org">contacto@ermita-ejemplo.org</a>
        </p>
      </address>
    </div>
  );
}
