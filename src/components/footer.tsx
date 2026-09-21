export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark py-10">
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-sm font-semibold text-text-on-dark">FreshOil</div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <li>
                <a
                  href="#services"
                  className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#frequency"
                  className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-text-on-dark/60 transition-colors hover:text-text-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <p className="text-xs text-text-on-dark/40">
            &copy; {year} FreshOil
          </p>
        </div>
      </div>
    </footer>
  );
}
