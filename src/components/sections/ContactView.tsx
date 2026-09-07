import Image from "next/image";
import Link from "next/link";
import { Building2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ecommerce/ContactForm";
import { brand } from "@/config/brand";
import type { ProductContext } from "@/lib/enquiry";
import { business } from "@/data/site";

/**
 * One route, two modes. Arriving with ?product= shows what is being asked
 * about and prefills the message; arriving directly shows the plain form.
 *
 * `product` is resolved against the catalogue in the page component, never
 * taken from the query string, so a crafted link cannot render a product and a
 * price that was never sold. See src/lib/enquiry.ts.
 *
 * LAYOUT follows the Furniture Lovers storefront (furniture-lover.vercel.app):
 * a plain eyebrow/H1/intro header, then a two-column grid with the enquiry
 * form as the main column and a narrower aside of small detail cards. The
 * previous layout had this the other way round, with the form demoted to the
 * right of the showroom details.
 *
 * The aside cards are NOT the same three Furniture Lovers uses, and
 * deliberately so:
 *  - "Email us" and "Call us" render only when brand.email / brand.phone hold
 *    a confirmed value. Both are empty, so neither card appears. An empty
 *    "Call us" card invites a call that cannot be answered.
 *  - Furniture Lovers has a "Before you write" card linking to its delivery,
 *    returns, warranty and FAQ pages. This site has none of those pages yet,
 *    so that card is omitted rather than pointed at four 404s. TODO: add it
 *    once those pages exist.
 *  - Furniture Lovers' company card ends "This is an office, not a showroom.
 *    The website is the store." That is the OPPOSITE of this business, which
 *    has a genuine Sheffield showroom, so it is not copied.
 */
export function ContactView({ product }: { product?: ProductContext }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-bronze">Get in touch</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">Contact Us</h1>
        <p className="mt-5 text-sm leading-7 text-taupe">
          {product
            ? "Ask us anything about this piece — sizes, fabrics, configurations, or how it would work in your room. Send a message and we will come back to you."
            : "Have a question about a product, or a room you are furnishing? Send us a message and we will come back to you, or come and see the ranges in the showroom."}
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        {/* ── Main column: what you are asking about, then the form ── */}
        <div>
          {product && (
            <section
              aria-label="Product you are enquiring about"
              className="mb-4 rounded-card border border-smoke/60 bg-cream p-4 sm:p-5"
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

          {/* `key` forces a remount when the enquiry subject changes. Next's
              App Router keeps the same segment cache key across a
              search-param-only navigation, so moving between
              /contact?product=<slug> and /contact re-renders this form instead
              of remounting it. The textarea is uncontrolled, so its
              defaultValue would not be reapplied: the box kept the previous
              product's prefill while productSlug had already become undefined,
              which would send the shop a message naming a product with no link
              to it. */}
          <ContactForm
            key={product?.slug ?? "general"}
            productSlug={product?.slug}
            productName={product?.name}
          />
        </div>

        {/* ── Aside: small detail cards ─────────────────────────────── */}
        <aside className="grid content-start gap-4">
          {/* Renders only with a client-confirmed address. brand.email is still
              empty, so this card does not appear. */}
          {brand.email && (
            <Card icon={Mail} title="Email us">
              <a
                href={`mailto:${brand.email}`}
                className="font-semibold text-charcoal underline underline-offset-4 hover:text-forest transition-colors"
              >
                {brand.email}
              </a>
              <p className="mt-2 text-sm leading-6 text-taupe">
                The fastest way to reach us if you would rather not use the form.
              </p>
            </Card>
          )}

          {/* Same rule for the phone number. */}
          {brand.phone && (
            <Card icon={Phone} title="Call us">
              <a
                href={`tel:${brand.phone.replace(/\s+/g, "")}`}
                className="font-semibold text-charcoal underline underline-offset-4 hover:text-forest transition-colors"
              >
                {brand.phone}
              </a>
            </Card>
          )}

          <Card icon={MapPin} title="Visit the showroom">
            <p className="text-sm leading-6 text-taupe">{business.address}</p>
            <div className="mt-4 grid gap-1.5 border-t border-smoke/60 pt-4 text-sm">
              <p className="mb-1 inline-flex items-center gap-2 font-semibold text-charcoal">
                <Clock className="h-3.5 w-3.5 text-bronze" aria-hidden="true" />
                Opening hours
              </p>
              {business.hours.map(([day, time]) => (
                <div key={day} className="flex justify-between gap-4">
                  <span className="text-taupe">{day}</span>
                  <span className="text-charcoal">{time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Building2} title="Company details">
            <p className="text-sm leading-6 text-taupe">
              <span className="font-semibold text-charcoal">{brand.legalName}</span>
              {brand.companyNumber && (
                <>
                  <br />
                  Registered in England and Wales, company no. {brand.companyNumber}
                </>
              )}
              {brand.address.line1 && (
                <>
                  <br />
                  Registered office:{" "}
                  {[brand.address.line1, brand.address.line2, brand.address.city, brand.address.postcode]
                    .filter(Boolean)
                    .join(", ")}
                </>
              )}
            </p>
          </Card>

          <div className="grid min-h-56 place-items-center rounded-card border border-dashed border-smoke bg-linen p-6 text-center">
            <div>
              <MapPin className="mx-auto h-7 w-7 text-bronze" aria-hidden="true" />
              <p className="mt-3 font-display text-xl font-semibold text-charcoal">Google Maps embed</p>
              <p className="mt-1 text-xs leading-5 text-taupe">Map of the showroom goes here.</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Mail;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-smoke/60 bg-white p-5 shadow-card sm:p-6">
      <p className="mb-3 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-taupe">
        <Icon className="h-4 w-4 text-bronze" aria-hidden="true" />
        {title}
      </p>
      {children}
    </div>
  );
}
