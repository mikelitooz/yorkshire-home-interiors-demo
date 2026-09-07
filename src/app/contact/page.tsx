import type { Metadata } from "next";
import { ContactView } from "@/components/sections/ContactView";
import { resolveProductContext } from "@/lib/enquiry";
import { businessSchema, canonicalFor, jsonLdScript, siteUrl } from "@/lib/seo";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const slug = one((await searchParams).product);
  const product = resolveProductContext(slug);

  return {
    title: "Contact",
    description:
      "Contact Yorkshire Home Interiors Ltd, view opening hours and plan a showroom visit in Sheffield.",
    // ?product= produces one URL per product for a page whose content barely
    // differs. Those are duplicates: noindex them and point the canonical at
    // the clean path so only /contact is ever indexed.
    alternates: canonicalFor("/contact"),
    ...(product ? { robots: { index: false, follow: true } } : {})
  };
}

export default async function ContactPage({ searchParams }: Props) {
  const slug = one((await searchParams).product);

  // Resolved against the catalogue, NEVER trusted from the URL. An unknown or
  // crafted slug simply yields undefined and the plain contact form renders.
  const product = resolveProductContext(slug);

  // businessSchema() is a top-level entity and carries its own @context; strip
  // it when nesting so the document has exactly one.
  const { "@context": _context, ...business } = businessSchema();

  const contactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Yorkshire Home Interiors",
    url: siteUrl("/contact"),
    mainEntity: business
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(contactPage) }}
      />
      <ContactView product={product} />
    </>
  );
}
