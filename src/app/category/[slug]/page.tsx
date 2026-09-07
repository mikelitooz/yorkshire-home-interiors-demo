import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ShopView } from "@/components/ecommerce/ShopView";
import { ListingNote } from "@/components/sections/ListingNote";
import { faqPageSchema } from "@/components/ui/FaqAccordion";
import { categoryCopyFor } from "@/config/category-copy";
import { categories, getCategoryBySlug } from "@/data/ecommerce";
import { initialCategoryProducts } from "@/lib/collection";
import { breadcrumbListSchema, canonicalFor, collectionPageSchema, jsonLdScript } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const fallbackDescription = (name: string) => `Shop ${name.toLowerCase()} from Yorkshire Home Interiors.`;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  const copy = categoryCopyFor(category.slug);

  // The grid filters client-side, so this route ignores query params entirely:
  // /category/sofas?colour=x serves BYTE-IDENTICAL content at a different URL.
  // That is a pure duplicate, so noindex it and let the canonical consolidate
  // onto the clean path. Same rule as /shop and /contact?product=.
  const isFiltered = Object.values(await searchParams).some(
    (v) => (Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.length > 0)
  );

  return {
    title: category.name,
    // The meta description is the same short note the visitor reads under the
    // heading, so the snippet and the page agree.
    description: copy?.intro ?? fallbackDescription(category.name),
    alternates: canonicalFor(`/category/${category.slug}`),
    ...(isFiltered ? { robots: { index: false, follow: true } } : {})
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const copy = categoryCopyFor(category.slug);

  // The SAME function ShopView renders its grid from, so the ItemList names
  // exactly the cards on the page, in the order they appear. See src/lib/collection.ts.
  const rendered = initialCategoryProducts(category.slug);

  const collectionPage = collectionPageSchema({
    name: copy?.h1 ?? category.name,
    description: copy?.intro ?? fallbackDescription(category.name),
    path: `/category/${category.slug}`,
    items: rendered.map((product) => ({ name: product.name, path: `/product/${product.slug}` }))
  });

  const breadcrumbs = breadcrumbListSchema([
    { name: "Shop", path: "/shop" },
    { name: category.name }
  ]);

  // FAQPage is emitted ONLY when the questions are actually rendered on the
  // page, and is built from the same array the accordion renders.
  const faqs = copy?.faqs ?? [];
  const schemaBlocks = faqs.length > 0
    ? [collectionPage, breadcrumbs, faqPageSchema(faqs)]
    : [collectionPage, breadcrumbs];

  const related = categories.filter((c) => c.slug !== category.slug).map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(...schemaBlocks) }}
      />
      <ShopView
        initialCategory={category.slug}
        heading={copy?.h1 ?? category.name}
        intro={copy?.intro}
        breadcrumb={
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-1.5 text-xs font-medium text-taupe"
          >
            <Link href="/shop" className="hover:text-forest transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-charcoal" aria-current="page">
              {category.name}
            </span>
          </nav>
        }
        afterGrid={
          copy ? (
            <ListingNote copy={copy} related={related} faqHeading={`${category.name} questions`} />
          ) : null
        }
      />
    </>
  );
}
