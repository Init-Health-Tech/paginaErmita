import { NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidAdminPassword, signAdminSession } from "@/lib/adminAuth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, signAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
