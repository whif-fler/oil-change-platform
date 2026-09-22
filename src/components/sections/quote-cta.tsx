import { buttonVariants } from "@/components/ui/button";

export function QuoteCta() {
  return (
    <section
      id="quote"
      className="bg-surface py-14"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        <div className="w-full rounded-[var(--radius-hero)] bg-[linear-gradient(135deg,var(--gradient-primary-start)_0%,var(--gradient-primary-end)_100%)] px-8 py-14 text-center">
          <h2 className="mb-3 text-[1.7rem] leading-[1.2] tracking-[-0.02em] font-bold text-text">
            Ready to get&nbsp;started?
          </h2>
          <p className="mb-8 text-body text-text/70">
            Configure your service and see an estimate&nbsp;in&nbsp;seconds.
          </p>
          <a
            href="/quote"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Build your quote
          </a>
        </div>
      </div>
    </section>
  );
}
