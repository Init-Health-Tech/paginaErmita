export type AdminTableRow = {
  id: string;
  type: "alquiler" | "retiros" | "visitas";
  createdAt: string;
  nombre: string;
  email: string;
  status: string;
  visitDate: string;
  retreatId: string;
  qrDataUrl: string;
  verifyUrl: string;
};

export function toAdminTableRow(row: {
  id: string;
  type: "alquiler" | "retiros" | "visitas";
  createdAt: string;
  payload: Record<string, unknown>;
  status?: string;
  qrDataUrl?: string;
  verifyUrl?: string;
}): AdminTableRow {
  return {
    id: row.id,
    type: row.type,
    createdAt: row.createdAt,
    nombre: String(row.payload.nombre ?? "—"),
    email: String(row.payload.email ?? "—"),
    status: row.status ?? "",
    visitDate: row.type === "visitas" ? String(row.payload.fecha_preferida ?? "") : "",
    retreatId: String(row.payload.retiro_interes ?? ""),
    qrDataUrl: row.qrDataUrl ?? "",
    verifyUrl: row.verifyUrl ?? "",
  };
}
