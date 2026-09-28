import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { cache } from "react";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import {
  defaultSiteContent,
  sanitizeSiteContent,
  type FormSection,
  type SiteContent,
} from "@/lib/contentModel";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "site-content.json");

async function readSiteContent(): Promise<SiteContent> {
  noStore();
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return sanitizeSiteContent(JSON.parse(raw));
  } catch (error) {
    const missing = typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
    if (missing) {
      const defaults = defaultSiteContent();
      await writeFile(DATA_FILE, JSON.stringify(defaults, null, 2), "utf-8");
      return defaults;
    }
    console.error("No se pudo leer la configuración del sitio", error);
    return defaultSiteContent();
  }
}

export const getSiteContent = cache(readSiteContent);

export async function writeSiteContent(content: SiteContent): Promise<SiteContent> {
  const safe = sanitizeSiteContent(content);
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(safe, null, 2), "utf-8");
  revalidatePath("/alquiler");
  revalidatePath("/retiros");
  revalidatePath("/visitas");
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
