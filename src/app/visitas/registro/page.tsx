import type { Metadata } from "next";
import Link from "next/link";
import { FormVisitas } from "@/components/FormVisitas";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Registro de visita",
  description: "Registro para visitar la Ermita del Silencio.",
};

export default function RegistroVisitaPage() {
  return (
    <article className="band-bg">
      <div className="mx-auto w-full max-w-[40rem] px-5 py-[clamp(3rem,8vw,5.5rem)] sm:px-6">
        <h1 className="heading-2 text-[var(--color-text)]">Registro de visita</h1>
        <p className="mt-4 text-[var(--color-text)]">
          Indique fecha y datos de contacto. Tras confirmar, recibirá un código QR para presentar al llegar.
        </p>
        <div className="mt-12">
          <FormVisitas />
        </div>
        <p className="mt-12">
          <Link
            href="/visitas"
            className="text-sm text-[var(--color-muted)] underline decoration-1 underline-offset-[6px] hover:text-[var(--color-accent)]"
          >
            Volver a Visitas
          </Link>
        </p>
      </div>
    </article>
  );
}
