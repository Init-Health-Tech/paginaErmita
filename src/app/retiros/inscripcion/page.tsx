import type { Metadata } from "next";
import Link from "next/link";
import { FormRetiros } from "@/components/FormRetiros";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inscripción a un retiro",
  description: "Inscripción e información sobre retiros espirituales en la Ermita del Silencio.",
};

type Props = {
  searchParams: Promise<{ retiro?: string }>;
};

export default async function InscripcionRetiroPage({ searchParams }: Props) {
  const { retiro = "" } = await searchParams;

  return (
    <article className="band-bg">
      <div className="mx-auto w-full max-w-[40rem] px-5 py-[clamp(3rem,8vw,5.5rem)] sm:px-6">
        <h1 className="heading-2 text-[var(--color-text)]">Inscripción a un retiro</h1>
        <p className="mt-4 text-[var(--color-text)]">
          Indique el retiro de su interés o deje sus datos para enterarse de próximas fechas.
        </p>
        <div className="mt-12">
          <FormRetiros key={retiro} initialRetiro={retiro} />
        </div>
        <p className="mt-12">
          <Link
            href="/retiros"
            className="text-sm text-[var(--color-muted)] underline decoration-1 underline-offset-[6px] hover:text-[var(--color-accent)]"
          >
            Volver a Retiros
          </Link>
        </p>
      </div>
    </article>
  );
}
