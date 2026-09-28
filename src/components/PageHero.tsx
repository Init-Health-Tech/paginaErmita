import { CoverPhoto } from "@/components/CoverPhoto";

export function PageHero({
  eyebrow,
  title,
  src,
  alt,
}: {
  eyebrow: string;
  title: string;
  src: string;
  alt: string;
}) {
  return (
    <section className="relative h-[55vh] min-h-[22rem]">
      <CoverPhoto src={src} alt={alt} sizes="100vw" priority />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.12))]" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="shell pb-10 text-[var(--color-on-dark)] md:pb-14">
          <p className="eyebrow text-[var(--color-on-dark)]">{eyebrow}</p>
          <h1 className="display mt-4 max-w-[18ch]">{title}</h1>
        </div>
      </div>
    </section>
  );
}
