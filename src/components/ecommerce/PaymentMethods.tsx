import { paymentMethods, paymentMethodsAreConfirmed } from "@/config/brand";

/**
 * "Ways to pay", under the buying controls, because "can I use Klarna for
 * this?" is asked while looking at the price, not four screens later.
 *
 * Copied from the headless-ecommerce-storefront skill
 * (assets/components/PaymentMethods.tsx) and restyled onto this project's
 * Tailwind tokens (charcoal / taupe / smoke / linen / rounded-card).
 *
 * The LIST is a claim: it must match what the gateway actually has enabled, and
 * it lives in config beside the other claims. The credit option is first; on
 * big-ticket items it is often the decision.
 *
 * While `paymentMethodsAreConfirmed` is false the row renders inside a dashed
 * sample frame with an explicit notice, so nobody reading the page — client or
 * customer — can mistake demo content for a confirmed list of accepted methods.
 *
 * Colour + name badges, not redrawn logos. Approximating a logotype in
 * whatever font is loaded produces something that reads as counterfeit, which
 * is the opposite of the reassurance the row exists to give. Mastercard's
 * circles are a shape and can be drawn exactly. Official SVG brand kits drop
 * into MARKS below with nothing else changing.
 */
type Mark = { bg: string; fg: string; border?: string; glyph?: React.ReactNode };

const MastercardGlyph = (
  <svg viewBox="0 0 32 20" className="h-3.5 w-[22px]" aria-hidden="true" focusable="false">
    <circle cx="12" cy="10" r="8" fill="#EB001B" />
    <circle cx="20" cy="10" r="8" fill="#F79E1B" />
    <path d="M16 3.8a8 8 0 0 0 0 12.4 8 8 0 0 0 0-12.4Z" fill="#FF5F00" />
  </svg>
);

const MARKS: Record<string, Mark> = {
  Klarna: { bg: "#FFB3C7", fg: "#0B051D" },
  Visa: { bg: "#1434CB", fg: "#FFFFFF" },
  Mastercard: { bg: "#FFFFFF", fg: "#1A1A1A", border: "#DDDDDD", glyph: MastercardGlyph },
  Amex: { bg: "#006FCF", fg: "#FFFFFF" },
  "Apple Pay": { bg: "#000000", fg: "#FFFFFF" },
  "Google Pay": { bg: "#FFFFFF", fg: "#3C4043", border: "#DADCE0" },
  PayPal: { bg: "#FFC439", fg: "#003087" },
};

const FALLBACK: Mark = { bg: "#FFFFFF", fg: "#1A1A1A", border: "#DDDDDD" };

export function PaymentMethods() {
  if (paymentMethods.length === 0) return null;

  return (
    <section className="mt-6 border-t border-smoke/50 pt-5" aria-labelledby="payment-methods">
      <div className="flex flex-wrap items-center gap-2">
        <h2
          id="payment-methods"
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-taupe"
        >
          Ways to pay
        </h2>
        {!paymentMethodsAreConfirmed && (
          <span className="rounded-md border border-bronze/40 bg-linen px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bronze">
            Sample
          </span>
        )}
      </div>

      <ul
        className={
          paymentMethodsAreConfirmed
            ? "mt-3 flex flex-wrap items-center gap-2"
            : "mt-3 flex flex-wrap items-center gap-2 rounded-card border border-dashed border-bronze/40 bg-cream p-3"
        }
      >
        {paymentMethods.map((method) => {
          const mark = MARKS[method.label] ?? FALLBACK;
          return (
            <li key={method.label}>
              {/* The accessible name carries the full description; title alone is invisible to touch. */}
              <span
                aria-label={method.description}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-bold tracking-tight"
                style={{ backgroundColor: mark.bg, color: mark.fg, border: `1px solid ${mark.border ?? mark.bg}` }}
              >
                {mark.glyph}
                {method.label}
              </span>
            </li>
          );
        })}
      </ul>

      {!paymentMethodsAreConfirmed && (
        <p className="mt-2 text-[11px] leading-5 text-taupe">
          Sample content for this demo. The payment methods Yorkshire Home Interiors accepts have
          not been confirmed yet, so this row does not state which are available.
        </p>
      )}
    </section>
  );
}
