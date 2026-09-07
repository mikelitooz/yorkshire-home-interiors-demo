/**
 * Single source of truth for every business fact and claim this site makes.
 *
 * Adapted from the headless-ecommerce-storefront skill (assets/config/brand.ts).
 *
 * Anything left as an empty string is DELIBERATELY empty: a real detail the
 * client has not supplied yet. Consumers render these conditionally so nothing
 * fabricated ships. Never fill one with a plausible-looking placeholder.
 *
 * Record beside each claim WHO confirmed it and WHEN. A claim without a source
 * is a guess.
 *
 * SCOPE NOTE: this file governs claims added from 7 September 2026 onward
 * (payment marks, structured data, category copy, enquiry routing). Claims that
 * already existed in `src/data/site.ts` — showroom address, phone, email,
 * opening hours, Google rating, testimonials — are NOT sourced from here and
 * are NOT confirmed by the client. They were taken from public directory
 * listings (see the `sourceNote` in src/data/site.ts) and must not be promoted
 * into this file, or into any structured data, until the client confirms them.
 *
 * The product catalogue and category list stay in src/data/ecommerce.ts. They
 * are demo data, not business claims, and duplicating them here would create a
 * second place for them to be wrong.
 */

type Brand = {
  name: string;
  tagline: string;
  /** Bare hostname, e.g. "www.example.co.uk". Empty until a real domain exists. Drives canonicals, sitemap, OG. */
  domain: string;
  email: string;
  phone: string;
  legalName: string;
  companyNumber: string;
  vatNumber: string;
  address: { line1: string; line2: string; city: string; postcode: string; country: string };
  social: Record<string, string>;
  currency: { locale: string; code: string };
};

export const brand: Brand = {
  // Confirmed: the site's own name and logo lockup throughout the build.
  name: "Yorkshire Home Interiors",
  tagline: "",

  // TODO CONFIRM (client): the production domain.
  // Deliberately empty. The Vercel preview host is not a domain we may publish
  // in a canonical or in JSON-LD, so this stays "" until the real one exists.
  domain: "",

  // TODO CONFIRM (client): the address enquiries should be delivered to.
  // Used as the fallback address when /api/contact has no upstream configured,
  // and as Organization.email once confirmed.
  email: "",

  // TODO CONFIRM (client): the public telephone number.
  phone: "",

  // Confirmed: the legal name the site trades under, per the site title.
  legalName: "Yorkshire Home Interiors Ltd",

  // TODO CONFIRM (client): Companies House registration number.
  companyNumber: "",
  // TODO CONFIRM (client): VAT registration number, if VAT registered.
  vatNumber: "",

  // TODO CONFIRM (client): the showroom address, in writing, from the client.
  // A Sheffield showroom is confirmed to exist (site copy). The street address
  // is NOT confirmed — the one currently rendered in the footer came from a
  // third-party directory listing. Leave empty until the client supplies it;
  // this gates FurnitureStore / PostalAddress structured data.
  address: { line1: "", line2: "", city: "", postcode: "", country: "" },

  // TODO CONFIRM (client): official social profile URLs.
  // Strip tracking parameters (igsh, utm_*, mibextid) from links the client sends.
  social: {},

  currency: { locale: "en-GB", code: "GBP" },
};

/**
 * Whether the site may be indexed. ONE switch, so the root layout's `robots`
 * metadata and robots.txt can never disagree. Production only: previews and
 * local stay closed regardless of domain.
 */
export const SITE_IS_INDEXABLE =
  Boolean(brand.domain) && process.env.VERCEL_ENV === "production";

/* ── Showroom ────────────────────────────────────────────────── */

/**
 * The client has a genuine showroom in Sheffield, so a FurnitureStore
 * (a LocalBusiness subtype) is appropriate ONCE the address and opening hours
 * are confirmed in writing. Until then this is false and the home page emits a
 * plain Organization instead.
 *
 * Flip to true only in the same change that fills `brand.address` and
 * `openingHours` with client-confirmed values.
 */
export const showroomIsConfirmed = false;

/**
 * TODO CONFIRM (client): opening hours.
 * Schema.org OpeningHoursSpecification shape. Empty until confirmed.
 * Do NOT copy the hours currently in src/data/site.ts — those are scraped.
 */
export const openingHours: readonly {
  days: readonly string[];
  opens: string;
  closes: string;
}[] = [];

/* ── Delivery ────────────────────────────────────────────────── */

/**
 * TODO CONFIRM (client): delivery coverage, exclusions and lead time.
 * State coverage exactly as the service reaches. "Nationwide" and "across the
 * UK" are claims; name the exclusions. The window is for in-stock items, in
 * business days.
 *
 * `isConfirmed` gates Offer.shippingDetails in the product structured data:
 * until it is true we omit shippingDetails entirely rather than guess.
 */
export const delivery = {
  isConfirmed: false,
  coverage: "",
  coverageShort: "",
  excluded: [] as readonly string[],
  windowDays: { min: 0, max: 0 },
  window: "",
  /** Two-person delivery to the room of choice with assembly, flat-pack excepted. */
  whiteGlove: false,
} as const;

/* ── Returns ─────────────────────────────────────────────────── */

/**
 * TODO CONFIRM (client): returns window, who pays return carriage, refund type.
 * `isConfirmed` gates Offer.hasMerchantReturnPolicy: until it is true we omit
 * the return policy from structured data rather than assert a window we were
 * never given. Statutory distance-selling rights are not a substitute for the
 * client's actual published policy.
 */
export const returns = {
  isConfirmed: false,
  windowDays: 0,
  href: "/returns",
} as const;

/* ── Guarantee ───────────────────────────────────────────────── */

/**
 * TODO CONFIRM (client): guarantee layers, what each covers, exclusions.
 * Keep the layers separate. "5-year warranty" reads as every component; say
 * what each layer covers and list the exclusions.
 */
export const guarantee = {
  isConfirmed: false,
  standard: { years: 0, label: "", covers: "" },
  extended: { years: 0, label: "", covers: "" },
  exclusions: [] as readonly string[],
  href: "/warranty",
} as const;

/* ── Finance ─────────────────────────────────────────────────── */

/**
 * TODO CONFIRM (client): whether any credit provider is offered at all.
 *
 * Naming a provider is a payment-option statement. Quoting a rate, term,
 * monthly figure or eligibility condition is a credit promotion and needs the
 * representative example beside it. Nothing in this build quotes a rate.
 *
 * FLAGGED TO CLIENT: the rotating promo strip in src/data/ecommerce.ts
 * currently advertises "0% interest finance available on orders over £500".
 * That is a credit promotion with no representative example and no confirmed
 * provider. It is pre-existing demo copy and is not sourced from here.
 */
export const finance = {
  provider: "",
  /** Empty until the provider's onboarding supplies the real wording. */
  representativeExample: "",
  /** Empty until the terms are published somewhere linkable. */
  termsUrl: "",
} as const;

export const financeIsAdvertisable =
  finance.representativeExample.length > 0 && finance.termsUrl.length > 0;

/* ── Payment methods ─────────────────────────────────────────── */

export type PaymentMethod = { label: string; description: string };

/**
 * The accepted payment methods. Confirmed by Mike on 7 September 2026:
 * Visa, Mastercard, Google Pay, Apple Pay, Klarna and Amex.
 *
 * The order below is the order Mike specified, cards first. The skill suggests
 * leading with the credit option on big-ticket items; that was tried and
 * changed back deliberately, so do not "restore" Klarna to the front.
 *
 * A payment mark is a promise. This list must match what the payment gateway
 * actually has enabled, and the demo has no gateway connected yet, so RE-CHECK
 * it against the live gateway's settings before the store takes a real order —
 * Amex in particular is commonly present in a merchant agreement but switched
 * off in the gateway, and an Amex badge with Amex disabled fails the customer
 * at the checkout screen.
 *
 * Still worth asking the client, but not blocking: whether the methods
 * accepted in the Sheffield showroom differ from those offered online.
 */
export const paymentMethodsAreConfirmed = true;

export const paymentMethods: PaymentMethod[] = [
  { label: "Visa", description: "Visa credit and debit cards" },
  { label: "Mastercard", description: "Mastercard credit and debit cards" },
  { label: "Google Pay", description: "Google Pay" },
  { label: "Apple Pay", description: "Apple Pay" },
  { label: "Klarna", description: "Klarna, to spread the cost" },
  { label: "Amex", description: "American Express" },
];

/* ── Promises (trust strip, footer band, listing hero, PDP, basket) ── */

export type PromiseIconName = "truck" | "shield" | "finance" | "returns" | "room";

export type Promise_ = {
  icon: PromiseIconName;
  text: string;
  detail?: string;
  /** Page carrying the full terms; rendered as a link where there is room. */
  href?: string;
  highlight?: boolean;
};

/**
 * Deliberately EMPTY. Every promise this array would carry — free delivery, a
 * delivery window, a guarantee, interest-free payments, a returns window —
 * depends on a fact the client has not confirmed. An empty array renders
 * nothing, which is the correct behaviour for an unknown.
 *
 * Populate it from `delivery`, `guarantee`, `returns` and `finance` only after
 * those are confirmed; do not hand-write the strings here.
 */
export const promises: Promise_[] = [];
