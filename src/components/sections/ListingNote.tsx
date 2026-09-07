import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { ListingCopy } from "@/config/category-copy";

/**
 * The long note below a listing grid: several headed sections, a related
 * collections block, then the FAQ accordion whose questions also feed FAQPage
 * schema.
 *
 * Shared by /shop and every /category/<slug> page so the two cannot drift into
 * different shapes. Structure follows the Furniture Lovers storefront, whose
 * collection pages break the note into topic sections plus "Common questions"
 * rather than one block of prose.
 *
 * The FAQ list is passed to faqPageSchema() by the calling page from the SAME
 * array rendered here, so schema can never name a question the visitor cannot
 * see.
 */
export function ListingNote({
  copy,
  related,
  faqHeading,
}: {
  copy: ListingCopy;
  /** Sibling listings to link to. Omitted entirely when empty. */
  related?: { slug: string; name: string }[];
  faqHeading: string;
}) {
  return (
    <section
      aria-labelledby="listing-note"
      className="mt-14 rounded-card border border-smoke/50 bg-white p-6 shadow-card sm:p-8 lg:p-10"
    >
      <h2 id="listing-note" className="sr-only">
        More about {copy.h1}
      </h2>

      <div className="max-w-3xl space-y-9">
        {copy.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="font-display text-xl font-bold text-charcoal sm:text-2xl">
              {section.heading}
            </h3>
            <div className="mt-3 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-sm leading-7 text-taupe">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {related && related.length > 0 && (
        <div className="mt-10 border-t border-smoke/60 pt-8">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-taupe">
            Related collections
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/category/${item.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-smoke px-3 py-2 text-sm font-medium text-charcoal transition-colors hover:border-forest hover:bg-linen hover:text-forest"
                >
                  {item.name}
                  <ArrowRight className="h-3.5 w-3.5 text-taupe" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {copy.faqs.length > 0 && (
        <div className="mt-10 border-t border-smoke/60 pt-8">
          <h3 className="font-display text-xl font-bold text-charcoal sm:text-2xl">{faqHeading}</h3>
          <FaqAccordion items={copy.faqs} />
        </div>
      )}
    </section>
  );
}
