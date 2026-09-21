import { buttonVariants } from "@/components/ui/button";

export function QuoteCta() {
  return (
    <section
      id="quote"
      className="bg-primary py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-primary-foreground">
            Get your&nbsp;quote
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Tell us about your kitchen setup and we&apos;ll provide an estimate
            in&nbsp;seconds.
          </p>
          <a
            href="#quote-builder"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            Start configuring
          </a>
        </div>
      </div>
    </section>
  );
}
