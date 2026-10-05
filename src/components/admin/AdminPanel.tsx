import { adminMutedClass, adminPageTitleClass, adminSectionClass, adminSectionTitleClass } from "./styles";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className={adminPageTitleClass}>{title}</h1>
        {description ? <div className={`mt-4 max-w-2xl space-y-3 ${adminMutedClass}`}>{description}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

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
    <section className={adminSectionClass}>
      <h2 className={adminSectionTitleClass}>{title}</h2>
      {description ? <p className={`mt-3 max-w-3xl ${adminMutedClass}`}>{description}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function EditorStatus({ message, error }: { message: string; error: string }) {
  if (error) {
    return (
      <p className="text-sm text-[#8f5348]" role="alert">
        {error}
      </p>
    );
  }
  if (message) {
    return <p className="text-sm text-[var(--color-accent)]">{message}</p>;
  }
  return null;
}
