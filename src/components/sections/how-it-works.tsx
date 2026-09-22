const STEPS = [
  {
    step: 1,
    title: "Tell us what you need",
    description:
      "Select equipment, oil type, and add-ons. Let us know your preferred date.",
  },
  {
    step: 2,
    title: "Choose a service time",
    description:
      "Pick a date that works for your kitchen — we work around your schedule.",
  },
  {
    step: 3,
    title: "We come to your venue",
    description:
      "Our team arrives with everything needed for the service.",
  },
  {
    step: 4,
    title: "Service completed",
    description:
      "Oil changed, equipment cleaned, waste disposed. Kitchen ready.",
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        {/* Centered header */}
        <div className="mx-auto mb-14 max-w-[560px] text-center">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-primary">
            How it works
          </div>
          <h2 className="mb-3 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text-on-dark">
            Four steps, zero hassle
          </h2>
          <p className="text-[1.05rem] leading-[1.6] text-text-on-dark/65">
            From request to a ready kitchen — no complicated process.
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="relative flex flex-col gap-7 concept:flex-row concept:gap-0">
          {STEPS.map((step, i) => (
            <div
              key={step.step}
              className="relative flex-1 px-0 text-left concept:px-5"
            >
              {/* Connecting line (desktop only, not on first step) */}
              {i > 0 && (
                <div className="absolute top-[5px] left-0 right-5 hidden h-px bg-white/15 concept:block" />
              )}

              <div className="relative z-10 mb-3.5 inline-block bg-surface-dark px-1 text-caption font-extrabold leading-none text-primary">
                {String(step.step).padStart(2, "0")}
              </div>
              <h4 className="mb-2 text-[1.05rem] font-bold text-text-on-dark">
                {step.title}
              </h4>
              <p className="text-[0.85rem] leading-[1.5] text-text-on-dark/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
