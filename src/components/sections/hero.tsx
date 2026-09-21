import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
            Onsite cooking-oil service
          </p>
          <h1 className="mb-6 text-h1 font-semibold leading-[var(--lh-h1)] tracking-[var(--ls-h1)] text-text-on-dark">
            We come to&nbsp;you
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-text-on-dark/80">
            Professional cooking-oil service for restaurants and&nbsp;cafes.
            We handle oil&nbsp;changes, deep&nbsp;cleaning, filter&nbsp;replacement,
            and waste‑oil disposal&nbsp;—&nbsp;right at your&nbsp;venue.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="#quote"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Get a Quote
            </a>
            <a
              href="#contact"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
