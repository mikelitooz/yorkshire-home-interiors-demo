import type { Metadata } from "next";
import { ShopView } from "@/components/ecommerce/ShopView";
import { ListingNote } from "@/components/sections/ListingNote";
import { faqPageSchema } from "@/components/ui/FaqAccordion";
import { shopCopy } from "@/config/category-copy";
import { categories } from "@/data/ecommerce";
import { selectProducts } from "@/lib/collection";
import { breadcrumbListSchema, canonicalFor, collectionPageSchema, jsonLdScript } from "@/lib/seo";

type Props = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    room?: string;
    offer?: string;
    sort?: string;
  }>;
};

/**
 * /shop is the single listing root. Every breadcrumb on the site starts here,
 * the header search posts here, and /collection — which used to render this
 * exact page at a second URL — now redirects here permanently (next.config.ts).
 *
 * FILTERED VIEWS: any search param produces a near-duplicate of this page at a
 * different URL. Those get robots noindex,follow and a canonical to the clean
 * path, so only /shop itself is ever indexed. The structured data and the long
 * note are emitted only on the clean path, because on a filtered view the
 * ItemList would describe a grid the schema was not built from.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const isFiltered = Object.values(params).some((v) => typeof v === "string" && v.length > 0);

  return {
    title: params.offer === "true" ? "Special Offers" : "Shop",
    description: shopCopy.intro,
    alternates: canonicalFor("/shop"),
    ...(isFiltered ? { robots: { index: false, follow: true } } : {})
  };
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const isFiltered = Object.values(params).some((v) => typeof v === "string" && v.length > 0);

  // The SAME function ShopView renders its grid from, so the ItemList names
  // exactly the cards on the page, in the order they appear.
  const rendered = selectProducts({});

  const collectionPage = collectionPageSchema({
    name: shopCopy.h1,
    description: shopCopy.intro,
    path: "/shop",
    items: rendered.map((product) => ({ name: product.name, path: `/product/${product.slug}` }))
  });

  const breadcrumbs = breadcrumbListSchema([{ name: "Shop" }]);

  const related = categories.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      {!isFiltered && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(collectionPage, breadcrumbs, faqPageSchema(shopCopy.faqs))
          }}
        />
      )}
      <ShopView
        initialQuery={params.query}
        initialCategory={params.category}
        initialRoom={params.room}
        offerOnly={params.offer === "true"}
        heading={isFiltered ? undefined : shopCopy.h1}
        intro={isFiltered ? undefined : shopCopy.intro}
        afterGrid={
          isFiltered ? null : (
            <ListingNote copy={shopCopy} related={related} faqHeading="Common questions" />
          )
        }
      />
    </>
  );
}
