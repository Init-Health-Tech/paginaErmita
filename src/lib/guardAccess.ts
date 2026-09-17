import { createHash, timingSafeEqual } from "crypto";

function defaultGuardToken(): string {
  const seed = process.env.ADMIN_PASSWORD ?? "admin123";
  return createHash("sha256").update(`ermita-guard-acceso:${seed}`).digest("hex");
}

export function getGuardToken(): string {
  const configured = process.env.GUARD_ACCESS_TOKEN?.trim();
  if (configured && configured.length >= 24) {
    return configured;
  }
  return defaultGuardToken();
}

export function getGuardAccessPath(): string {
  return `/acceso/${getGuardToken()}`;
}

export function isValidGuardToken(token: string): boolean {
  const expected = Buffer.from(getGuardToken());
  const received = Buffer.from(token);
  if (expected.length !== received.length) {
    return false;
  }
  return timingSafeEqual(expected, received);
}
