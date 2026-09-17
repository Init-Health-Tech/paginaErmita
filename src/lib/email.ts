import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

type MailPayload = {
  to?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Attachment[];
};

function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM ?? user;
  return { host, port, user, pass, from };
}

function isSmtpReady() {
  const { host, user, pass, from } = smtpConfig();
  return Boolean(host && user && pass && from);
}

async function sendMail(payload: MailPayload): Promise<boolean> {
  const { host, port, user, pass, from } = smtpConfig();
  const to = payload.to;
  if (!host || !user || !pass || !from || !to) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    attachments: payload.attachments,
  });
  return true;
}

export async function sendNotificationEmail(payload: { subject: string; text: string }): Promise<void> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to || !isSmtpReady()) {
    return;
  }
  await sendMail({ ...payload, to });
}

export async function sendVisitorQrEmail(opts: {
  to: string;
  nombre: string;
  fecha: string;
  personas: string;
  id: string;
  verifyUrl: string;
  qrDataUrl: string;
}): Promise<boolean> {
  if (!isSmtpReady()) {
    return false;
  }

  const base64 = opts.qrDataUrl.includes(",") ? opts.qrDataUrl.split(",")[1] : "";
  const attachments: Attachment[] = [];
  if (base64) {
    attachments.push({
      filename: "qr-visita.png",
      content: Buffer.from(base64, "base64"),
      cid: "visita-qr",
      contentType: "image/png",
    });
  }

  const text = [
    `Paz y bien, ${opts.nombre}.`,
    "",
    "Su visita a la Ermita del Silencio quedó registrada.",
    `Fecha: ${opts.fecha}`,
    `Personas: ${opts.personas}`,
    `Código: ${opts.id}`,
    `Verificación: ${opts.verifyUrl}`,
    "",
    "Presente el código QR adjunto al llegar.",
  ].join("\n");

  const html = `
    <p>Paz y bien, ${opts.nombre}.</p>
    <p>Su visita a la Ermita del Silencio quedó registrada.</p>
    <p>
      Fecha: ${opts.fecha}<br />
      Personas: ${opts.personas}<br />
      Código: ${opts.id}
    </p>
    ${attachments.length ? '<p><img src="cid:visita-qr" alt="Código QR de visita" width="180" height="180" /></p>' : ""}
    <p>Presente este código QR al llegar. También puede verificarlo en:<br />
    <a href="${opts.verifyUrl}">${opts.verifyUrl}</a></p>
  `;

  return sendMail({
    to: opts.to,
    subject: "Registro de visita — Ermita del Silencio",
    text,
    html,
    attachments,
  });
}
