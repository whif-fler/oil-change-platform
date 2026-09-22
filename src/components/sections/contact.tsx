"use client";

import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  [key: string]: string[];
}

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      clientRequestId: crypto.randomUUID(),
      kind: "QUESTION" as const,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    startTransition(async () => {
      try {
        const res = await fetch("/api/enquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          setServerError(
            "The server returned an unexpected response. Please try again.",
          );
          setStatus("error");
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 422 && data.error?.details) {
            setFieldErrors(data.error.details);
          } else {
            setServerError(
              data.error?.message ?? "Something went wrong. Please try again.",
            );
          }
          setStatus("error");
          return;
        }

        setStatus("success");
        form.reset();
      } catch {
        setServerError("Network error. Please check your connection and try again.");
        setStatus("error");
      }
    });
  }

  // ── Success state ───────────────────────────────────────

  if (status === "success") {
    return (
      <section
        id="contact"
        className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
      >
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="size-8 text-success" aria-hidden="true" />
            </div>
            <h2 className="mb-4 text-h3 font-semibold text-text">
              Message sent
            </h2>
            <p className="mb-8 text-body text-text-muted">
              Thanks for reaching out. We&apos;ll get back to you&nbsp;soon.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setStatus("idle")}
            >
              Send another message
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ── Contact form ────────────────────────────────────────

  return (
    <section
      id="contact"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
    >
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)] lg:px-[var(--shell-px-desktop)]">
        <div className="mb-10 text-center lg:mb-14">
          <h2 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            Get in&nbsp;touch
          </h2>
          <p className="mx-auto max-w-xl text-body text-text-muted">
            Have a question about our service? Send us a message and we&apos;ll
            get back to&nbsp;you.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  disabled={isPending}
                  aria-invalid={!!fieldErrors["name"]}
                  aria-describedby={
                    fieldErrors["name"] ? "error-name" : undefined
                  }
                />
                {fieldErrors["name"] && (
                  <p id="error-name" className="mt-1 text-sm text-destructive">
                    {fieldErrors["name"][0]}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isPending}
                  aria-invalid={!!fieldErrors["email"]}
                  aria-describedby={
                    fieldErrors["email"] ? "error-email" : undefined
                  }
                />
                {fieldErrors["email"] && (
                  <p id="error-email" className="mt-1 text-sm text-destructive">
                    {fieldErrors["email"][0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Your phone number"
                disabled={isPending}
                aria-invalid={!!fieldErrors["phone"]}
                aria-describedby={
                  fieldErrors["phone"] ? "error-phone" : undefined
                }
              />
              {fieldErrors["phone"] && (
                <p id="error-phone" className="mt-1 text-sm text-destructive">
                  {fieldErrors["phone"][0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                maxLength={2000}
                placeholder="How can we help?"
                disabled={isPending}
                aria-invalid={!!fieldErrors["message"]}
                aria-describedby={
                  fieldErrors["message"] ? "error-message" : undefined
                }
              />
              {fieldErrors["message"] && (
                <p id="error-message" className="mt-1 text-sm text-destructive">
                  {fieldErrors["message"][0]}
                </p>
              )}
            </div>

            {serverError && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                "Sending…"
              ) : (
                <>
                  Send message
                  <Send className="size-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          {/* Info sidebar */}
          <aside className="flex flex-col gap-6 text-sm text-text-muted lg:pt-1">
            <div>
              <h3 className="mb-1 font-semibold text-text">FreshOil</h3>
              <p className="leading-relaxed">
                Onsite cooking-oil service for restaurants and&nbsp;cafés.
              </p>
            </div>

            <Separator />

            <div>
              <p className="mb-1 font-semibold text-text">Email</p>
              <p>hello@freshoil.com</p>
            </div>

            <div>
              <p className="mb-1 font-semibold text-text">Phone</p>
              <p>(555) 123-4567</p>
            </div>

            <Separator />

            <p className="leading-relaxed text-text-muted/80">
              We aim to respond within one business&nbsp;day.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
