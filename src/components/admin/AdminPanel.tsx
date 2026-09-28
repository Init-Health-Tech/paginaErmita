export function AdminPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface mt-6 rounded-sm p-4 sm:mt-8 sm:p-6">
      <h2 className="text-2xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--color-ermita-muted)]">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function EditorStatus({ message, error }: { message: string; error: string }) {
  if (error) {
    return (
      <p className="text-sm text-red-800" role="alert">
        {error}
      </p>
    );
  }
  if (message) {
    return <p className="text-sm text-[var(--color-ermita-brown)]">{message}</p>;
  }
  return null;
}
