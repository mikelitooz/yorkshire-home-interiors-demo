import { createHmac } from "node:crypto";

/**
 * Copied from the headless-ecommerce-storefront skill (assets/lib/hmac.ts).
 *
 * SERVER ONLY. Every function reads a secret.
 *
 * TWO DEVIATIONS FROM THE ASSET:
 *  1. The env var is CONTACT_N8N_SHARED_SECRET rather than the asset's
 *     CHAT_N8N_SHARED_SECRET. The asset came from a project where one webhook
 *     carried both contact enquiries and chat handoffs; this site has no chat,
 *     and an env var named for a feature that does not exist is a maintenance
 *     trap. Everything else about the contract is identical.
 *  2. The asset's isAuthorizedToolCall() and its safeEqual/timingSafeEqual
 *     helpers are not copied. They guard n8n-to-site tool routes, which this
 *     site does not have. Shipping unused code with a security-sounding name
 *     invites someone to wire it up without reading it.
 */
if (typeof window !== "undefined") {
  throw new Error("hmac is server-only and must never reach the browser.");
}

/** A secret shorter than 16 chars is treated as unset rather than trusted. */
export function secret(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v && v.length >= 16 ? v : undefined;
}

export function hmacHex(key: string, value: string): string {
  return createHmac("sha256", key).update(value).digest("hex");
}

/** Sign the EXACT body sent to n8n: `${timestamp}.${body}`. */
export function signForN8n(body: string): { timestamp: string; signature: string } | null {
  const key = secret("CONTACT_N8N_SHARED_SECRET");
  if (!key) return null;
  const timestamp = String(Date.now());
  return { timestamp, signature: hmacHex(key, `${timestamp}.${body}`) };
}
