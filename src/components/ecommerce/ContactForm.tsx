"use client";

import { useRef, useState } from "react";
import { AlertCircle, Info } from "lucide-react";
import { ENQUIRY_LIMITS, prefilledMessage } from "@/lib/enquiry";

/**
 * Adapted from the headless-ecommerce-storefront skill
 * (assets/components/ContactForm.tsx), restyled onto this project's tokens.
 *
 * Two rules shape it: the thank-you appears ONLY after the server said the
 * enquiry was accepted — a confirmation the customer believes and we never
 * received is worse than an error — and submit is locked while a request is in
 * flight so a second click cannot send twice.
 *
 * DEVIATIONS FROM THE ASSET:
 *  1. Only the product SLUG is posted. The server rebuilds name, category and
 *     URL from the catalogue, so nothing about the product is believed from the
 *     browser. See src/lib/enquiry.ts.
 *  2. A 503 carrying reason "no-upstream" renders as a neutral, explanatory
 *     panel rather than a red error. The message genuinely was not sent, and
 *     the panel says so, but this is a configured-state-not-yet-reached rather
 *     than something the visitor should retry. It disappears on its own the
 *     moment the n8n webhook env vars are set.
 */
const FRIENDLY: Record<string, string> = {
  "invalid body": "Something went wrong sending that. Please try again.",
  forbidden: "Something went wrong sending that. Please try again.",
  "message too long": "That message is a little too long. Please shorten it and try again.",
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string; fallbackEmail?: string }
  | { state: "not-connected"; message: string; fallbackEmail?: string };

export function ContactForm({
  productSlug,
  productName,
}: {
  productSlug?: string;
  productName?: string;
}) {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const sending = status.state === "sending";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const data = new FormData(event.currentTarget);
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          // The slug is the ONLY thing the server takes from us about the product.
          productSlug: productSlug ?? undefined,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        error?: string;
        reason?: string;
        fallbackEmail?: string;
      };
      if (!res.ok) {
        const raw = body.error ?? "";
        const message = FRIENDLY[raw] || raw || "Something went wrong. Please try again.";
        setStatus({
          state: body.reason === "no-upstream" ? "not-connected" : "error",
          message,
          fallbackEmail: body.fallbackEmail,
        });
        return;
      }
      setStatus({ state: "sent" });
      formRef.current?.reset();
    } catch {
      setStatus({
        state: "error",
        message: "We could not reach the server. Please check your connection and try again.",
      });
    }
  }

  if (status.state === "sent") {
    return (
      <div role="status" className="rounded-card border border-smoke/60 bg-cream p-8 text-center sm:p-10">
        <h2 className="font-display text-2xl font-bold text-charcoal">Message sent</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-taupe">
          Thanks for your enquiry. We will get back to you as soon as possible.
        </p>
        <button type="button" onClick={() => setStatus({ state: "idle" })} className="btn-secondary mt-7">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      <h2 className="font-display text-2xl font-bold text-charcoal">
        {productName ? "Ask about this product" : "Send us a message"}
      </h2>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" name="name" type="text" autoComplete="name" required maxLength={ENQUIRY_LIMITS.name} disabled={sending} />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional maxLength={ENQUIRY_LIMITS.phone} disabled={sending} />
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" required maxLength={ENQUIRY_LIMITS.email} disabled={sending} />
        <div>
          <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            disabled={sending}
            maxLength={ENQUIRY_LIMITS.message}
            defaultValue={productName ? `${prefilledMessage(productName)}\n\n` : ""}
            className="mt-1.5 w-full resize-y rounded-lg border border-smoke bg-white p-4 text-sm leading-7 text-charcoal outline-none transition-colors placeholder:text-taupe focus:border-forest focus:ring-1 focus:ring-forest"
          />
        </div>
      </div>

      {status.state === "error" && (
        <p role="alert" className="mt-5 flex gap-2 rounded-card border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-charcoal">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>
            {status.message}
            {status.fallbackEmail && (
              <>
                {" "}
                <a href={`mailto:${status.fallbackEmail}`} className="font-semibold text-forest underline underline-offset-4">
                  {status.fallbackEmail}
                </a>
              </>
            )}
          </span>
        </p>
      )}

      {status.state === "not-connected" && (
        <div role="alert" className="mt-5 flex gap-2 rounded-card border border-bronze/40 bg-linen px-4 py-3 text-sm leading-6 text-charcoal">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-bronze" aria-hidden="true" />
          <span>
            {status.message}
            {status.fallbackEmail && (
              <>
                {" "}
                <a href={`mailto:${status.fallbackEmail}`} className="font-semibold text-forest underline underline-offset-4">
                  {status.fallbackEmail}
                </a>
              </>
            )}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="btn-primary mt-6 w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {sending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
  optional,
  maxLength,
  disabled,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
  required?: boolean;
  optional?: boolean;
  maxLength: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
        {label}
        {optional && <span className="ml-1.5 font-normal normal-case tracking-normal text-taupe">(optional)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className="input-field mt-1.5 w-full"
      />
    </div>
  );
}
