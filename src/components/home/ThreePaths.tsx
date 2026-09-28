import Link from "next/link";
import { CoverPhoto } from "@/components/CoverPhoto";
import { pathPhotos } from "@/lib/homePhotos";

const paths = [
  {
    eyebrow: "01 — Alquiler",
    title: "Rentar la casa para tu grupo",
    text: "Renta del espacio completo para parroquias, movimientos y comunidades. La casa ofrece capilla, comedor y cuartos para un tiempo de oración en silencio.",
    href: "/alquiler",
    link: "Conocer más",
    photo: pathPhotos.alquiler,
  },
  {
    eyebrow: "02 — Retiros",
    title: "Retiros a lo largo del año",
    text: "Retiros organizados por la Ermita en distintas fechas, vividos en un clima de recogimiento y escucha de la Palabra.",
    href: "/retiros",
    link: "Ver próximos retiros",
    photo: pathPhotos.retiros,
  },
  {
    eyebrow: "03 — Visitas",
    title: "Ven a conocer la Ermita",
    text: "Para quienes están en la zona. El registro se hace con un día de anticipación, para cuidar el silencio de la casa y el acceso.",
    href: "/visitas",
    link: "Registrar visita",
    photo: pathPhotos.visitas,
  },
];

export function ThreePaths() {
  return (
    <section className="section-pad pt-0">
      <div className="shell flex flex-col gap-20 md:gap-28">
        {paths.map((item, index) => {
          const reverse = index % 2 === 1;
          return (
            <article key={item.href} className="grid items-center gap-8 md:grid-cols-12 md:gap-16">
              <figure className={`md:col-span-7 ${reverse ? "md:order-2" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden">
                  <CoverPhoto src={item.photo.src} alt={item.photo.alt} sizes="(min-width: 768px) 58vw, 100vw" />
                </div>
              </figure>
              <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`}>
                <p className="eyebrow">{item.eyebrow}</p>
                <h3 className="heading-3 mt-4">{item.title}</h3>
                <p className="mt-4 text-[var(--color-muted)]">{item.text}</p>
                <Link href={item.href} className="link-arrow mt-6">
                  {item.link}
                  <span className="arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
