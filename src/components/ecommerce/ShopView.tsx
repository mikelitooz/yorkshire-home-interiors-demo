"use client";

import { useMemo, useState, type ReactNode } from "react";
import { SlidersHorizontal, SearchX } from "lucide-react";
import { categories } from "@/data/ecommerce";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { DEFAULT_SORT, selectProducts, type SortBy } from "@/lib/collection";

type ShopViewProps = {
  initialQuery?: string;
  initialCategory?: string;
  initialRoom?: string;
  offerOnly?: boolean;
  /** Server-rendered breadcrumb, so the visible trail and BreadcrumbList schema match. */
  breadcrumb?: ReactNode;
  /** Page H1. Defaults to the generic shop heading for /shop and /collection. */
  heading?: string;
  /** Short note directly under the heading. */
  intro?: string;
  /** Long-form note rendered below the product grid. */
  afterGrid?: ReactNode;
};

export function ShopView({
  initialQuery = "",
  initialCategory = "all",
  initialRoom = "all",
  offerOnly = false,
  breadcrumb,
  heading,
  intro,
  afterGrid,
}: ShopViewProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [room, setRoom] = useState(initialRoom);
  const [sortBy, setSortBy] = useState<SortBy>(DEFAULT_SORT);

  // Shared with the server so a category page's ItemList schema names exactly
  // these cards, in this order. See src/lib/collection.ts.
  const filtered = useMemo(
    () => selectProducts({ category, room, offerOnly, query, sortBy }),
    [category, offerOnly, query, room, sortBy]
  );

  const clearFilters = () => {
    setQuery("");
    setCategory("all");
    setRoom("all");
    setSortBy(DEFAULT_SORT);
  };

  const hasActiveFilters = query.length > 0 || category !== "all" || room !== "all";

  return (
    <main className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      {breadcrumb}
      <h1 className="font-display text-4xl font-bold text-charcoal sm:text-5xl">
        {heading ?? (offerOnly ? "Special Offers" : "Shop Furniture")}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-taupe">
        {intro ??
          (offerOnly
            ? "Handpicked offers on sofas, beds, dining and decor from Yorkshire Home Interiors."
            : "Browse sofas, beds, dining, decor and more from Yorkshire Home Interiors.")}
      </p>

      {/* ── Filter panel ─────────────────────────── */}
      <section className="mt-6 rounded-card border border-smoke/50 bg-white p-4 shadow-card md:p-5">
        <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-charcoal">
          <SlidersHorizontal className="h-4 w-4 text-forest" />
          Filter &amp; sort
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="input-field"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="input-field"
          >
            <option value="all">All rooms</option>
            <option value="Living Room">Living Room</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Dining Room">Dining Room</option>
            <option value="Home Office">Home Office</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="input-field"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 text-xs font-semibold text-forest hover:text-forest-light transition-colors"
          >
            ✕ Clear all filters
          </button>
        )}
      </section>

      {/* ── Results ───────────────────────────────── */}
      <section className="mt-6">
        <p className="mb-4 text-sm font-medium text-taupe">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-smoke bg-white p-12 text-center">
            <SearchX className="mx-auto h-10 w-10 text-smoke" />
            <p className="mt-4 font-display text-xl font-semibold text-charcoal">No products found</p>
            <p className="mt-2 text-sm text-taupe">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-5">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </section>

      {afterGrid}
    </main>
  );
}
