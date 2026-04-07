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
      className={`font-[family-name:var(--font-serif)] text-4xl font-normal leading-tight tracking-[0.02em] text-[var(--color-ermita-ink)] sm:text-5xl ${className}`}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {children}
    </Tag>
  );
}
