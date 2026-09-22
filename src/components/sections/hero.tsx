import Image from "next/image";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-6 pt-6 pb-6">
      <div className="relative mx-auto max-w-[var(--shell-max-w)] overflow-hidden rounded-[var(--radius-hero-token)] bg-[radial-gradient(circle_at_15%_20%,rgba(216,255,52,0.16),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(52,79,61,0.9),transparent_55%),radial-gradient(circle_at_75%_15%,rgba(36,58,45,0.85),transparent_50%),linear-gradient(135deg,#17241C_0%,#1E2F24_45%,#243A2D_100%)] px-12 py-16">
        <div className="relative z-[2] grid items-center gap-12 concept:grid-cols-2">
          {/* Text */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-text-on-dark">
              <span className="size-[7px] rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)]" />
              Onsite cooking-oil service
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-[clamp(2.6rem,1rem+3vw,4rem)] leading-[1.05] tracking-[-0.03em] font-semibold text-text-on-dark">
              We come{" "}
              <span className="relative inline-block">
                to&nbsp;you.
                <span
                  className="absolute bottom-[0.08em] left-0 right-0 -z-10 h-[0.14em] bg-primary opacity-85"
                />
              </span>
            </h1>

            {/* Supporting text */}
            <p className="mb-9 max-w-[440px] text-[1.1rem] leading-[1.6] text-text-on-dark/75">
              Professional cooking-oil service for restaurants
              and&nbsp;cafés.&nbsp;Oil&nbsp;changes, deep&nbsp;cleaning,
              filter&nbsp;replacement, and waste&#8209;oil
              disposal&nbsp;—&nbsp;right at your&nbsp;venue.
            </p>

            {/* CTAs */}
            <div className="mb-5 flex flex-wrap gap-3.5">
              <a
                href="/quote"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                Get a Quote
                <span aria-hidden="true">→</span>
              </a>
              <a
                href="/contact"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "border-white/25 bg-transparent text-text-on-dark hover:bg-white/10 hover:text-text-on-dark dark:border-white/25 dark:bg-transparent",
                })}
              >
                Contact Us
              </a>
            </div>

            {/* Microcopy */}
            <div className="flex items-center gap-1.5 text-[0.8rem] text-text-on-dark/55">
              <Check className="size-3.5" aria-hidden="true" />
              <span>Built for restaurants and cafés. Ready when you are.</span>
            </div>
          </div>

          {/* Image side */}
          <div className="relative">
            {/* Glow ring */}
            <div
              className="pointer-events-none absolute -inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(216,255,52,0.08)_0%,transparent_65%)]"
              aria-hidden="true"
            />

            {/* Photo frame */}
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
                <Image
                  src="/images/hero-commercial-fryer.jpg"
                  alt="Commercial deep fryer with stainless steel basket in a restaurant kitchen"
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Float card 1 — top right */}
              <div className="absolute -right-6 -top-[22px] z-10 block rounded-[var(--radius-panel-token)] border border-white/[0.12] bg-[rgba(23,36,28,0.85)] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-[8px]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex size-[22px] items-center justify-center rounded-[6px] bg-primary text-[0.75rem] font-extrabold text-primary-foreground">
                    ✓
                  </span>
                  <span className="text-[0.8rem] font-bold text-text-on-dark">
                    On time, every time
                  </span>
                </div>
                <p className="text-caption text-text-on-dark/60">
                  Scheduled around your service hours
                </p>
              </div>

              {/* Float card 2 — bottom left */}
              <div className="absolute -bottom-[22px] -left-6 z-10 block rounded-[var(--radius-panel-token)] border border-white/[0.12] bg-[rgba(23,36,28,0.85)] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.3)] backdrop-blur-[8px]">
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex size-[22px] items-center justify-center rounded-[6px] bg-primary text-[0.75rem] font-extrabold text-primary-foreground">
                    $
                  </span>
                  <span className="text-[0.8rem] font-bold text-text-on-dark">
                    Upfront pricing
                  </span>
                </div>
                <p className="text-caption text-text-on-dark/60">
                  No surprises, confirmed on booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
