import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-h3 font-semibold text-text">Enquiry not found</h1>
      <p className="mt-2 max-w-sm text-body text-text-muted">
        The enquiry you are looking for does not exist or may have been removed.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
