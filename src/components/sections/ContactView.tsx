import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/ecommerce/ContactForm";
import type { ProductContext } from "@/lib/enquiry";
import { business, contactCards, media } from "@/data/site";

/**
 * One route, two modes. Arriving with ?product= shows what is being asked about
 * and prefills the message; arriving directly shows the plain form.
 *
 * `product` is resolved against the catalogue in the page component, never
 * taken from the query string, so a crafted link cannot render a product and a
 * price that was never sold. See src/lib/enquiry.ts.
 */
export function ContactView({ product }: { product?: ProductContext }) {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={product ? "Ask us about this piece." : "Visit the showroom or ask about a room."}
        body={
          product
            ? "Send us a question about the product below and we will come back to you. You can also visit the showroom to see it in person."
            : "Ask a question, plan a showroom visit, or tell us about the room you are furnishing."
        }
        image={media.carpet}
      />
      <section className="bg-ivory px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Showroom details"
              title="Queens Road, Sheffield."
              body="Come and see the ranges in person, or get in touch and we will help you choose."
            />
            <div className="mt-8 grid gap-4">
              {contactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="flex gap-4 rounded-[1.5rem] bg-white p-5 shadow-card">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linen text-bronze">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-charcoal">{card.title}</p>
                      <p className="mt-1 text-sm leading-6 text-taupe">{card.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-charcoal p-6 text-ivory">
              <p className="font-display text-3xl font-semibold">Opening hours</p>
              <div className="mt-5 grid gap-2 text-sm">
                {business.hours.map(([day, time]) => (
                  <div key={day} className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <span>{day}</span>
                    <span className="text-ivory/70">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-showroom md:p-8">
            {product && (
              <section
                aria-label="Product you are enquiring about"
                className="mb-6 rounded-card border border-smoke/60 bg-cream p-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-taupe">
                  Your enquiry is about
                </p>
                <div className="mt-3 flex items-center gap-4">
                  {product.image && (
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg border border-smoke/60">
                      <Image src={product.image} alt="" fill sizes="72px" className="object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-semibold text-charcoal underline underline-offset-4 hover:text-forest transition-colors"
                    >
                      {product.name}
                    </Link>
                    {product.category && (
                      <p className="mt-1 text-sm capitalize text-taupe">
                        {product.category.replace(/-/g, " ")}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            <ContactForm productSlug={product?.slug} productName={product?.name} />

            <div className="mt-8 grid min-h-72 place-items-center rounded-[1.5rem] bg-linen p-6 text-center">
              <div>
                <Send className="mx-auto h-8 w-8 text-bronze" />
                <p className="mt-4 font-display text-3xl font-semibold text-charcoal">Google Maps embed</p>
                <p className="mt-2 text-sm leading-6 text-taupe">{business.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
