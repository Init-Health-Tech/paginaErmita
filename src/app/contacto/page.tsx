import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto de la Ermita del Silencio.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <h1
        className="font-[family-name:var(--font-serif)] text-4xl font-normal tracking-[0.02em] text-[var(--color-ermita-ink)] sm:text-5xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        Contacto
      </h1>
      <p className="mt-8 max-w-3xl text-[var(--color-ermita-ink)]/75 leading-8">
        Sustituya los datos siguientes por la dirección, teléfono y correo reales de la comunidad. También puede usar los formularios de{" "}
        <Link href="/alquiler" className="underline underline-offset-4 transition-colors hover:text-[var(--color-ermita-ink)]">
          alquiler
        </Link>
        ,{" "}
        <Link href="/retiros" className="underline underline-offset-4 transition-colors hover:text-[var(--color-ermita-ink)]">
          retiros
        </Link>{" "}
        o{" "}
        <Link href="/visitas" className="underline underline-offset-4 transition-colors hover:text-[var(--color-ermita-ink)]">
          visitas
        </Link>
        .
      </p>
      <address className="surface mt-12 max-w-2xl rounded-2xl p-8 not-italic text-[var(--color-ermita-ink)]">
        <p className="font-medium">Ermita del Silencio</p>
        <p className="mt-2 text-[var(--color-ermita-muted)]">[Dirección postal]</p>
        <p className="mt-2 text-[var(--color-ermita-muted)]">Tel.: [número]</p>
        <p className="mt-2 text-[var(--color-ermita-muted)]">
          Correo: <a href="mailto:contacto@ermita-ejemplo.org">contacto@ermita-ejemplo.org</a>
        </p>
      </address>
    </div>
  );
}
