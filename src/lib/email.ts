import nodemailer from "nodemailer";

type MailPayload = {
  subject: string;
  text: string;
};

export async function sendNotificationEmail(payload: MailPayload): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_EMAIL;

  if (!host || !user || !pass || !to) {
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to,
    subject: payload.subject,
    text: payload.text,
  });
}
