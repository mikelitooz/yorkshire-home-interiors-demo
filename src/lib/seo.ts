import { brand, openingHours, showroomIsConfirmed } from "@/config/brand";
import type { Product } from "@/data/ecommerce";

/**
 * URL and structured-data helpers, adapted from the
 * headless-ecommerce-storefront skill (assets/lib/seo.ts).
 *
 * ONE definition of how a URL is written and ONE escaping helper, so canonical,
 * sitemap and schema cannot drift and no supplier copy can close the script tag.
 */

/**
 * Absolute once a domain exists, relative before.
 *
 * PRE-LAUNCH STATE: with `brand.domain` empty this returns a root-relative
 * path, so BreadcrumbList `item` and CollectionPage `url` are relative in the
 * demo. Consumers resolve them against the page URL, which is correct but is
 * not the launch state. Publishing the Vercel preview host instead would put a
 * hostname we do not own into permanent markup, which is worse. Setting
 * `brand.domain` turns every one of these absolute in a single change, with no
 * other edit anywhere. Offer.url and the canonical tag are stricter still:
 * they are omitted entirely rather than emitted relative.
 */
export function siteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return brand.domain ? `https://${brand.domain}${clean}` : clean;
}

/**
 * Absolute or undefined. Use for Open Graph and for any schema property that
 * is only meaningful as an absolute URL. NEVER for canonicals via
 * `alternates.canonical`: Next resolves a relative value against metadataBase,
 * which on this project still points at a Vercel preview host.
 */
export function absoluteUrl(path: string): string | undefined {
  return brand.domain ? siteUrl(path) : undefined;
}

/**
 * Self-referencing canonical block, or undefined.
 *
 * Returns undefined while `brand.domain` is empty, so no canonical tag is
 * emitted at all. That is deliberate: Next resolves a relative canonical
 * against `metadataBase`, which would publish a canonical on a *.vercel.app
 * host we do not own and must never appear in markup. No canonical is better
 * than a canonical pointing somewhere else.
 *
 * Set brand.domain and every page in the site gains an absolute self canonical
 * with no other change.
 */
export function canonicalFor(path: string): { canonical: string } | undefined {
  return brand.domain ? { canonical: siteUrl(path) } : undefined;
}

export type Crumb = { name: string; path?: string };

/** Mirrors the VISIBLE breadcrumb. The current page carries no `item`. */
export function breadcrumbListSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: siteUrl(crumb.path) } : {}),
    })),
  };
}

/** How many entries the ItemList names: the grid's first batch. */
const ITEM_LIST_LIMIT = 24;

/**
 * `items` MUST be the cards the page renders, in render order. Slicing the raw
 * product array instead describes a page that does not exist. Callers build
 * `items` from src/lib/collection.ts, the same function the grid renders from.
 */
export function collectionPageSchema({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: siteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.slice(0, ITEM_LIST_LIMIT).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: siteUrl(item.path),
      })),
    },
  };
}

/**
 * The business entity for the home page.
 *
 * Yorkshire Home Interiors has a genuine Sheffield showroom, so FurnitureStore
 * (a LocalBusiness subtype) is the correct type — but ONLY with a confirmed
 * street address and confirmed opening hours. Neither has been supplied by the
 * client; the address and hours currently rendered from src/data/site.ts came
 * from third-party directory listings. Until `showroomIsConfirmed` is true we
 * emit a plain Organization carrying only what is actually established: the
 * trading name and the legal name.
 *
 * A LocalBusiness with an address we cannot stand behind is a Merchant Center
 * and Business Profile mismatch waiting to happen.
 */
export function businessSchema() {
  const base = {
    "@context": "https://schema.org",
    name: brand.name,
    ...(brand.legalName ? { legalName: brand.legalName } : {}),
    ...(brand.tagline ? { slogan: brand.tagline } : {}),
    ...(brand.email ? { email: brand.email } : {}),
    ...(brand.phone ? { telephone: brand.phone } : {}),
    ...(brand.domain ? { url: siteUrl("/"), logo: siteUrl("/brand/logo-lockup.png") } : {}),
    ...(Object.values(brand.social).filter(Boolean).length > 0
      ? { sameAs: Object.values(brand.social).filter(Boolean) }
      : {}),
  };

  if (!showroomIsConfirmed || !brand.address.line1) {
    return { ...base, "@type": "Organization" };
  }

  return {
    ...base,
    "@type": "FurnitureStore",
    address: {
      "@type": "PostalAddress",
      streetAddress: [brand.address.line1, brand.address.line2].filter(Boolean).join(", "),
      addressLocality: brand.address.city,
      postalCode: brand.address.postcode,
      addressCountry: "GB",
    },
    ...(openingHours.length > 0
      ? {
          openingHoursSpecification: openingHours.map((slot) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: slot.days,
            opens: slot.opens,
            closes: slot.closes,
          })),
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: brand.name,
    ...(brand.domain ? { url: siteUrl("/") } : {}),
  };
}

/**
 * Product + Offer.
 *
 * Deliberately absent, and each for a reason:
 *   - aggregateRating / review: no review data is held. Inventing social proof
 *     is a manual action risk and a consumer-law exposure.
 *   - gtin / mpn / sku: the demo catalogue carries no identifiers. An invented
 *     one fails Merchant Center matching.
 *   - brand: it is not established whether Yorkshire Home Interiors is the
 *     manufacturer or the retailer of these ranges, so no Brand is claimed.
 *   - shippingDetails: omitted until `delivery.isConfirmed`. See below.
 *   - hasMerchantReturnPolicy: omitted until `returns.isConfirmed`. See below.
 *   - priceValidUntil: no promotion end date has been supplied.
 *
 * `availability` must match the visible state of the page. This catalogue holds
 * no stock data and no supplier feed: every product renders an enabled
 * "Add to basket" with a delivery lead time and no stock caveat, so InStock is
 * what the page says. TODO CONFIRM (client): real stock status, before any
 * Merchant Center feed goes live — an availability mismatch between feed and
 * landing page is a disapproval.
 */
export function productSchema(product: Product) {
  const path = `/product/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    ...(product.materials ? { material: product.materials } : {}),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: brand.currency.code,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: brand.name },
      // Only ever absolute. While brand.domain is empty this key is omitted
      // rather than published relative or on a preview host.
      ...(brand.domain ? { url: siteUrl(path) } : {}),
    },
  };
}

/**
 * Every JSON-LD block funnels through here. Product copy can contain
 * `</script>`, which would close the element early and land the rest on the
 * page as live markup.
 */
export function jsonLdScript(...blocks: unknown[]): string {
  return JSON.stringify(blocks.length === 1 ? blocks[0] : blocks)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
