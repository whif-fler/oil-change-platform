import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "About — FreshOil",
  description:
    "FreshOil provides onsite fryer oil and kitchen service for restaurants and cafés.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text-on-dark">
              About FreshOil
            </h1>
            <p className="text-body text-text-on-dark/70">
              Onsite fryer oil and kitchen service for restaurants and cafés.
              We come to your venue, handle the service, and help keep your
              kitchen running&nbsp;smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
          <div className="mx-auto grid max-w-4xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-4 text-h3 font-semibold text-text">
                What we&nbsp;do
              </h2>
              <div className="space-y-4 text-body text-text-muted">
                <p>
                  FreshOil provides professional cooking-oil service for
                  commercial kitchens. We handle oil changes, deep cleaning,
                  filter replacement, and waste-oil disposal — all at your
                  venue, on your&nbsp;schedule.
                </p>
                <p>
                  Our team works with restaurants, cafés, and other food
                  services that rely on deep fryers. We bring everything
                  needed and leave your kitchen ready for&nbsp;service.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <div className="aspect-[3/2]">
                <Image
                  src="/images/commercial-kitchen.jpg"
                  alt="Stainless steel commercial kitchen equipment in a restaurant"
                  fill
                  loading="lazy"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-h3 font-semibold text-text-on-dark">
              How we&nbsp;work
            </h2>
            <p className="mb-12 text-body text-text-on-dark/70">
              Three principles that guide every&nbsp;visit.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            <div className="text-center">
              <span className="mb-3 block text-4xl font-extrabold text-primary/40">
                01
              </span>
              <h3 className="mb-2 text-h4 font-semibold text-text-on-dark">
                We come to&nbsp;you
              </h3>
              <p className="text-sm leading-relaxed text-text-on-dark/70">
                Our team arrives at your restaurant or café with everything
                needed for the&nbsp;service.
              </p>
            </div>
            <div className="text-center">
              <span className="mb-3 block text-4xl font-extrabold text-primary/40">
                02
              </span>
              <h3 className="mb-2 text-h4 font-semibold text-text-on-dark">
                We work around your&nbsp;operation
              </h3>
              <p className="text-sm leading-relaxed text-text-on-dark/70">
                Service is scheduled around your business hours so your
                kitchen stays&nbsp;operational.
              </p>
            </div>
            <div className="text-center">
              <span className="mb-3 block text-4xl font-extrabold text-primary/40">
                03
              </span>
              <h3 className="mb-2 text-h4 font-semibold text-text-on-dark">
                We keep it&nbsp;straightforward
              </h3>
              <p className="text-sm leading-relaxed text-text-on-dark/70">
                Clear pricing, simple scheduling, no complicated
                processes. Just reliable&nbsp;service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] text-center lg:px-[var(--shell-px-desktop)]">
          <h2 className="mb-4 text-h3 font-semibold text-text">
            Ready to get&nbsp;started?
          </h2>
          <p className="mb-8 text-body text-text-muted">
            Configure your service and see an estimate in&nbsp;seconds.
          </p>
          <Link
            href="/quote"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Get a quote
          </Link>
        </div>
      </section>
    </>
  );
}
