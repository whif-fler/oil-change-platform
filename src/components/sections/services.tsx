import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const oils = ["Canola", "Sunflower", "Palm", "Blend"];

export function Services() {
  return (
    <section
      id="services"
      className="bg-[linear-gradient(135deg,var(--gradient-soft-start)_0%,var(--gradient-soft-mid)_50%,var(--gradient-soft-end)_100%)] py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        <div className="mx-auto mb-14 max-w-[560px] text-center">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
            What we do
          </div>
          <h2 className="mb-3 text-[clamp(1.8rem,1rem+2vw,2.6rem)] font-semibold tracking-[-0.02em] text-text">
            Everything your kitchen needs
          </h2>
          <p className="text-[1.05rem] leading-[1.6] text-text-muted">
            Full-service fryer oil maintenance, handled onsite, on your
            schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 concept:grid-cols-[1.4fr_1fr]">
          <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card-token)] bg-surface-raised ring-1 ring-border shadow-card transition-shadow duration-300 hover:shadow-card-hover concept:row-span-2">
            <div className="relative aspect-[16/10] overflow-hidden concept:aspect-[16/13]">
              <Image
                src="/images/service-oil-change.jpg"
                alt="Deep frying basket being lowered into hot cooking oil"
                fill
                loading="lazy"
                sizes="(max-width: 819px) 100vw, 55vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-1.5 text-[1.5rem] font-bold text-text">
                Oil Change
              </h3>
              <p className="mb-3 text-[0.9rem] leading-[1.5] text-text-muted">
                Complete cooking-oil replacement for your fryers. We drain,
                refill, and ensure your oil is fresh and ready for service.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {oils.map((oil) => (
                  <Badge key={oil} variant="secondary">
                    {oil}
                  </Badge>
                ))}
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-5 concept:grid-cols-2">
            <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card-token)] bg-surface-raised ring-1 ring-border shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/service-deep-cleaning.jpg"
                  alt="Stainless steel commercial kitchen surface being cleaned"
                  fill
                  loading="lazy"
                  sizes="(max-width: 819px) 100vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-[1.2rem] font-bold text-text">
                  Deep Cleaning
                </h3>
                <p className="text-[0.9rem] leading-[1.5] text-text-muted">
                  Thorough cleaning of fryer tanks and equipment.
                </p>
              </div>
            </article>

            <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card-token)] bg-surface-raised ring-1 ring-border shadow-card transition-shadow duration-300 hover:shadow-card-hover">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/service-filter.jpg"
                  alt="Stainless steel fryer basket ready for filter replacement"
                  fill
                  loading="lazy"
                  sizes="(max-width: 819px) 100vw, 22vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-[1.2rem] font-bold text-text">
                  Filter Replacement
                </h3>
                <p className="text-[0.9rem] leading-[1.5] text-text-muted">
                  Regular filter swaps for cleaner oil, longer.
                </p>
              </div>
            </article>
          </div>

          <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card-token)] bg-surface-raised ring-1 ring-border shadow-card transition-shadow duration-300 hover:shadow-card-hover">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src="/images/service-waste-oil.jpg"
                alt="Commercial deep fryer basket in a professional kitchen"
                fill
                loading="lazy"
                sizes="(max-width: 819px) 100vw, 22vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-5">
              <h3 className="mb-1.5 text-[1.2rem] font-bold text-text">
                Waste-Oil Disposal
              </h3>
              <p className="text-[0.9rem] leading-[1.5] text-text-muted">
                Responsible collection and eco-friendly disposal, compliant
                with local regulations.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
