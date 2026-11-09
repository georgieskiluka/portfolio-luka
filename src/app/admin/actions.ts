"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  endAdminSession,
  isAdmin,
  passwordMatches,
  startAdminSession,
} from "@/lib/endorsements/admin-auth";
import {
  approveEndorsement,
  CARDS_CACHE_TAG,
  clientIp,
  deleteEndorsement,
  hideEndorsement,
  showEndorsement,
  withinRateLimit,
} from "@/lib/endorsements/store";

const LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_SECONDS = 15 * 60;

export async function login(formData: FormData) {
  const ip = clientIp(await headers());
  if (
    !(await withinRateLimit("login", ip, LOGIN_ATTEMPTS, LOGIN_WINDOW_SECONDS))
  ) {
    redirect("/admin?error=locked");
  }
  if (!passwordMatches(String(formData.get("password") ?? ""))) {
    redirect("/admin?error=wrong");
  }
  await startAdminSession();
  redirect("/admin");
}

export async function logout() {
  await endAdminSession();
  redirect("/admin");
}

/** Every change re-checks the session: Server Actions are reachable by direct POST. */
async function change(
  formData: FormData,
  apply: (id: string) => Promise<void>
) {
  if (!(await isAdmin())) redirect("/admin");
  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;
  await apply(id);
  updateTag(CARDS_CACHE_TAG);
  revalidatePath("/admin");
}

export async function approve(formData: FormData) {
  await change(formData, approveEndorsement);
}

export async function show(formData: FormData) {
  await change(formData, showEndorsement);
}

export async function hide(formData: FormData) {
  await change(formData, hideEndorsement);
}

export async function reject(formData: FormData) {
  await change(formData, deleteEndorsement);
}
