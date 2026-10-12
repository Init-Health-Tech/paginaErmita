import { readFile } from "fs/promises";
import path from "path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { defaultSiteContent, sanitizeSiteContent } from "../src/lib/contentModel";
import { visitColumnsFromPayload } from "../src/lib/visitColumns";

const prisma = new PrismaClient();
const SITE_CONTENT_ID = "default";
const SUBMISSION_TYPES = new Set(["alquiler", "retiros", "visitas"]);
const VISIT_STATUSES = new Set(["confirmado", "pendiente"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function seedSubmissions(): Promise<void> {
  const file = path.join(process.cwd(), "data", "submissions.json");
  let raw: string;
  try {
    raw = await readFile(file, "utf-8");
  } catch (error) {
    if (isMissingFile(error)) {
      console.log("No hay data/submissions.json; no se importan solicitudes.");
      return;
    }
    throw error;
  }

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("data/submissions.json debe ser un arreglo");
  }

  let created = 0;
  let existing = 0;
  for (const item of parsed) {
    if (!isRecord(item)) throw new Error("Hay una solicitud inválida en data/submissions.json");
    const id = item.id;
    const type = item.type;
    const createdAtRaw = item.createdAt;
    if (typeof id !== "string" || !id) throw new Error("Hay una solicitud sin id");
    if (typeof type !== "string" || !SUBMISSION_TYPES.has(type)) {
      throw new Error(`Tipo no reconocido en la solicitud ${id}`);
    }
    if (typeof createdAtRaw !== "string") throw new Error(`La solicitud ${id} no tiene createdAt`);
    const createdAt = new Date(createdAtRaw);
    if (Number.isNaN(createdAt.getTime())) throw new Error(`createdAt inválido en la solicitud ${id}`);

    const payload = isRecord(item.payload) ? item.payload : {};
    const status = typeof item.status === "string" && VISIT_STATUSES.has(item.status) ? item.status : null;
    const { visitDate, visitTime } = visitColumnsFromPayload(type, payload);
    const found = await prisma.submission.findUnique({ where: { id }, select: { id: true } });
    await prisma.submission.upsert({
      where: { id },
      update: {},
      create: {
        id,
        type: type as "alquiler" | "retiros" | "visitas",
        createdAt,
        status: status as "confirmado" | "pendiente" | null,
        payload: JSON.parse(JSON.stringify(payload)) as Prisma.InputJsonValue,
        qrDataUrl: typeof item.qrDataUrl === "string" ? item.qrDataUrl : null,
        verifyUrl: typeof item.verifyUrl === "string" ? item.verifyUrl : null,
        visitDate,
        visitTime,
      },
    });
    if (found) existing += 1;
    else created += 1;
  }

  console.log(`Solicitudes: ${created} nuevas, ${existing} ya existían.`);
}

async function seedContent(): Promise<void> {
  const file = path.join(process.cwd(), "data", "site-content.json");
  let content = defaultSiteContent();
  try {
    const raw = await readFile(file, "utf-8");
    content = sanitizeSiteContent(JSON.parse(raw));
    console.log("Contenido importado desde data/site-content.json.");
  } catch (error) {
    if (!isMissingFile(error)) throw error;
    console.log("No hay data/site-content.json; se usan los valores por defecto.");
  }

  const found = await prisma.siteContent.findUnique({ where: { id: SITE_CONTENT_ID }, select: { id: true } });
  await prisma.siteContent.upsert({
    where: { id: SITE_CONTENT_ID },
    update: {},
    create: {
      id: SITE_CONTENT_ID,
      data: JSON.parse(JSON.stringify(content)) as Prisma.InputJsonValue,
    },
  });
  console.log(found ? "El contenido del sitio ya existía; no se sobrescribió." : "Contenido del sitio creado.");
}

async function main(): Promise<void> {
  await seedSubmissions();
  await seedContent();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
