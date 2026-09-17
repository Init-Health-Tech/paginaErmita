import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getGuardAccessPath } from "@/lib/guardAccess";
import { getDailyVisitStats, listSubmissions } from "@/lib/submissions";

export const metadata: Metadata = {
  title: "Panel administrador",
};

export default async function AdminPage() {
  const authorized = await isAdminAuthenticated();

  if (!authorized) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-5 sm:py-16">
        <section className="surface rounded-sm p-5 sm:p-8">
          <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
            Panel de administracion
          </h1>
          <p className="mt-3 text-sm text-[var(--color-ermita-muted)]">
            Acceso restringido. Ingrese su clave para consultar registros y estadisticas.
          </p>
          <div className="mt-6">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    );
  }

  const rows = await listSubmissions();
  const stats = await getDailyVisitStats(14);
  const visitsToday = stats.at(-1)?.visits ?? 0;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const guardPath = getGuardAccessPath();
  const guardUrl = siteUrl ? `${siteUrl}${guardPath}` : guardPath;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5 sm:py-10">
      <header className="surface rounded-sm p-4 sm:p-6">
        <h1 className="font-[family-name:var(--font-serif)] text-3xl text-[var(--color-ermita-brown)]" style={{ fontFamily: "var(--font-serif)" }}>
          Panel administrador
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ermita-muted)]">
          Registros totales: <strong>{rows.length}</strong> - Visitas registradas hoy: <strong>{visitsToday}</strong>
        </p>
        <p className="mt-3 break-all text-xs text-[var(--color-ermita-muted)]">
          Lista de acceso para guardias (no compartir en público):{" "}
          <a href={guardPath} className="underline underline-offset-4">
            {guardUrl}
          </a>
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <a
            href="/api/admin/submissions?format=csv"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-ermita-brown)] bg-[var(--color-ermita-brown)] px-4 py-2 text-center text-sm text-white sm:min-h-0"
          >
            Descargar registros (CSV)
          </a>
          <a
            href="/api/admin/logout"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-[var(--color-ermita-line)] bg-[var(--color-ermita-paper)] px-4 py-2 text-center text-sm sm:min-h-0"
          >
            Cerrar sesion
          </a>
        </div>
      </header>

      <section className="mt-6 surface rounded-sm p-4 sm:mt-8 sm:p-6">
        <h2 className="text-lg font-semibold text-[var(--color-ermita-ink)]">Estadisticas diarias (ultimos 14 dias)</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:grid-cols-7">
          {stats.map((item) => (
            <div key={item.date} className="rounded-sm border border-[var(--color-ermita-line)] bg-white px-3 py-2">
              <p className="text-xs text-[var(--color-ermita-muted)]">{item.date}</p>
              <p className="mt-1 text-xl text-[var(--color-ermita-brown)]">{item.visits}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 surface rounded-sm p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--color-ermita-line)] bg-[var(--color-ermita-brown-soft)]">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const nombre = String(row.payload.nombre ?? "-");
                const email = String(row.payload.email ?? "-");
                const visitDate = row.type === "visitas" ? String(row.payload.fecha_preferida ?? "") : "";
                return (
                  <tr key={row.id} className="border-b border-[var(--color-ermita-line)]/70">
                    <td className="px-4 py-3 text-[var(--color-ermita-muted)]">
                      {new Date(row.createdAt).toLocaleString("es-MX")}
                      {visitDate ? <span className="mt-1 block text-xs">Visita: {visitDate}</span> : null}
                    </td>
                    <td className="px-4 py-3 capitalize">{row.type}</td>
                    <td className="px-4 py-3">{nombre}</td>
                    <td className="px-4 py-3">{email}</td>
                    <td className="px-4 py-3 capitalize">{row.status ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
