import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { Redis } from "@upstash/redis";
import { unstable_cache } from "next/cache";
import {
  endorsements as cardSlots,
  type Endorsement,
} from "@/content/portfolio";
import type { EndorsementInput } from "./rules";

export type StoredEndorsement = EndorsementInput & {
  id: string;
  status: "pending" | "approved";
  createdAt: string;
  approvedAt?: string;
};

/** Tag on the cached card data; clear it whenever an approved endorsement changes. */
export const CARDS_CACHE_TAG = "endorsement-cards";

const HASH_KEY = "endorsements";
/** Backstop so a flood of submissions can never fill the database. */
const MAX_STORED = 200;

// Vercel's Upstash integration sets KV_*; a directly created Upstash database uses UPSTASH_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

export const storeConfigured = redis !== null;

function db(): Redis {
  if (!redis) throw new Error("Upstash Redis is not configured");
  return redis;
}

/** Saves a new submission as pending. Returns false when the store is full. */
export async function addPending(input: EndorsementInput): Promise<boolean> {
  if ((await db().hlen(HASH_KEY)) >= MAX_STORED) return false;
  const record: StoredEndorsement = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  await db().hset(HASH_KEY, { [record.id]: record });
  return true;
}

/** Everything stored, split by status, newest first. */
export async function listEndorsements() {
  const all = Object.values(
    (await db().hgetall<Record<string, StoredEndorsement>>(HASH_KEY)) ?? {}
  );
  return {
    pending: all
      .filter((e) => e.status === "pending")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    approved: all
      .filter((e) => e.status === "approved")
      .sort((a, b) => (b.approvedAt ?? "").localeCompare(a.approvedAt ?? "")),
  };
}

export async function setApproved(id: string, approved: boolean) {
  const record = await db().hget<StoredEndorsement>(HASH_KEY, id);
  if (!record) return;
  const next: StoredEndorsement = approved
    ? { ...record, status: "approved", approvedAt: new Date().toISOString() }
    : { ...record, status: "pending", approvedAt: undefined };
  await db().hset(HASH_KEY, { [id]: next });
}

export async function deleteEndorsement(id: string) {
  await db().hdel(HASH_KEY, id);
}

/** The visitor's address as reported by Vercel's edge. */
export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Fixed-window counter. Returns true while `who` is within `limit` calls per window.
 * `who` is hashed, so raw IP addresses are never written to the database.
 */
export async function withinRateLimit(
  action: string,
  who: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const hash = createHash("sha256").update(who).digest("hex").slice(0, 32);
  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const key = `ratelimit:${action}:${hash}:${bucket}`;
  const [count] = await db()
    .pipeline()
    .incr(key)
    .expire(key, windowSeconds)
    .exec<[number, number]>();
  return count <= limit;
}

const readCards = unstable_cache(
  async (): Promise<Endorsement[]> => {
    if (!redis) return [];
    const { approved } = await listEndorsements();
    // Only the public fields ever reach the browser.
    return approved
      .slice(0, cardSlots.length)
      .map(({ quote, name, role, rating }) => ({ quote, name, role, rating }));
  },
  ["endorsement-cards"],
  { tags: [CARDS_CACHE_TAG], revalidate: 3600 }
);

/** The newest approved endorsements, one per card. An outage leaves the cards blank. */
export async function getCardEndorsements(): Promise<Endorsement[]> {
  try {
    return await readCards();
  } catch (error) {
    console.error("Could not load endorsements", error);
    return [];
  }
}
