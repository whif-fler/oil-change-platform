import { QuoteBuilder } from "@/components/quote-builder";

export function QuoteBuilderSection() {
  return (
    <section
      id="quote-builder"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-10 text-center lg:mb-14">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            Configure your service
          </h2>
          <p className="mx-auto max-w-2xl text-body text-text-muted">
            Select your equipment, oil type, and any add‑ons to see
            an&nbsp;estimated&nbsp;price.
          </p>
        </div>
        <QuoteBuilder />
      </div>
    </section>
  );
}
