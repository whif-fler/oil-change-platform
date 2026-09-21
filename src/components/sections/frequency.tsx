import { Clock, Repeat } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Frequency() {
  return (
    <section
      id="frequency"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            One‑time or&nbsp;monthly
          </h2>
          <p className="mx-auto max-w-2xl text-body text-text-muted">
            Choose the schedule that fits your&nbsp;kitchen.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          <article className="rounded-2xl bg-surface-raised p-8 ring-1 ring-border">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <Clock className="size-6 text-accent" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h4 font-semibold text-text">One‑time</h3>
            <p className="mb-6 text-sm leading-relaxed text-text-muted">
              Book a single service visit when you need it. No commitment,
              no&nbsp;recurring&nbsp;schedule.
            </p>
            <a
              href="#quote"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "w-full",
              })}
            >
              Request one‑time service
            </a>
          </article>

          <article className="rounded-2xl bg-accent p-8 text-accent-foreground">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-primary/15">
              <Repeat className="size-6 text-primary" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h4 font-semibold">Monthly</h3>
            <p className="mb-6 text-sm leading-relaxed text-accent-foreground/80">
              Regular monthly visits to keep your fryers running at their best.
              Schedule once, we&apos;ll take it from&nbsp;there.
            </p>
            <a
              href="#quote"
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full",
              })}
            >
              Set up monthly service
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
