"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
] as const;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // Focus the first interactive element when menu opens
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const focusable = getFocusableElements(menu);
    if (focusable.length > 0) {
      focusable[0]!.focus();
    }
  }, [menuOpen]);

  // Focus trap + Escape key handler
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;

    const menu = menuRef.current;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        triggerRef.current?.focus();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusableElements(menu);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    menu.addEventListener("keydown", handleKeyDown);
    return () => menu.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Apply inert to sibling content when menu is open
  useEffect(() => {
    if (!triggerRef.current) return;

    const headerEl = triggerRef.current.closest("header");
    if (!headerEl?.parentElement) return;

    // Find all direct children of the parent except the header itself
    const siblings = Array.from(headerEl.parentElement.children).filter(
      (el) => el !== headerEl,
    );

    siblings.forEach((el) => {
      if (menuOpen) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });

    // Cleanup: remove inert when unmounting
    return () => {
      siblings.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
    };
  }, [menuOpen]);

  function handleLinkClick() {
    closeMenu();
    triggerRef.current?.focus();
  }

  return (
    <header className="sticky top-0 z-50 bg-surface-dark shadow-sticky-header">
      <div className="mx-auto flex max-w-[var(--shell-max-w)] items-center justify-between px-[var(--shell-px-mobile)] py-4 md:px-[var(--shell-px-desktop)]">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
        >
          FreshOil
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold leading-tight text-text-on-dark opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-bold leading-tight text-text-on-dark opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark"
              >
                {link.label}
              </a>
            ),
          )}
          <a
            href="/quote"
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            Get a Quote
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          ref={triggerRef}
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-text-on-dark transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus md:hidden"
          onClick={() => {
            if (menuOpen) {
              closeMenu();
              triggerRef.current?.focus();
            } else {
              setMenuOpen(true);
            }
          }}
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
          ref={menuRef}
          id="mobile-menu"
          className="border-t border-white/10 px-[var(--shell-px-mobile)] pb-6 pt-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block text-base font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={handleLinkClick}
                    className="block text-base font-semibold text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a
              href="/quote"
              onClick={handleLinkClick}
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
