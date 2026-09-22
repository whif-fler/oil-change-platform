export function Frequency() {
  return (
    <section
      id="frequency"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mx-auto mb-14 max-w-[560px] text-center">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
            Flexible scheduling
          </div>
          <h2 className="mb-3 text-[clamp(1.8rem,1rem+2vw,2.6rem)] font-semibold tracking-[-0.02em] text-text">
            One‑time or&nbsp;monthly
          </h2>
          <p className="text-[1.05rem] leading-[1.6] text-text-muted">
            Choose the schedule that fits your&nbsp;kitchen.
          </p>
        </div>

        <div className="grid w-full gap-5 concept:grid-cols-2">
          <article className="flex flex-col rounded-[var(--radius-card-token)] bg-surface-raised p-8 ring-1 ring-border">
            <h3 className="mb-2 text-[1.3rem] font-bold text-text">One‑time</h3>
            <p className="mb-5 text-[0.92rem] leading-[1.5] text-text-muted">
              Book a single service visit when you need it. No recurring
              schedule&nbsp;required.
            </p>
            <div className="mt-auto">
              <a
                href="/quote?frequency=ONE_TIME"
                className="text-[0.88rem] font-bold text-text transition-opacity hover:opacity-70"
              >
                Request one‑time service →
              </a>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[var(--radius-card-token)] bg-surface-dark p-8 text-text-on-dark">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(216,255,52,0.12),transparent_45%)]"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <div className="mb-3.5 inline-block rounded-full bg-primary px-2.5 py-1 text-caption font-extrabold text-primary-foreground">
                Save 10%
              </div>
              <h3 className="mb-2 text-[1.3rem] font-bold">Monthly</h3>
              <p className="mb-5 text-[0.92rem] leading-[1.5] text-text-on-dark/70">
              Regular monthly visits to keep your fryers running at their best.
                We&apos;ll schedule each visit in advance.
              </p>
              <div className="mt-auto">
                <a
                  href="/quote?frequency=MONTHLY"
                  className="text-[0.88rem] font-bold text-primary transition-opacity hover:opacity-70"
                >
                  Set up monthly service →
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
