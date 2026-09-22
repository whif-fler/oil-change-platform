"use client";

import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
        className="bg-surface pb-12 pt-0 concept:pb-16"
      >
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="mx-auto max-w-lg text-center">
            <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="size-8 text-success" aria-hidden="true" />
            </div>
            <h2
              className="mb-4 font-semibold text-text"
              style={{
                fontSize: "clamp(1.5rem, 1rem + 1.5vw, 2rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.03em",
              }}
            >
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
    <>
      <section
      id="contact"
      className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]"
      >
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="grid items-start gap-12 concept:grid-cols-2">
          {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="order-2 space-y-4 rounded-[var(--radius-card-token)] bg-surface-raised p-8 ring-1 ring-border shadow-card concept:order-2"
            >
            <div className="grid gap-4">
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
              variant="secondary"
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
          <aside className="order-1 flex flex-col gap-0 text-sm text-text-muted concept:order-1">
            <div>
              <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
                Contact details
              </div>
              <h2 className="mb-3.5 text-[clamp(1.6rem,3vw,2.1rem)] font-semibold tracking-[-0.02em] text-text">
                Talk to the team
              </h2>
              <p className="mb-6 leading-[1.6]">
                Prefer email or a call? Reach us directly and we&apos;ll get
                back to you the same way.
              </p>
            </div>

            <div className="mb-3 flex items-center gap-2.5 text-[0.92rem] font-semibold text-text">
              <span className="size-2 rounded-full bg-primary" />
              <a href="mailto:hello@freshoil.com">hello@freshoil.com</a>
            </div>
            <div className="mb-3 flex items-center gap-2.5 text-[0.92rem] font-semibold text-text">
              <span className="size-2 rounded-full bg-primary" />
              <a href="tel:5551234567">(555) 123-4567</a>
            </div>

            <div className="mt-4 border-t border-border pt-6">
              <h3 className="mb-2.5 text-[0.85rem] font-bold text-text">
                Response hours
              </h3>
              <div className="flex justify-between py-1 text-[0.85rem]">
                <span>Monday – Friday</span>
                <span>8am – 6pm</span>
              </div>
              <div className="flex justify-between py-1 text-[0.85rem]">
                <span>Saturday</span>
                <span>9am – 2pm</span>
              </div>
              <div className="flex justify-between py-1 text-[0.85rem]">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </aside>
        </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,var(--gradient-soft-start)_0%,var(--gradient-soft-mid)_50%,var(--gradient-soft-end)_100%)] py-12 concept:py-16">
        <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
          <div className="mx-auto mb-10 max-w-[560px] text-center">
            <div className="mb-2.5 text-caption font-extrabold uppercase tracking-[0.1em] text-eyebrow">
              Before you write in
            </div>
            <h2 className="text-[clamp(1.7rem,3vw,2.3rem)] font-semibold tracking-[-0.02em] text-text">
              Common questions
            </h2>
          </div>
          <div className="mx-auto flex max-w-[760px] flex-col gap-3">
            <div className="rounded-[var(--radius-panel-token)] border border-border bg-surface-raised px-[22px] py-[18px]">
              <h3 className="mb-1.5 text-[0.94rem] font-bold text-text">
                Do I need a fixed contract?
              </h3>
              <p className="text-[0.85rem] leading-[1.5] text-text-muted">
                No — one-time visits are available any time. Monthly plans are
                optional and save 10%.
              </p>
            </div>
            <div className="rounded-[var(--radius-panel-token)] border border-border bg-surface-raised px-[22px] py-[18px]">
              <h3 className="mb-1.5 text-[0.94rem] font-bold text-text">
                Is pricing confirmed before booking?
              </h3>
              <p className="text-[0.85rem] leading-[1.5] text-text-muted">
                Yes, your estimate from the quote builder is confirmed before
                we schedule a visit.
              </p>
            </div>
            <div className="rounded-[var(--radius-panel-token)] border border-border bg-surface-raised px-[22px] py-[18px]">
              <h3 className="mb-1.5 text-[0.94rem] font-bold text-text">
                What areas do you service?
              </h3>
              <p className="text-[0.85rem] leading-[1.5] text-text-muted">
                Let us know your venue location in the form and we&apos;ll
                confirm coverage in our reply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
