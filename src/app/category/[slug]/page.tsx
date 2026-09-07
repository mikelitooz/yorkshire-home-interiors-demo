import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ShopView } from "@/components/ecommerce/ShopView";
import { getCategoryBySlug } from "@/data/ecommerce";
import { initialCategoryProducts } from "@/lib/collection";
import { breadcrumbListSchema, canonicalFor, collectionPageSchema, jsonLdScript } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

const describe = (name: string) => `Shop ${name.toLowerCase()} from Yorkshire Home Interiors.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Category not found" };
  }
  return {
    title: category.name,
    description: describe(category.name),
    alternates: canonicalFor(`/category/${category.slug}`)
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  // The SAME function ShopView renders its grid from, so the ItemList names
  // exactly the cards on the page, in the order they appear. See src/lib/collection.ts.
  const rendered = initialCategoryProducts(category.slug);

  const collectionPage = collectionPageSchema({
    name: category.name,
    description: describe(category.name),
    path: `/category/${category.slug}`,
    items: rendered.map((product) => ({ name: product.name, path: `/product/${product.slug}` }))
  });

  const breadcrumbs = breadcrumbListSchema([
    { name: "Shop", path: "/shop" },
    { name: category.name }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionPage, breadcrumbs) }}
      />
      <ShopView
        initialCategory={category.slug}
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
      />
    </>
  );
}
