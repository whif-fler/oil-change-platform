import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-surface-dark py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Text */}
          <div className="text-center lg:text-left">
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
              Onsite cooking-oil service
            </p>
            <h1 className="mb-6 text-h1 font-semibold leading-[var(--lh-h1)] tracking-[var(--ls-h1)] text-text-on-dark">
              We come to&nbsp;you
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-text-on-dark/80">
              Professional cooking-oil service for restaurants and&nbsp;cafés.
              Oil&nbsp;changes, deep&nbsp;cleaning, filter&nbsp;replacement,
              and waste‑oil disposal&nbsp;—&nbsp;right at your&nbsp;venue.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href="/quote"
                className={buttonVariants({ variant: "default", size: "lg" })}
              >
                Get a Quote
              </a>
              <a
                href="#contact"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl lg:max-w-none">
            <div className="aspect-[3/2]">
              <Image
                src="/images/hero-commercial-fryer.jpg"
                alt="Commercial deep fryer with stainless steel basket in a restaurant kitchen"
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
