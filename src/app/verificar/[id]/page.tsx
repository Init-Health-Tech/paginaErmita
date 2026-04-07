import type { Metadata } from "next";
import Link from "next/link";
import { getSubmissionById } from "@/lib/submissions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Verificacion de registro",
};

export default async function VerificarRegistroPage({ params }: Props) {
  const { id } = await params;
  const item = await getSubmissionById(id);

  if (!item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5 sm:py-16">
        <section className="surface rounded-sm p-5 sm:p-8">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
            Registro no encontrado
          </h1>
          <p className="mt-4 text-[var(--color-ermita-muted)]">
            Este codigo no corresponde a un registro valido en la Ermita del Silencio.
          </p>
          <Link href="/" className="mt-6 inline-block text-sm underline underline-offset-4">
            Volver al inicio
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-5 sm:py-16">
      <section className="surface rounded-sm p-5 sm:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ermita-muted)]">Ermita del Silencio</p>
        <h1 className="mt-3 font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Registro verificado
        </h1>
        <p className="mt-4 text-[var(--color-ermita-muted)]">
          Este registro existe y fue recibido correctamente.
        </p>
        <dl className="mt-6 grid grid-cols-1 gap-2 text-sm">
          <div>
            <dt className="font-medium text-[var(--color-ermita-ink)]">Codigo</dt>
            <dd className="text-[var(--color-ermita-muted)]">{item.id}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-ermita-ink)]">Tipo</dt>
            <dd className="capitalize text-[var(--color-ermita-muted)]">{item.type}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-ermita-ink)]">Fecha de registro</dt>
            <dd className="text-[var(--color-ermita-muted)]">{new Date(item.createdAt).toLocaleString("es-MX")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
