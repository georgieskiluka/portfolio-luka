import { after } from "next/server";
import { notifyNewEndorsement } from "@/lib/endorsements/notify";
import { validateEndorsement } from "@/lib/endorsements/rules";
import {
  addPending,
  clientIp,
  storeConfigured,
  withinRateLimit,
} from "@/lib/endorsements/store";

const MAX_BODY_CHARS = 4096;
const HOUR = 3600;
const DAY = 24 * HOUR;
const UNAVAILABLE =
  "Endorsements can't be received right now. Please try again later.";

const json = (status: number, body: object) => Response.json(body, { status });

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return json(413, { error: "That message is too long." });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json(400, { error: "That request couldn't be read." });
  }

  // Only bots fill the hidden field. Reply as usual so they don't adapt.
  if (body?.website) return json(201, { ok: true });

  const result = validateEndorsement(body);
  if (!result.ok) return json(422, { errors: result.errors });
  if (!storeConfigured) return json(503, { error: UNAVAILABLE });

  try {
    const allowed =
      (await withinRateLimit("submit", clientIp(request.headers), 3, HOUR)) &&
      (await withinRateLimit("submit-all", "everyone", 30, DAY));
    if (!allowed) {
      return json(429, {
        error: "Too many endorsements for now. Please try again later.",
      });
    }
    if (!(await addPending(result.value))) {
      return json(503, { error: UNAVAILABLE });
    }
  } catch (error) {
    console.error("Could not save an endorsement", error);
    return json(503, { error: UNAVAILABLE });
  }

  after(() => notifyNewEndorsement(result.value));
  return json(201, { ok: true });
}
