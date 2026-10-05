import Link from "next/link";
import { CoverPhoto } from "@/components/CoverPhoto";

export function PageHero({
  eyebrow,
  title,
  lead,
  src,
  alt,
  cta,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  src: string;
  alt: string;
  cta?: { href: string; label: string; newTab?: boolean };
}) {
  return (
    <section className="relative h-[68vh] min-h-[26rem] overflow-hidden md:h-[78vh] md:min-h-[32rem]">
      <CoverPhoto src={src} alt={alt} sizes="100vw" priority className="scale-[1.02]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.12)_100%)]" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="shell pb-14 text-[var(--color-on-dark)] md:pb-20">
          <p className="eyebrow text-[var(--color-on-dark)]">{eyebrow}</p>
          <h1 className="display mt-4 max-w-[16ch]">{title}</h1>
          {lead ? <p className="mt-5 max-w-[38ch] text-[1.125rem] leading-relaxed text-[color-mix(in_srgb,var(--color-on-dark)_88%,transparent)]">{lead}</p> : null}
          {cta ? (
            <div className="mt-8">
              <Link
                href={cta.href}
                className="btn-primary"
                target={cta.newTab ? "_blank" : undefined}
                rel={cta.newTab ? "noopener noreferrer" : undefined}
              >
                {cta.label}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2" aria-hidden>
        <span className="scroll-line" />
      </div>
    </section>
  );
}
