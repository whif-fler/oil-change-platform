import { Droplets, Sparkles, Filter, Recycle } from "lucide-react";

const SERVICES = [
  {
    icon: Droplets,
    title: "Oil Change",
    description:
      "Complete cooking-oil replacement for your fryers. We drain, refill, and ensure your oil is fresh and ready for service.",
  },
  {
    icon: Sparkles,
    title: "Deep Cleaning",
    description:
      "Thorough cleaning of fryer tanks and equipment. Removes built-up grease and residue for a hygienic kitchen.",
  },
  {
    icon: Filter,
    title: "Filter Replacement",
    description:
      "Regular filter swaps to keep your frying system running efficiently and your oil cleaner for longer.",
  },
  {
    icon: Recycle,
    title: "Waste-Oil Disposal",
    description:
      "Responsible collection and disposal of used cooking oil. Eco-friendly handling compliant with local regulations.",
  },
] as const;

export function Services() {
  return (
    <section
      id="services"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-12 text-center lg:mb-16">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            What we&nbsp;do
          </h2>
          <p className="mx-auto max-w-2xl text-body text-text-muted">
            Everything your commercial kitchen needs to keep frying safely
            and&nbsp;efficiently.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {SERVICES.map((service) => (
            <article
              key={service.title}
              className="rounded-2xl bg-surface-raised p-6 ring-1 ring-border lg:p-8"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
                <service.icon className="size-6 text-accent" aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-h4 font-semibold text-text">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
