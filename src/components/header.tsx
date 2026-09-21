"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#frequency" },
  { label: "Contact", href: "#contact" },
] as const;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-dark shadow-sticky-header">
      <div className="mx-auto flex max-w-[var(--shell-max-w)] items-center justify-between px-[var(--shell-px-mobile)] py-4 md:px-[var(--shell-px-desktop)]">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
        >
          FreshOil
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold leading-tight text-text-on-dark opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#quote"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Get a Quote
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-text-on-dark transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="border-t border-white/10 px-[var(--shell-px-mobile)] pb-6 pt-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a
              href="#quote"
              onClick={() => setMenuOpen(false)}
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full",
              })}
            >
              Get a Quote
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
