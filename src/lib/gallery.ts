import { promises as fs } from "fs";
import path from "path";

const ALLOWED_EXT = new Set([".heic", ".heif", ".jpg", ".jpeg", ".png", ".webp"]);

export async function getGalleryImages(): Promise<string[]> {
  const photosDir = path.join(process.cwd(), "public", "Fotos");

  try {
    const entries = await fs.readdir(photosDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => ALLOWED_EXT.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => `/Fotos/${encodeURIComponent(name)}`);
  } catch {
    return [];
  }
}
