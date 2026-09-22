import { buttonVariants } from "@/components/ui/button";

export function QuoteCta() {
  return (
    <section
      id="quote"
      className="bg-surface-dark py-12 lg:py-16"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-h3 font-semibold text-text-on-dark">
            Ready to get&nbsp;started?
          </h2>
          <p className="mb-8 text-body text-text-on-dark/70">
            Configure your service and see an estimate&nbsp;in&nbsp;seconds.
          </p>
          <a
            href="#quote-builder"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Build your quote
          </a>
        </div>
      </div>
    </section>
  );
}
