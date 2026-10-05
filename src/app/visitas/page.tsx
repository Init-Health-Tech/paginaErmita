import type { Metadata } from "next";
import Link from "next/link";
import { Amenidades } from "@/components/Amenidades";
import { PageGallery } from "@/components/PageGallery";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { pageGalleries, pageHeroes } from "@/lib/homePhotos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Visitas",
  description: "Registro para visitar la Ermita del Silencio.",
};

const steps = [
  { title: "Regístrese con anticipación", text: "Al menos un día antes, para cuidar el silencio y el acceso." },
  { title: "Confirmamos disponibilidad", text: "Revisamos que no haya retiro ni impedimento pastoral ese día." },
  { title: "Presente su QR al llegar", text: "Recibirá un código de ingreso para mostrar en la casa." },
];

export default function VisitasPage() {
  return (
    <>
      <PageHero
        eyebrow="Visitas"
        title="Ven a conocer la Ermita"
        lead="Un espacio de oración abierto a quienes están en la zona, con registro previo para cuidar el silencio."
        src={pageHeroes.visitas.src}
        alt={pageHeroes.visitas.alt}
        cta={{ href: "/visitas/registro", label: "Registrar mi visita", newTab: true }}
      />

      <section className="band-bg section-pad">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow">Acceso</p>
              <h2 className="heading-2 mt-4 max-w-[16ch]">Un lugar de oración, con cuidado</h2>
              <p className="copy-wide mt-6 text-[var(--color-muted)]">
                La Ermita es ante todo un lugar de oración. Las visitas se coordinan para no interferir con los retiros ni con la vida
                comunitaria. Las visitas deben registrarse con al menos un día de anticipación para control de acceso. Verificaremos
                la disponibilidad y te confirmaremos tu ingreso.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ol className="border-t border-[var(--color-line)]">
                {steps.map((item, index) => (
                  <li key={item.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[var(--color-line)] py-5">
                    <span className="font-serif text-2xl font-light text-[var(--color-accent)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-[var(--color-muted)]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="mt-14 md:mt-16">
            <PageGallery photos={pageGalleries.visitas} />
          </div>
        </div>
      </section>

      <section className="band-sand section-pad">
        <div className="shell">
          <Amenidades />
        </div>
      </section>

      <section className="band-sage section-pad">
        <div className="shell">
          <Reveal>
            <p className="eyebrow">Registro</p>
            <h2 className="heading-2 mt-4 max-w-[14ch]">Registrar mi visita</h2>
            <p className="mt-5 max-w-[40ch] text-[var(--color-muted)]">
              Indique fecha y datos de contacto. Tras confirmar, recibirá un código QR para presentar al llegar.
            </p>
            <Link href="/visitas/registro" target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
              Registrar mi visita
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
