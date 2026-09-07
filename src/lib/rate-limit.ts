/**
 * Copied from the headless-ecommerce-storefront skill (assets/lib/rate-limit.ts).
 *
 * Best-effort in-memory token bucket. On serverless the state is per instance,
 * so the effective ceiling is limit x warm instances; it still stops one client
 * hammering one instance. Swap for a shared store behind this signature later.
 *
 * Per-IP limits must be LOOSE: an office, café or mobile carrier puts hundreds
 * of people behind one address. Tight limits belong on per-session keys.
 */
type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 5_000;

export function checkRateLimit(
  key: string,
  limits: { capacity: number; refillPerMs: number },
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  if (buckets.size > MAX_BUCKETS) {
    const entries = [...buckets.entries()].sort((a, b) => a[1].updatedAt - b[1].updatedAt);
    for (let i = 0; i < entries.length / 2; i++) buckets.delete(entries[i][0]);
  }
  const bucket = buckets.get(key) ?? { tokens: limits.capacity, updatedAt: now };
  bucket.tokens = Math.min(limits.capacity, bucket.tokens + (now - bucket.updatedAt) * limits.refillPerMs);
  bucket.updatedAt = now;
  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    return { allowed: false, retryAfterSeconds: Math.ceil((1 - bucket.tokens) / limits.refillPerMs / 1000) };
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return { allowed: true };
}

export const perMinute = (n: number) => n / 60_000;

/** First hop of x-forwarded-for, or "unknown"; one rule for every route. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
