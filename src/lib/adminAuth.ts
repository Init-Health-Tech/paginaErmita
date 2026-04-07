import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "ermita_admin_session";

function sha256(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

export function getAdminSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "cambiar-esta-clave";
}

export function isValidAdminPassword(password: string): boolean {
  const expected = sha256(getAdminSecret());
  const received = sha256(password);
  return timingSafeEqual(expected, received);
}

export function signAdminSession(): string {
  return sha256(getAdminSecret()).toString("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === signAdminSession();
}
