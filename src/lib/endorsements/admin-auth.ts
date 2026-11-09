import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "portfolio_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export const adminPasswordConfigured = Boolean(process.env.ADMIN_PASSWORD);

const sha256 = (text: string) => createHash("sha256").update(text).digest();

/** Signed with the password, so changing the password signs every session out. */
function signature(expires: string, password: string) {
  return createHmac("sha256", password)
    .update(`admin-session:${expires}`)
    .digest();
}

export function passwordMatches(attempt: string) {
  const password = process.env.ADMIN_PASSWORD;
  return (
    Boolean(password) && timingSafeEqual(sha256(attempt), sha256(password!))
  );
}

export async function startAdminSession() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set");
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  (await cookies()).set(
    COOKIE,
    `${expires}.${signature(expires, password).toString("hex")}`,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Lax so the link in the notification email arrives already signed in.
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    }
  );
}

export async function endAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const password = process.env.ADMIN_PASSWORD;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!password || !value) return false;
  const [expires, given] = value.split(".");
  if (!expires || !given || Number(expires) * 1000 <= Date.now()) return false;
  const expected = signature(expires, password);
  const actual = Buffer.from(given, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
