"use client";

import { useState } from "react";
import type { AdminTableRow } from "@/lib/adminRows";
import { SubmissionsTable } from "./SubmissionsTable";
import { adminInputClass } from "./styles";

export function RetreatRecords({
  rows,
  retreats,
  className = "",
}: {
  rows: AdminTableRow[];
  retreats: { id: string; name: string }[];
  className?: string;
}) {
  const [retreatId, setRetreatId] = useState("todos");
  const filtered = retreatId === "todos" ? rows : rows.filter((row) => row.retreatId === retreatId);

  return (
    <SubmissionsTable
      className={className}
      title="Registro de retiros pasados"
      rows={filtered}
      mode="retiros"
      retreats={retreats}
      csvHref="/api/admin/submissions?format=csv&type=retiros"
      beforeTable={
        <div className="w-full max-w-sm">
          <label htmlFor="filtro-retiro" className="block text-sm text-[var(--color-text)]">
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
      }
    />
  );
}
