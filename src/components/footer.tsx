import Link from "next/link";

const SERVICE_LINKS = [
  { label: "Oil Change", href: "#services" },
  { label: "Deep Cleaning", href: "#services" },
  { label: "Filter Replacement", href: "#services" },
  { label: "Waste-Oil Disposal", href: "#services" },
] as const;

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Get a Quote", href: "/quote" },
  { label: "Contact", href: "/#contact" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark py-12 lg:py-16">
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-lg font-extrabold tracking-tight text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              FreshOil
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-on-dark/60">
              Onsite cooking-oil service for restaurants and cafés. We come to
              you.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-on-dark/40">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-on-dark/40">
              Company
            </h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-on-dark/40">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-text-on-dark/60">
                  hello@freshoil.com
                </span>
              </li>
              <li>
                <span className="text-sm text-text-on-dark/60">
                  (02) 1234 5678
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-text-on-dark/40">
            &copy; {year} FreshOil. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
