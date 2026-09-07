import { NextRequest, NextResponse } from "next/server";
import { brand } from "@/config/brand";
import { enquiryEmail, validateEnquiry } from "@/lib/enquiry";
import { signForN8n } from "@/lib/hmac";
import { checkRateLimit, clientIp, perMinute } from "@/lib/rate-limit";

/**
 * Adapted from the headless-ecommerce-storefront skill
 * (assets/app/api/contact/route.ts).
 *
 * Env vars are named CONTACT_N8N_* rather than the asset's CHAT_N8N_*: the
 * asset came from a project where one webhook carried both contact enquiries
 * and chat handoffs. This site has no chat. The contract is otherwise identical,
 * so the skill's n8n guidance applies verbatim. See .env.example.
 */
export const runtime = "nodejs";

/** Trim EVERY env var. A trailing newline pasted into a dashboard field produced 403 at the webhook for hours. */
const env = (name: string) => process.env[name]?.trim() ?? "";

/** Six a minute from one address is a person; more is a script. Loose, because an office shares one IP. */
const LIMIT = { capacity: 6, refillPerMs: perMinute(6) };
const MAX_BODY_BYTES = 16_000;

function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // some browsers omit Origin on same-origin posts
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * Refuses honestly.
 *
 * With no upstream configured this returns 503 and says the message was NOT
 * sent, rather than a cheerful 200 into a void. A confirmation the customer
 * believes and we never received is worse than an error. `reason: "no-upstream"`
 * lets the form show that as a deliberate "not connected yet" state instead of
 * a failure the visitor might retry forever.
 *
 * TODO CONFIRM (client): the enquiry destination address, which fills
 * brand.email. Until it is set there is no address to fall back to and the
 * refusal says so plainly rather than printing an empty mailto link.
 *
 * TODO (Mike): CONTACT_N8N_WEBHOOK_URL + CONTACT_N8N_AUTH_HEADER_VALUE, and
 * CONTACT_N8N_SHARED_SECRET for the HMAC. The n8n workflow must fork on `kind`
 * BEFORE its chat validator, which rejects a payload with no sessionId.
 */
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  if (!checkRateLimit(`contact:${clientIp(req.headers)}`, LIMIT).allowed) {
    return NextResponse.json(
      { error: "Too many enquiries just now. Please try again in a minute." },
      { status: 429 },
    );
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "message too long" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // The server is the boundary. The product is rebuilt from the slug against
  // the catalogue; nothing about it is taken from the request.
  const result = validateEnquiry(parsed);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { enquiry } = result;
  const email = enquiryEmail(enquiry);

  const N8N_URL = env("CONTACT_N8N_WEBHOOK_URL");
  const N8N_HEADER_NAME = env("CONTACT_N8N_AUTH_HEADER_NAME") || "x-server-key";
  const N8N_HEADER_VALUE = env("CONTACT_N8N_AUTH_HEADER_VALUE");

  if (!N8N_URL || !N8N_HEADER_VALUE) {
    console.error("[contact] no upstream configured; enquiry NOT delivered");
    return NextResponse.json(
      {
        reason: "no-upstream",
        error: brand.email
          ? "This site is not connected to an enquiry inbox yet, so your message has not been sent. Please email us directly."
          : "This site is not connected to an enquiry inbox yet, so your message has not been sent and nothing you typed has been stored.",
        // Only ever present when there is a real address to offer.
        ...(brand.email ? { fallbackEmail: brand.email } : {}),
      },
      { status: 503 },
    );
  }

  // replyTo is the customer, so Reply in the shop inbox answers the person.
  const payload = JSON.stringify({
    kind: "contact",
    to: brand.email,
    replyTo: enquiry.email,
    subject: email.subject,
    text: email.text,
    enquiry,
    receivedAt: new Date().toISOString(),
  });

  const signature = signForN8n(payload);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    [N8N_HEADER_NAME]: N8N_HEADER_VALUE,
  };
  if (signature) {
    headers["x-timestamp"] = signature.timestamp;
    headers["x-signature"] = signature.signature;
  }

  try {
    const upstream = await fetch(N8N_URL, {
      method: "POST",
      headers,
      body: payload,
      signal: AbortSignal.timeout(10_000),
    });
    if (!upstream.ok) {
      console.error("[contact] upstream", upstream.status);
      return NextResponse.json(
        { error: "We could not send your message just now.", ...(brand.email ? { fallbackEmail: brand.email } : {}) },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] upstream failed", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "We could not send your message just now.", ...(brand.email ? { fallbackEmail: brand.email } : {}) },
      { status: 502 },
    );
  }
}
