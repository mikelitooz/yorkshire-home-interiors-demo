import { brand } from "@/config/brand";
import { getProductBySlug } from "@/data/ecommerce";
import { siteUrl } from "@/lib/seo";

/**
 * Adapted from the headless-ecommerce-storefront skill (assets/lib/enquiry.ts).
 *
 * One enquiry shape shared by the form, the API route and the tests, because
 * the same enquiry is built twice (browser, then server) and a drift is a
 * dropped field in an email nobody notices.
 *
 * ── DEVIATION FROM THE ASSET: the client sends a SLUG, not a product object ──
 * The asset posts the whole ProductContext and validates it server-side. This
 * version posts only `productSlug` and rebuilds every other field from the
 * catalogue on the server, which is what the asset's own ContactForm comment
 * describes ("the server rebuilds the product context from the slug; nothing
 * else is believed"). Two reasons it matters here:
 *
 *   1. Security. Nothing about the product — name, price, colour, URL — is ever
 *      taken from the request, so a crafted POST cannot put a product and a
 *      price we never sold into an enquiry email.
 *   2. Correctness. The asset requires product.url to match /^https?:\/\//.
 *      brand.domain is still empty on this site, so siteUrl() returns a
 *      root-relative path and that check would silently DROP the product
 *      context from every enquiry. Building the URL server-side lets it be a
 *      path today and an absolute URL the moment a domain is configured.
 */
export const ENQUIRY_LIMITS = { name: 100, email: 200, phone: 40, message: 4000, slug: 120 } as const;

/** What the customer was looking at when they clicked Enquire. Resolved from the catalogue, never the request. */
export type ProductContext = {
  slug: string;
  name: string;
  /** Absolute once brand.domain is set; a root-relative path before then. */
  url: string;
  category?: string;
  image?: string;
};

export type Enquiry = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  product?: ProductContext;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clampField(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Resolves a slug against the catalogue. Returns undefined for anything that is
 * not a real product, so an unknown or crafted slug simply produces a general
 * enquiry rather than an error or an invented product.
 */
export function resolveProductContext(slug: string | undefined): ProductContext | undefined {
  const clean = clampField(slug, ENQUIRY_LIMITS.slug);
  if (!clean) return undefined;
  const product = getProductBySlug(clean);
  if (!product) return undefined;
  return {
    slug: product.slug,
    name: product.name,
    url: siteUrl(`/product/${product.slug}`),
    category: product.category,
    image: product.images[0],
  };
}

export type ValidationResult = { ok: true; enquiry: Enquiry } | { ok: false; error: string };

/** The server is the boundary; the form's own checks are a convenience. */
export function validateEnquiry(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") return { ok: false, error: "invalid body" };
  const body = input as Record<string, unknown>;
  const name = clampField(body.name, ENQUIRY_LIMITS.name);
  const email = clampField(body.email, ENQUIRY_LIMITS.email);
  const phone = clampField(body.phone, ENQUIRY_LIMITS.phone);
  const message = clampField(body.message, ENQUIRY_LIMITS.message);
  if (!name) return { ok: false, error: "Please tell us your name." };
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (message.length < 5) return { ok: false, error: "Please write a message." };

  // The ONLY thing believed from the request is the slug, and only as a lookup key.
  const product = resolveProductContext(
    typeof body.productSlug === "string" ? body.productSlug : undefined,
  );

  return { ok: true, enquiry: { name, email, phone: phone || undefined, message, product } };
}

/**
 * Opening line of the message when arriving from Enquire online; the customer
 * edits it. Wording matches the Furniture Lovers storefront the pattern comes
 * from, rather than the skill asset's phrasing, so the two sites read alike.
 */
export function prefilledMessage(productName: string): string {
  return `Hi, I would like to enquire about: ${productName}.`;
}

export function enquiryEmail(e: Enquiry): { subject: string; text: string } {
  const subject = e.product
    ? `Product enquiry: ${e.product.name} - ${brand.name}`
    : `Website enquiry - ${brand.name}`;
  const lines = [
    `Name: ${e.name}`,
    `Email: ${e.email}`,
    e.phone ? `Phone: ${e.phone}` : null,
    e.product ? `Product: ${e.product.name}` : null,
    e.product?.category ? `Category: ${e.product.category}` : null,
    e.product ? `Product page: ${e.product.url}` : null,
    "",
    e.message,
  ].filter((l): l is string => l !== null);
  return { subject, text: lines.join("\n") };
}
