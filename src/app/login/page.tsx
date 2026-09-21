"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginForm() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from");
  // Prevent open redirects: only allow internal relative paths starting with /
  // Rejects //evil.com, https://evil.com, javascript:..., etc.
  const from =
    rawFrom && rawFrom.startsWith("/") && !rawFrom.startsWith("//")
      ? rawFrom
      : "/dashboard";
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: String(formData.get("username") ?? ""),
          password: String(formData.get("password") ?? ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? "Invalid credentials.");
        setSubmitting(false);
        return;
      }

      // Redirect to the page the user came from, or dashboard
      window.location.href = data.redirectTo ?? from;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <Label htmlFor="login-username">Username</Label>
        <Input
          id="login-username"
          name="username"
          type="text"
          required
          autoComplete="username"
          placeholder="Username"
          autoFocus
        />
      </div>

      <div>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Password"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-[var(--shell-px-mobile)]">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-h3 font-semibold text-text">FreshOil</h1>
          <p className="mt-2 text-sm text-text-muted">Owner sign in</p>
        </div>

        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
