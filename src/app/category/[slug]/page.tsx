import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ShopView } from "@/components/ecommerce/ShopView";
import { FaqAccordion, faqPageSchema } from "@/components/ui/FaqAccordion";
import { categoryCopyFor } from "@/config/category-copy";
import { getCategoryBySlug } from "@/data/ecommerce";
import { initialCategoryProducts } from "@/lib/collection";
import { breadcrumbListSchema, canonicalFor, collectionPageSchema, jsonLdScript } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const fallbackDescription = (name: string) => `Shop ${name.toLowerCase()} from Yorkshire Home Interiors.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  const copy = categoryCopyFor(category.slug);
  return {
    title: category.name,
    // The meta description is the same short note the visitor reads under the
    // heading, so the snippet and the page agree.
    description: copy?.intro ?? fallbackDescription(category.name),
    alternates: canonicalFor(`/category/${category.slug}`)
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
            <section
              aria-labelledby="category-guide"
              className="mt-14 rounded-card border border-smoke/50 bg-white p-6 shadow-card sm:p-8 lg:p-10"
            >
              <h2
                id="category-guide"
                className="font-display text-2xl font-bold text-charcoal sm:text-3xl"
              >
                {copy.longForm.heading}
              </h2>
              <div className="mt-5 max-w-3xl space-y-4">
                {copy.longForm.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)} className="text-sm leading-7 text-taupe">
                    {paragraph}
                  </p>
                ))}
              </div>

              {faqs.length > 0 && (
                <>
                  <h2 className="mt-10 font-display text-2xl font-bold text-charcoal sm:text-3xl">
                    {category.name} questions
                  </h2>
                  <FaqAccordion items={faqs} />
                </>
              )}
            </section>
          ) : null
        }
      />
    </>
  );
}
