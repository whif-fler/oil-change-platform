const STEPS = [
  {
    step: 1,
    title: "Tell us what you need",
    description:
      "Select your equipment, oil type, and any add‑ons. Let us know your preferred date.",
  },
  {
    step: 2,
    title: "Choose a service time",
    description:
      "Pick a date that works for your kitchen. We work around your schedule.",
  },
  {
    step: 3,
    title: "We come to your venue",
    description:
      "Our team arrives at your restaurant or café with everything needed.",
  },
  {
    step: 4,
    title: "Service completed",
    description:
      "Oil changed, equipment cleaned, waste disposed. Your kitchen is ready.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text-on-dark">
            How it&nbsp;works
          </h2>
          <p className="mx-auto max-w-2xl text-body text-text-on-dark/70">
            Four simple steps from request to&nbsp;completion.
          </p>
        </div>

        {/* Journey grid with connecting lines */}
        <div className="relative">
          {/* Vertical connecting line (tablet — 2-col) */}
          <div
            className="absolute left-[23px] top-0 bottom-0 hidden w-px bg-primary/40 sm:block lg:hidden"
            aria-hidden="true"
          />

          {/* Horizontal connecting line (desktop — 4-col) */}
          <div
            className="absolute left-0 right-0 top-[27px] hidden h-px bg-primary/40 lg:block"
            aria-hidden="true"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {STEPS.map((step) => (
              <div key={step.step} className="relative text-center">
                <span className="mb-4 block text-5xl font-extrabold leading-none text-primary/40">
                  {String(step.step).padStart(2, "0")}
                </span>
                <div className="mx-auto mb-4 h-px w-12 bg-primary/40" />
                <h3 className="mb-2 text-h4 font-semibold text-text-on-dark">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-on-dark/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
