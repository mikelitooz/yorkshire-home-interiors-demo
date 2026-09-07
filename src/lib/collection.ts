import { type Product, products } from "@/data/ecommerce";

/**
 * ONE definition of how the shop grid filters and orders products.
 *
 * This exists so structured data cannot describe a page that does not exist.
 * The category route builds its ItemList on the server from `selectProducts`,
 * and ShopView renders its grid from the same function, so the schema names
 * exactly the cards the visitor sees, in the order they see them. Two
 * implementations of "featured first" is one implementation for them to drift.
 */

export type SortBy = "featured" | "price-low" | "price-high" | "name";

export type ProductQuery = {
  /** Category slug, or "all". */
  category?: string;
  /** Room name, or "all". */
  room?: string;
  offerOnly?: boolean;
  query?: string;
  sortBy?: SortBy;
};

export const DEFAULT_SORT: SortBy = "featured";

export function selectProducts({
  category = "all",
  room = "all",
  offerOnly = false,
  query = "",
  sortBy = DEFAULT_SORT,
}: ProductQuery): Product[] {
  let current: Product[] = [...products];

  if (category !== "all") current = current.filter((p) => p.category === category);
  if (room !== "all") current = current.filter((p) => p.room === room);
  if (offerOnly) current = current.filter((p) => p.offer);

  if (query.trim().length > 0) {
    const normalized = query.toLowerCase();
    current = current.filter(
      (p) =>
        p.name.toLowerCase().includes(normalized) ||
        p.shortDescription.toLowerCase().includes(normalized) ||
        p.category.toLowerCase().includes(normalized),
    );
  }

  if (sortBy === "price-low") current.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") current.sort((a, b) => b.price - a.price);
  if (sortBy === "name") current.sort((a, b) => a.name.localeCompare(b.name));
  // Array.prototype.sort is stable, so non-featured products keep catalogue order.
  if (sortBy === "featured")
    current.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));

  return current;
}

/**
 * Exactly what /category/<slug> renders on first paint, before the visitor
 * touches a filter. The server uses this for the ItemList.
 */
export function initialCategoryProducts(categorySlug: string): Product[] {
  return selectProducts({ category: categorySlug });
}
