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
    newTab: false,
    photo: pathPhotos.alquiler,
  },
  {
    eyebrow: "02 — Retiros",
    title: "Retiros a lo largo del año",
    text: "Retiros organizados por la Ermita en distintas fechas, vividos en un clima de recogimiento y escucha de la Palabra.",
    href: "/retiros",
    link: "Ver próximos retiros",
    newTab: false,
    photo: pathPhotos.retiros,
  },
  {
    eyebrow: "03 — Visitas",
    title: "Ven a conocer la Ermita",
    text: "Para quienes están en la zona. El registro se hace con un día de anticipación, para cuidar el silencio de la casa y el acceso.",
    href: "/visitas/registro",
    link: "Registrar visita",
    newTab: true,
    photo: pathPhotos.visitas,
  },
];

export function ThreePaths() {
  return (
    <section className="band-sand section-pad">
      <div className="path-stack">
        {paths.map((item, index) => {
          const reverse = index % 2 === 1;
          return (
            <article key={item.href} className={reverse ? "path-row path-row-reverse" : "path-row"}>
              <figure className="path-photo">
                <div className="relative aspect-[4/5] max-h-[68vh] w-full overflow-hidden">
                  <CoverPhoto src={item.photo.src} alt={item.photo.alt} sizes="(min-width: 768px) 58vw, 100vw" />
                </div>
              </figure>
              <div className="path-copy">
                <p className="eyebrow">{item.eyebrow}</p>
                <h3 className="heading-3 mt-4">{item.title}</h3>
                <p className="mt-4 text-[var(--color-muted)]">{item.text}</p>
                <Link
                  href={item.href}
                  className="link-arrow mt-6"
                  target={item.newTab ? "_blank" : undefined}
                  rel={item.newTab ? "noopener noreferrer" : undefined}
                >
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
