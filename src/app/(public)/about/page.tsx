import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About FreshOil — On-Site Cooking Oil Service",
  description:
    "FreshOil provides on-site cooking-oil service for restaurants and cafés — fryer oil changes, deep cleaning, filter replacement, and waste-oil disposal.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Page Hero — narrow, matching concept/about.html */}
      <section className="pb-2 pt-12">
        <div className="mx-auto max-w-[700px] px-[var(--shell-px-mobile)]">
          <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
            About FreshOil
          </div>
          <h1
            className="mb-3.5 font-semibold text-text"
            style={{
              fontSize: "clamp(2rem, 4vw, 2.8rem)",
              letterSpacing: "-0.02em",
            }}
          >
            Fryer oil service, built for restaurant kitchens
          </h1>
          <p className="text-[1.05rem] leading-[1.6] text-text-muted">
            FreshOil started with one idea: kitchen staff shouldn&apos;t have
            to drain, haul, and dispose of hot fryer oil themselves. We bring
            the service to&nbsp;you.
          </p>
        </div>
      </section>

      {/* Story section — gradient background */}
      <section className="bg-[linear-gradient(135deg,var(--gradient-soft-start)_0%,var(--gradient-soft-mid)_50%,var(--gradient-soft-end)_100%)] py-16">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="grid items-center gap-10 concept:grid-cols-2 concept:gap-10">
            {/* Visual */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-surface-dark">
              <Image
                src="/images/commercial-kitchen.jpg"
                alt="Stainless steel commercial kitchen equipment in a restaurant"
                fill
                loading="lazy"
                sizes="(max-width: 819px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div>
              <h2
                className="mb-3.5 font-semibold text-text"
                style={{
                  fontSize: "1.6rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Onsite, by design
              </h2>
              <p className="mb-3.5 text-[0.98rem] leading-[1.65] text-text-muted">
                Every visit is done at your venue, on a schedule that works
                around your service hours — not the other way around. No
                dropping equipment off, no downtime you didn&apos;t plan for.
              </p>
              <p className="text-[0.98rem] leading-[1.65] text-text-muted">
                We handle oil changes, deep cleaning, filter replacement, and
                compliant waste-oil disposal, so your kitchen stays ready
                without the&nbsp;mess.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values section — 3-column grid */}
      <section className="py-16">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="mx-auto mb-10 max-w-[560px] text-center">
            <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
              Why kitchens choose us
            </div>
            <h2
              className="font-semibold text-text"
              style={{
                fontSize: "clamp(1.7rem, 3vw, 2.3rem)",
                letterSpacing: "-0.02em",
              }}
            >
              What you can expect
            </h2>
          </div>

          <div className="grid gap-4.5 concept:grid-cols-3 concept:gap-4.5">
            <div className="rounded-[16px] border border-border bg-surface-raised p-6">
              <div className="mb-3 flex size-9 items-center justify-center rounded-[10px] bg-surface-dark text-primary font-extrabold">
                $
              </div>
              <h3 className="mb-1.5 text-[1.02rem] font-bold text-text">
                Upfront pricing
              </h3>
              <p className="text-[0.86rem] leading-[1.5] text-text-muted">
                Your estimate is confirmed before we book — no surprises on
                invoice&nbsp;day.
              </p>
            </div>

            <div className="rounded-[16px] border border-border bg-surface-raised p-6">
              <div className="mb-3 flex size-9 items-center justify-center rounded-[10px] bg-surface-dark text-primary font-extrabold">
                ✓
              </div>
              <h3 className="mb-1.5 text-[1.02rem] font-bold text-text">
                Reliable scheduling
              </h3>
              <p className="text-[0.86rem] leading-[1.5] text-text-muted">
                We show up when we say we will, with everything needed for
                the&nbsp;visit.
              </p>
            </div>

            <div className="rounded-[16px] border border-border bg-surface-raised p-6">
              <div className="mb-3 flex size-9 items-center justify-center rounded-[10px] bg-surface-dark text-primary font-extrabold">
                ♻
              </div>
              <h3 className="mb-1.5 text-[1.02rem] font-bold text-text">
                Responsible disposal
              </h3>
              <p className="text-[0.86rem] leading-[1.5] text-text-muted">
                Waste oil is collected and disposed of in line with local
                regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats section — dark background */}
      <section className="bg-surface-dark py-16 text-text-on-dark">
        <div className="mx-auto grid max-w-[var(--shell-max-w)] gap-5 px-[var(--shell-px-mobile)] text-center concept:grid-cols-3 concept:gap-5">
          <div>
            <div className="text-[2rem] font-extrabold text-primary">
              One-time
            </div>
            <div className="mt-1 text-[0.82rem] text-text-on-dark/65">
              or monthly service — your choice
            </div>
          </div>
          <div>
            <div className="text-[2rem] font-extrabold text-primary">
              Onsite
            </div>
            <div className="mt-1 text-[0.82rem] text-text-on-dark/65">
              every visit, at your venue
            </div>
          </div>
          <div>
            <div className="text-[2rem] font-extrabold text-primary">
              1 day
            </div>
            <div className="mt-1 text-[0.82rem] text-text-on-dark/65">
              typical response time on enquiries
            </div>
          </div>
        </div>
      </section>

      {/* CTA band — matching concept/about.html */}
      <section className="py-16">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="rounded-[var(--radius-section-token)] bg-[linear-gradient(135deg,var(--gradient-primary-start)_0%,var(--gradient-primary-end)_100%)] px-7 py-12 text-center">
            <h2 className="mb-1.5 text-[1.5rem] font-bold text-text">
              Ready to see pricing?
            </h2>
            <p className="mb-5 text-[0.9rem] text-text/70">
              Build a quote in under two minutes — no commitment required.
            </p>
            <Link
              href="/quote"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Build your quote
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
