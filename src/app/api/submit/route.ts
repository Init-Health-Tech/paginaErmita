import { NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";
import { saveSubmission, type SubmissionType } from "@/lib/submissions";
import QRCode from "qrcode";

const TYPES: SubmissionType[] = ["alquiler", "retiros", "visitas"];

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Petición inválida", 400);
  }

  if (!body || typeof body !== "object" || !("type" in body)) {
    return jsonError("Falta el tipo de formulario", 400);
  }

  const type = (body as { type: string }).type;
  if (!TYPES.includes(type as SubmissionType)) {
    return jsonError("Tipo no reconocido", 400);
  }

  const payload = { ...(body as Record<string, unknown>) };
  delete payload.type;

  try {
    const record = await saveSubmission(type as SubmissionType, payload);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verificar/${record.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      color: {
        dark: "#2f241d",
        light: "#fbf8f3",
      },
      width: 280,
    });

    const label =
      type === "alquiler"
        ? "Alquiler para retiro"
        : type === "retiros"
          ? "Información sobre retiros"
          : "Visita";

    await sendNotificationEmail({
      subject: `[Ermita del Silencio] ${label}`,
      text: `Nueva solicitud (${record.id})\nFecha: ${record.createdAt}\n\n${JSON.stringify(payload, null, 2)}`,
    });

    return NextResponse.json({ ok: true, id: record.id, verifyUrl, qrDataUrl });
  } catch (e) {
    console.error(e);
    return jsonError("No se pudo guardar la solicitud. Intente más tarde.", 500);
  }
}
