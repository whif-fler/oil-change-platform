import Image from "next/image";
import { Droplets, Sparkles, Filter, Recycle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

        {/* Bento grid — 2-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:auto-rows-fr lg:grid-cols-4 lg:gap-8">
          {/* Oil Change — hero card */}
          <article className="group flex flex-col rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card transition-all duration-300 hover:shadow-card-hover md:p-8">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <Droplets className="size-6 text-accent" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h3 font-semibold text-text">
              Oil Change
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-text-muted lg:text-base">
              Complete cooking-oil replacement for your fryers. We drain,
              refill, and ensure your oil is fresh and ready for service.
            </p>
            <div className="mb-6 flex flex-wrap gap-1.5">
              {["Canola", "Sunflower", "Palm", "Blend"].map((oil) => (
                <Badge key={oil} variant="secondary">
                  {oil}
                </Badge>
              ))}
            </div>
            <div className="relative mt-auto hidden overflow-hidden rounded-xl md:block">
              <div className="aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/service-oil-change.jpg"
                  alt="Deep frying basket being lowered into hot cooking oil"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>

          {/* Deep Cleaning — with image on desktop */}
          <article className="group flex flex-col rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card transition-all duration-300 hover:shadow-card-hover lg:p-8">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <Sparkles className="size-6 text-accent" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h4 font-semibold text-text">
              Deep Cleaning
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">
              Thorough cleaning of fryer tanks and equipment. Removes
              built-up grease and residue for a hygienic kitchen.
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["Countertop", "Floor", "Fryer Bank"].map((eq) => (
                <Badge key={eq} variant="secondary">
                  {eq}
                </Badge>
              ))}
            </div>
            <div className="relative mt-auto hidden overflow-hidden rounded-xl lg:block">
              <div className="aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/service-deep-cleaning.jpg"
                  alt="Stainless steel commercial kitchen surface being cleaned"
                  fill
                  loading="lazy"
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>

          {/* Filter Replacement — with image on desktop */}
          <article className="group flex flex-col rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card transition-all duration-300 hover:shadow-card-hover lg:p-8">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <Filter className="size-6 text-accent" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h4 font-semibold text-text">
              Filter Replacement
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">
              Regular filter swaps to keep your frying system running
              efficiently and your oil cleaner for longer.
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["Countertop", "Floor", "Fryer Bank"].map((eq) => (
                <Badge key={eq} variant="secondary">
                  {eq}
                </Badge>
              ))}
            </div>
            <div className="relative mt-auto hidden overflow-hidden rounded-xl lg:block">
              <div className="aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/service-filter.jpg"
                  alt="Stainless steel fryer basket ready for filter replacement"
                  fill
                  loading="lazy"
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>

          {/* Waste-Oil Disposal — with image on desktop */}
          <article className="group flex flex-col rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card transition-all duration-300 hover:shadow-card-hover lg:p-8">
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-surface-muted">
              <Recycle className="size-6 text-accent" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h4 font-semibold text-text">
              Waste-Oil Disposal
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-text-muted">
              Responsible collection and disposal of used cooking oil.
              Eco-friendly handling compliant with local regulations.
            </p>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {["Countertop", "Floor", "Fryer Bank"].map((eq) => (
                <Badge key={eq} variant="secondary">
                  {eq}
                </Badge>
              ))}
            </div>
            <div className="relative mt-auto hidden overflow-hidden rounded-xl lg:block">
              <div className="aspect-[3/2] transition-transform duration-500 group-hover:scale-[1.02]">
                <Image
                  src="/images/service-waste-oil.jpg"
                  alt="Commercial deep fryer basket in a professional kitchen"
                  fill
                  loading="lazy"
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
