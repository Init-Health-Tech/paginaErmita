import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/adminAuth";

function clearSession() {
  const response = NextResponse.redirect(new URL("/admin", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function POST() {
  return clearSession();
}

export async function GET() {
  return clearSession();
}
