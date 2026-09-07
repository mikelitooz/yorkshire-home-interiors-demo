import { ChevronDown } from "lucide-react";

/**
 * Copied from the headless-ecommerce-storefront skill
 * (assets/components/FaqAccordion.tsx) and restyled onto this project's tokens.
 *
 * Plain <details>: works before hydration, needs no state, and stays open to a
 * crawler because the answer is in the DOM either way.
 *
 * TWO DEVIATIONS FROM THE ASSET, both deliberate:
 *  1. The asset renders each question as an <h2>. Here the accordion sits
 *     inside a section that already has its own <h2>, so questions are <h3> to
 *     keep the document outline correct.
 *  2. The asset carries `a` (ReactNode) and `aText` (its plain-text twin for
 *     schema) as separate fields, which can drift. These answers are plain
 *     prose, so a single string feeds both the rendered answer and the
 *     FAQPage schema, and drift is structurally impossible.
 */
export type FaqItem = {
  q: string;
  /** Plain text. Rendered on the page AND used verbatim in FAQPage schema. */
  a: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-6 max-w-3xl border-t border-smoke/60">
      {items.map(({ q, a }) => (
        <li key={q} className="border-b border-smoke/60">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left">
              <h3 className="text-sm font-semibold text-charcoal">{q}</h3>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-taupe transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>
            <div className="max-w-prose pb-5 text-sm leading-7 text-taupe">{a}</div>
          </details>
        </li>
      ))}
    </ul>
  );
}

/**
 * Built from the SAME array as the markup, so the schema can never name a
 * question the visitor cannot see, or give an answer the page does not show.
 */
export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}
