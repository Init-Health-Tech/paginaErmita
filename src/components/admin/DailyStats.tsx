export function DailyStats({ stats }: { stats: Array<{ date: string; visits: number }> }) {
  return (
    <section className="surface mt-6 rounded-sm p-4 sm:mt-8 sm:p-6">
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
  );
}
