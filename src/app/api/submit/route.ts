import { NextResponse } from "next/server";
import { sendNotificationEmail, sendVisitorQrEmail } from "@/lib/email";
import { saveSubmission, type SubmissionType } from "@/lib/submissions";
import { isAtLeastOneDayAhead, parseISODate } from "@/lib/dates";
import { isDateBlockedForVisits } from "@/lib/visitAvailability";
import { visitDateField, type FormSection } from "@/lib/contentModel";
import { getFormFields } from "@/lib/siteContent";
import QRCode from "qrcode";

const TYPES: SubmissionType[] = ["alquiler", "retiros", "visitas"];

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function buildQr(verifyUrl: string) {
  return QRCode.toDataURL(verifyUrl, {
    margin: 1,
    color: {
      dark: "#2f241d",
      light: "#fbf8f3",
    },
    width: 280,
  });
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
    const fields = await getFormFields(type as FormSection);
    for (const field of fields) {
      const value = payload[field.id] == null ? "" : String(payload[field.id]).trim();
      payload[field.id] = value;
      if (field.required && !value) {
        return jsonError(`Complete el campo: ${field.label}`, 400);
      }
      if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return jsonError("Indique un correo electrónico válido.", 400);
      }
    }

    if (type === "visitas") {
      const dateField = visitDateField(fields);
      const rawDate = dateField ? String(payload[dateField.id] ?? "") : "";
      if (dateField && rawDate) {
        const requestedDate = parseISODate(rawDate);
        if (!requestedDate) {
          return jsonError("Indique una fecha válida (AAAA-MM-DD).", 400);
        }
        if (!isAtLeastOneDayAhead(requestedDate)) {
          return jsonError("Las visitas deben registrarse con al menos un día de anticipación. Elija otra fecha.", 400);
        }
        if (await isDateBlockedForVisits(requestedDate)) {
          return jsonError("Esa fecha no está disponible para visitas, por favor elige otra fecha", 409);
        }
        payload[dateField.id] = requestedDate;
        payload.fecha_preferida = requestedDate;
      }
    }

    const id = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/verificar/${id}`;
    const qrDataUrl = type === "visitas" ? await buildQr(verifyUrl) : undefined;

    const record = await saveSubmission(
      type as SubmissionType,
      payload,
      type === "visitas"
        ? {
            id,
            qrDataUrl,
            verifyUrl,
            status: "confirmado",
          }
        : { id }
    );

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

    let emailSent = false;
    if (type === "visitas" && typeof payload.email === "string" && qrDataUrl) {
      try {
        emailSent = await sendVisitorQrEmail({
          to: payload.email,
          nombre: String(payload.nombre ?? ""),
          fecha: String(payload.fecha_preferida ?? ""),
          personas: String(payload.personas ?? ""),
          id: record.id,
          verifyUrl,
          qrDataUrl,
        });
      } catch (error) {
        console.error(error);
      }
    }

    return NextResponse.json({
      ok: true,
      id: record.id,
      verifyUrl,
      qrDataUrl: qrDataUrl ?? null,
      emailSent,
      status: record.status ?? null,
    });
  } catch (e) {
    console.error(e);
    return jsonError("No se pudo guardar la solicitud. Intente más tarde.", 500);
  }
}
