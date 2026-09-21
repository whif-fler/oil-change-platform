import { ClipboardList, Calendar, MapIcon, CheckCircle } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    step: 1,
    title: "Tell us what you need",
    description:
      "Select your equipment, oil type, and any add‑ons. Let us know your preferred date.",
  },
  {
    icon: Calendar,
    step: 2,
    title: "Choose a service time",
    description:
      "Pick a date that works for your kitchen. We work around your schedule.",
  },
  {
    icon: MapIcon,
    step: 3,
    title: "We come to your venue",
    description:
      "Our team arrives at your restaurant or cafe with everything needed.",
  },
  {
    icon: CheckCircle,
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {STEPS.map((step) => (
            <div key={step.step} className="text-center">
              <div className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full bg-primary text-surface-dark">
                <step.icon className="size-7" aria-hidden="true" />
              </div>
              <span className="mb-2 block text-caption font-bold uppercase tracking-wider text-primary">
                Step {step.step}
              </span>
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
    </section>
  );
}
