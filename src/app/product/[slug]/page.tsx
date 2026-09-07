import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/ecommerce/ProductDetailView";
import { getCategoryBySlug, getProductBySlug } from "@/data/ecommerce";
import { breadcrumbListSchema, canonicalFor, jsonLdScript, productSchema } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: canonicalFor(`/product/${product.slug}`)
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);

  // Mirrors the visible breadcrumb rendered at the top of ProductDetailView:
  // Shop > <category> > <product name>, with no link on the current page.
  const breadcrumbs = breadcrumbListSchema([
    { name: "Shop", path: "/shop" },
    {
      name: category?.name ?? product.category.replace(/-/g, " "),
      path: `/category/${product.category}`
    },
    { name: product.name }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(productSchema(product), breadcrumbs) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
