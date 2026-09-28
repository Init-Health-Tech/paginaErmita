"use client";

import { useState } from "react";
import type { AdminTableRow } from "@/lib/adminRows";
import { SubmissionsTable } from "./SubmissionsTable";
import { adminInputClass } from "./styles";

export function RetreatRecords({
  rows,
  retreats,
}: {
  rows: AdminTableRow[];
  retreats: { id: string; name: string }[];
}) {
  const [retreatId, setRetreatId] = useState("todos");
  const filtered = retreatId === "todos" ? rows : rows.filter((row) => row.retreatId === retreatId);

  return (
    <div>
      <div className="mt-4 max-w-sm">
        <label htmlFor="filtro-retiro" className="block text-sm font-medium text-[var(--color-ermita-ink)]">
          Filtrar por retiro
        </label>
        <select
          id="filtro-retiro"
          className={adminInputClass}
          value={retreatId}
          onChange={(event) => setRetreatId(event.target.value)}
        >
          <option value="todos">Todos los retiros</option>
          {retreats.map((retreat) => (
            <option key={retreat.id} value={retreat.id}>
              {retreat.name}
            </option>
          ))}
          <option value="otro">Otro / futuras fechas</option>
        </select>
      </div>
      <p className="mt-3 text-sm text-[var(--color-ermita-muted)]">{filtered.length} registros</p>
      <SubmissionsTable rows={filtered} mode="retiros" retreats={retreats} className="mt-4" />
    </div>
  );
}
