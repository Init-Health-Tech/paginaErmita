import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Datos de contacto de la Ermita del Silencio.",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 md:py-24">
      <SectionTitle>Contacto</SectionTitle>
      <p className="mt-6 max-w-3xl text-pretty text-[var(--color-ermita-ink)]/75 leading-relaxed sm:mt-8 sm:leading-8">
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
      <address className="surface mt-10 max-w-2xl rounded-xl p-5 not-italic text-[var(--color-ermita-ink)] sm:mt-12 sm:rounded-2xl sm:p-8">
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
