import type { Metadata } from "next";
import { FormRetiros } from "@/components/FormRetiros";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Retiros",
  description: "Información y convocatorias de retiros espirituales en la Ermita del Silencio.",
};

export default function RetirosPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
      <SectionTitle>Retiros</SectionTitle>
      <p className="mt-8 max-w-3xl text-[var(--color-ermita-ink)]/75 leading-8">
        Los retiros se anuncian con tiempo y se viven en un clima de recogimiento y escucha de la Palabra. Si desea recibir información
        sobre próximas convocatorias o materiales de espiritualidad, puede dejarnos sus datos. Trataremos su información con respeto y
        solo para este fin.
      </p>
      <div className="surface mt-12 rounded-2xl p-7 sm:p-10">
        <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-ermita-muted)]">Solicitar información</h2>
        <div className="mt-7">
          <FormRetiros />
        </div>
      </div>
    </div>
  );
}
