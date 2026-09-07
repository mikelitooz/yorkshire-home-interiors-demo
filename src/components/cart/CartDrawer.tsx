"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { currency, products } from "@/data/ecommerce";
import { useCart } from "@/components/cart/CartProvider";

export function CartDrawer() {
  const { lines, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <div className={isCartOpen ? "pointer-events-auto fixed inset-0 z-[90]" : "pointer-events-none fixed inset-0 z-[90]"}>
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeCart}
        className={`absolute inset-0 transition-all duration-300 ${isCartOpen ? "bg-charcoal/60 backdrop-blur-sm opacity-100" : "bg-charcoal/0 opacity-0"}`}
        aria-label="Close cart"
      />
      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col bg-white shadow-showroom transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-smoke/50 px-6 py-4">
          <h2 className="font-display text-2xl font-bold text-charcoal">Your Basket</h2>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-lg border border-smoke text-taupe hover:bg-cream hover:text-charcoal transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="rounded-card border border-dashed border-smoke p-8 text-center text-sm text-taupe">
              Your basket is empty. Add products to continue shopping.
            </div>
          ) : (
            <div className="space-y-3">
              {lines.map((line) => {
                const product = products.find((p) => p.slug === line.slug);
                if (!product) return null;
                return (
                  <article key={line.slug} className="rounded-card border border-smoke/50 p-3">
                    <div className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                        <Image src={product.images[0]} alt={product.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-charcoal">{product.name}</p>
                        <p className="mt-1 text-sm font-bold text-forest">{currency(product.price)}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-lg border border-smoke">
                            <button type="button" onClick={() => updateQuantity(line.slug, line.quantity - 1)} className="px-2.5 py-1 text-taupe hover:text-charcoal" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                            <span className="w-7 text-center text-xs font-semibold text-charcoal">{line.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(line.slug, line.quantity + 1)} className="px-2.5 py-1 text-taupe hover:text-charcoal" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                          <button type="button" onClick={() => removeFromCart(line.slug)} className="text-taupe hover:text-red-600 transition-colors" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-smoke/50 px-6 py-4">
          {/* The drawer is mounted on every page and only slid off-screen when
              closed, so anything rendered here ships in the HTML of every page.
              An empty basket used to emit a stray "£0" onto product, category
              and home pages, next to real prices. The subtotal row is
              presentational, so it renders only when there is a subtotal to
              show; the basket total itself is unchanged. */}
          {lines.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-taupe">Subtotal</p>
              <p className="text-xl font-bold text-charcoal">{currency(subtotal)}</p>
            </div>
          )}
          <div className="grid gap-2">
            <Link href="/cart" onClick={closeCart} className="btn-secondary w-full justify-center">View basket</Link>
            <Link href="/checkout" onClick={closeCart} className="btn-primary w-full justify-center">Checkout</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
