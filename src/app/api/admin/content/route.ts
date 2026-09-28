import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  ContentValidationError,
  isFormSection,
  sanitizeAmenities,
  sanitizeCosts,
  sanitizeFormFields,
  sanitizeRetreats,
} from "@/lib/contentModel";
import type { SiteContent } from "@/lib/contentModel";
import { getSiteContent, writeSiteContent } from "@/lib/siteContent";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.section !== "string") {
    return NextResponse.json({ ok: false, error: "Petición inválida" }, { status: 400 });
  }

  try {
    const current = await getSiteContent();
    let saved: SiteContent;
    if (body.section === "form") {
      if (!isFormSection(body.form)) {
        return NextResponse.json({ ok: false, error: "Formulario no reconocido" }, { status: 400 });
      }
      const fields = sanitizeFormFields(body.form, body.fields);
      saved = await writeSiteContent({ ...current, forms: { ...current.forms, [body.form]: fields } });
    } else if (body.section === "costs") {
      saved = await writeSiteContent({ ...current, costs: sanitizeCosts(body.costs) });
    } else if (body.section === "amenities") {
      const amenities = sanitizeAmenities(body.amenities, { previous: current.amenities, trustPhotos: false });
      saved = await writeSiteContent({ ...current, amenities });
    } else if (body.section === "retreats") {
      saved = await writeSiteContent({ ...current, retreats: sanitizeRetreats(body.retreats) });
    } else {
      return NextResponse.json({ ok: false, error: "Sección no reconocida" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, content: saved });
  } catch (error) {
    if (error instanceof ContentValidationError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ ok: false, error: "No se pudo guardar" }, { status: 500 });
  }
}
