import Link from "next/link";

export function FinalCta() {
  return (
    <section className="bg-[var(--color-dark)] text-[var(--color-on-dark)]">
      <div className="shell section-pad text-center">
        <h2 className="heading-2">Te esperamos en el silencio</h2>
        <p className="mx-auto mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed">
          Un lugar para la oración y el recogimiento, al servicio de quien busca detenerse.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link href="/retiros" className="btn-inverted">
            Próximos retiros
          </Link>
          <Link href="/visitas" className="link-arrow link-on-dark">
            Registrar visita
            <span className="arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
