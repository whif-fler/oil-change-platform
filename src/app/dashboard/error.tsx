"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
        <svg
          className="size-8 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h2 className="text-h4 font-semibold text-text">Something went wrong</h2>
      <p className="mt-2 max-w-sm text-body text-text-muted">
        An error occurred while loading the dashboard. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.refresh()}
          aria-label="Try loading the dashboard again"
        >
          Try again
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => (window.location.href = "/login")}
          aria-label="Go to login page"
        >
          Sign in
        </Button>
      </div>
      {error.digest && (
        <p className="mt-4 text-caption text-text-muted">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
