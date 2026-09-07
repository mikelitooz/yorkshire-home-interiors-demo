"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/data/ecommerce";
import { currency, getRelatedProducts } from "@/data/ecommerce";
import { ProductCard } from "@/components/ecommerce/ProductCard";
import { PaymentMethods } from "@/components/ecommerce/PaymentMethods";
import { useCart } from "@/components/cart/CartProvider";

export function ProductDetailView({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const related = getRelatedProducts(product);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      {/* ── Breadcrumb ────────────────────────────── */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs font-medium text-taupe">
        <Link href="/shop" className="hover:text-forest transition-colors">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/category/${product.category}`} className="capitalize hover:text-forest transition-colors">
          {product.category.replace(/-/g, " ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-charcoal">{product.name}</span>
      </nav>

      {/* ── Product layout ────────────────────────── */}
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Images */}
        <div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-card bg-cream">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-md bg-wheat px-3 py-1 text-xs font-bold text-forest">
                {product.badge}
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.images.map((img) => (
              <button
                key={img}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                  selectedImage === img
                    ? "ring-2 ring-forest ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={product.name} fill sizes="15vw" className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-taupe">
            {product.category.replace(/-/g, " ")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-charcoal sm:text-4xl lg:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm leading-7 text-taupe">{product.description}</p>

          {/* Price */}
          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-bold text-charcoal">{currency(product.price)}</p>
            {product.compareAtPrice && (
              <p className="text-base text-taupe line-through">{currency(product.compareAtPrice)}</p>
            )}
          </div>

          {/* Specs */}
          <div className="mt-6 space-y-2 rounded-card border border-smoke/50 bg-white p-4 text-sm">
            <p>
              <span className="font-semibold text-charcoal">Dimensions:</span>{" "}
              <span className="text-taupe">{product.dimensions}</span>
            </p>
            <p>
              <span className="font-semibold text-charcoal">Materials:</span>{" "}
              <span className="text-taupe">{product.materials}</span>
            </p>
            <p>
              <span className="font-semibold text-charcoal">Delivery:</span>{" "}
              <span className="text-taupe">{product.delivery}</span>
            </p>
          </div>

          {/* Trust signals */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-taupe">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-forest" /> Free Sheffield delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-forest" /> Quality guaranteed
            </span>
          </div>

          {/* Add to cart */}
          <div className="mt-6 flex items-center gap-3">
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-field !w-auto"
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  Qty {v}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => addToCart(product.slug, quantity)}
              className="btn-primary flex-1"
            >
              Add to basket
            </button>
          </div>

          {/* Ways to pay — directly under the buying controls, where the
              question is actually asked. The list is a claim held in config. */}
          <PaymentMethods />
        </div>
      </section>

      {/* ── Related products ──────────────────────── */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-5 font-display text-2xl font-bold text-charcoal sm:text-3xl">
            You might also like
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
