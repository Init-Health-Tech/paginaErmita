export function SectionTitle({
  children,
  as: Tag = "h1",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={`font-[family-name:var(--font-serif)] text-[clamp(1.85rem,5.2vw+0.6rem,3.15rem)] font-medium leading-[1.12] tracking-[0.02em] text-[var(--color-text)] sm:leading-tight md:text-5xl ${className}`}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {children}
      <span
        className="mt-4 inline-block h-[3px] w-16 max-w-full rounded-full bg-gradient-to-r from-transparent via-[var(--color-accent-gold)]/80 to-transparent sm:mt-5 sm:w-[4.5rem]"
        aria-hidden
      />
    </Tag>
  );
}
