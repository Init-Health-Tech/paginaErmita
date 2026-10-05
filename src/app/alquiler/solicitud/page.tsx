import type { Metadata } from "next";
import Link from "next/link";
import { FormAlquiler } from "@/components/FormAlquiler";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Solicitud de alquiler",
  description: "Solicitud de alquiler de la Ermita del Silencio para retiros espirituales de grupos católicos.",
};

export default function SolicitudAlquilerPage() {
  return (
    <article className="band-bg">
      <div className="mx-auto w-full max-w-[40rem] px-5 py-[clamp(3rem,8vw,5.5rem)] sm:px-6">
        <h1 className="heading-2 text-[var(--color-text)]">Solicitud de alquiler</h1>
        <p className="mt-4 text-[var(--color-text)]">
          Cuéntenos sobre su grupo y las fechas deseadas. Le responderemos para confirmar disponibilidad.
        </p>
        <div className="mt-12">
          <FormAlquiler />
        </div>
        <p className="mt-12">
          <Link
            href="/alquiler"
            className="text-sm text-[var(--color-muted)] underline decoration-1 underline-offset-[6px] hover:text-[var(--color-accent)]"
          >
            Volver a Alquiler
          </Link>
        </p>
      </div>
    </article>
  );
}
