"use client";

import { useRef, useState } from "react";
import { CheckCircle, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCY } from "@/config/catalog";
import type { PricingBreakdown } from "@/lib/types";

// ─── Types ────────────────────────────────────────────────

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  [key: string]: string[];
}

// ─── Formatting ───────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
});

function fmtCents(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Component ────────────────────────────────────────────

interface ServiceRequestFormProps {
  pricing: PricingBreakdown;
  onComplete: () => void;
}

export function ServiceRequestForm({
  pricing,
  onComplete,
}: ServiceRequestFormProps) {
  const clientRequestIdRef = useRef(crypto.randomUUID());
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setServerError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const preferredDate = String(formData.get("preferredDate") ?? "").trim();

    const payload = {
      kind: "SERVICE_REQUEST" as const,
      clientRequestId: clientRequestIdRef.current,
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      venueName: String(formData.get("venueName") ?? "").trim() || undefined,
      venueAddress: String(formData.get("venueAddress") ?? ""),
      preferredDate: preferredDate || undefined,
      message: String(formData.get("message") ?? "").trim() || undefined,
      service: pricing.config,
    };

    setStatus("submitting");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

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
    } catch {
      setServerError(
        "Network error. Please check your connection and try again.",
      );
      setStatus("error");
    }
  }

  // ── Success state ──────────────────────────────────────

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-2xl bg-surface-raised p-6 ring-1 ring-border lg:p-8">
          <div className="mb-6 text-center">
            <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="size-8 text-success" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-h3 font-semibold text-text">
              Request received
            </h3>
            <p className="text-body text-text-muted">
              We&apos;ll confirm your service and final pricing shortly.
            </p>
          </div>

          <div className="mb-6 rounded-xl bg-surface-muted p-4 text-sm">
            <p className="mb-2 font-semibold text-text">
              {pricing.config.equipmentType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
              {" — "}
              {pricing.config.oilType.charAt(0) +
                pricing.config.oilType.slice(1).toLowerCase()}
            </p>
            <p className="text-text-muted">
              {pricing.config.frequency === "MONTHLY"
                ? "Monthly service"
                : "One-time service"}
            </p>
            <p className="mt-2 text-base font-bold text-text">
              Estimated total: {fmtCents(pricing.totalMinor)}
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Final pricing confirmed on submission by the business.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onComplete}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Configure another service
          </Button>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h3 className="mb-2 text-h3 font-semibold text-text">
          Complete your request
        </h3>
        <p className="text-sm text-text-muted">
          Provide your details to submit the service request.
        </p>
      </div>

      {/* Service summary */}
      <div className="mb-6 rounded-xl bg-surface-muted p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-muted">Estimated total</span>
          <span className="text-base font-bold text-text">
            {fmtCents(pricing.totalMinor)}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-muted">
          Final pricing confirmed by the business.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* ── Customer details ──────────────────────────── */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-text">
            Your details
          </legend>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sr-name">Name</Label>
              <Input
                id="sr-name"
                name="name"
                required
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={!!fieldErrors["name"]}
                aria-describedby={
                  fieldErrors["name"] ? "error-sr-name" : undefined
                }
              />
              {fieldErrors["name"] && (
                <p
                  id="error-sr-name"
                  className="mt-1 text-sm text-destructive"
                >
                  {fieldErrors["name"][0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sr-email">Email</Label>
              <Input
                id="sr-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!fieldErrors["email"]}
                aria-describedby={
                  fieldErrors["email"] ? "error-sr-email" : undefined
                }
              />
              {fieldErrors["email"] && (
                <p
                  id="error-sr-email"
                  className="mt-1 text-sm text-destructive"
                >
                  {fieldErrors["email"][0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sr-phone">Phone</Label>
              <Input
                id="sr-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Your phone number"
                aria-invalid={!!fieldErrors["phone"]}
                aria-describedby={
                  fieldErrors["phone"] ? "error-sr-phone" : undefined
                }
              />
              {fieldErrors["phone"] && (
                <p
                  id="error-sr-phone"
                  className="mt-1 text-sm text-destructive"
                >
                  {fieldErrors["phone"][0]}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* ── Venue details ─────────────────────────────── */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-text">
            Venue
          </legend>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sr-venue-name">Venue name</Label>
              <Input
                id="sr-venue-name"
                name="venueName"
                autoComplete="organization"
                placeholder="Restaurant or cafe name"
                aria-invalid={!!fieldErrors["venueName"]}
                aria-describedby={
                  fieldErrors["venueName"] ? "error-sr-venue-name" : undefined
                }
              />
              {fieldErrors["venueName"] && (
                <p
                  id="error-sr-venue-name"
                  className="mt-1 text-sm text-destructive"
                >
                  {fieldErrors["venueName"][0]}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sr-venue-address">Venue address</Label>
              <Input
                id="sr-venue-address"
                name="venueAddress"
                required
                autoComplete="street-address"
                placeholder="Full address"
                aria-invalid={!!fieldErrors["venueAddress"]}
                aria-describedby={
                  fieldErrors["venueAddress"]
                    ? "error-sr-venue-address"
                    : undefined
                }
              />
              {fieldErrors["venueAddress"] && (
                <p
                  id="error-sr-venue-address"
                  className="mt-1 text-sm text-destructive"
                >
                  {fieldErrors["venueAddress"][0]}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* ── Scheduling ────────────────────────────────── */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-text">
            Scheduling
          </legend>

          <div>
            <Label htmlFor="sr-date">Preferred date</Label>
            <Input
              id="sr-date"
              name="preferredDate"
              type="date"
              min={todayISO()}
              aria-invalid={!!fieldErrors["preferredDate"]}
              aria-describedby={
                fieldErrors["preferredDate"]
                  ? "error-sr-date"
                  : "sr-date-hint"
              }
            />
            {fieldErrors["preferredDate"] ? (
              <p
                id="error-sr-date"
                className="mt-1 text-sm text-destructive"
              >
                {fieldErrors["preferredDate"][0]}
              </p>
            ) : (
              <p id="sr-date-hint" className="mt-1 text-xs text-text-muted">
                Optional — we&apos;ll confirm availability.
              </p>
            )}
          </div>
        </fieldset>

        {/* ── Message ───────────────────────────────────── */}
        <div>
          <Label htmlFor="sr-message">Message</Label>
          <textarea
            id="sr-message"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder="Anything else we should know?"
            className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            aria-invalid={!!fieldErrors["message"]}
            aria-describedby={
              fieldErrors["message"] ? "error-sr-message" : undefined
            }
          />
          {fieldErrors["message"] && (
            <p id="error-sr-message" className="mt-1 text-sm text-destructive">
              {fieldErrors["message"][0]}
            </p>
          )}
        </div>

        {/* ── Server error ──────────────────────────────── */}
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </div>
        )}

        {/* ── Submit ────────────────────────────────────── */}
        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? (
            "Submitting…"
          ) : (
            <>
              Submit service request
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
