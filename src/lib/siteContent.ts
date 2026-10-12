import { cache } from "react";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
  defaultSiteContent,
  sanitizeSiteContent,
  type FormSection,
  type SiteContent,
} from "@/lib/contentModel";
import { prisma } from "@/lib/db";

const SITE_CONTENT_ID = "default";

async function readSiteContent(): Promise<SiteContent> {
  noStore();
  try {
    const row = await prisma.siteContent.findUnique({ where: { id: SITE_CONTENT_ID } });
    if (!row) return defaultSiteContent();
    return sanitizeSiteContent(row.data);
  } catch (error) {
    console.error("No se pudo leer la configuración del sitio", error);
    return defaultSiteContent();
  }
}

export const getSiteContent = cache(readSiteContent);

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const safe = sanitizeSiteContent(content);
  const data = JSON.parse(JSON.stringify(safe)) as Prisma.InputJsonValue;
  await prisma.siteContent.upsert({
    where: { id: SITE_CONTENT_ID },
    create: { id: SITE_CONTENT_ID, data },
    update: { data },
  });
  revalidatePath("/alquiler");
  revalidatePath("/alquiler/solicitud");
  revalidatePath("/retiros");
  revalidatePath("/retiros/inscripcion");
  revalidatePath("/visitas");
  revalidatePath("/visitas/registro");
  revalidatePath("/admin");
  revalidatePath("/admin/alquiler");
  revalidatePath("/admin/retiros");
  revalidatePath("/admin/visitas");
  return safe;
}

export async function getFormFields(section: FormSection) {
  const content = await getSiteContent();
  return content.forms[section];
}

export async function getRentalCosts() {
  const content = await getSiteContent();
  return content.costs;
}

export async function listAmenities() {
  const content = await getSiteContent();
  return content.amenities;
}

export async function listRetreats() {
  const content = await getSiteContent();
  return content.retreats;
}
