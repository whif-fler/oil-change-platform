"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  FileText,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculatePricing } from "@/lib/pricing";
import { formatCents } from "@/lib/formatting";
import {
  EQUIPMENT_LABELS,
  CAPACITY_LABELS,
  OIL_LABELS,
  ADDON_LABELS,
  FREQUENCY_LABELS,
} from "@/components/quote-builder";
import {
  EQUIPMENT,
  CAPACITY_TIERS,
  OIL,
  ADD_ONS,
  FREQUENCY,
} from "@/config/catalog";
import type {
  EquipmentType,
  Capacity,
  OilType,
  AddOn,
  Frequency,
} from "@/config/catalog";
import type { PricingBreakdown, ServiceConfig } from "@/lib/types";

// ─── Config decoding ─────────────────────────────────────

function decodeConfig(raw: string): ServiceConfig | null {
  try {
    const json = JSON.parse(atob(raw));
    if (
      typeof json !== "object" ||
      json === null ||
      typeof json.equipmentType !== "string" ||
      typeof json.capacity !== "string" ||
      typeof json.oilType !== "string" ||
      !Array.isArray(json.addOns) ||
      typeof json.frequency !== "string"
    ) {
      return null;
    }
    if (!(json.equipmentType in EQUIPMENT)) return null;
    if (!(json.capacity in CAPACITY_TIERS)) return null;
    if (!(json.oilType in OIL)) return null;
    if (!(json.frequency in FREQUENCY)) return null;
    for (const addOn of json.addOns) {
      if (!(addOn in ADD_ONS)) return null;
    }
    return {
      equipmentType: json.equipmentType as EquipmentType,
      capacity: json.capacity as Capacity,
      oilType: json.oilType as OilType,
      addOns: json.addOns as AddOn[],
      frequency: json.frequency as Frequency,
    };
  } catch {
    return null;
  }
}

// ─── Helpers ─────────────────────────────────────────────

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  [key: string]: string[];
}

function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatEquipmentLabel(type: EquipmentType): string {
  return EQUIPMENT_LABELS[type] ?? type;
}

function formatCapacityLabel(capacity: Capacity): string {
  return CAPACITY_LABELS[capacity] ?? capacity;
}

function formatOilLabel(type: OilType): string {
  return OIL_LABELS[type] ?? type;
}

// ─── Component ───────────────────────────────────────────

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
          <div className="mx-auto max-w-lg px-[var(--shell-px-mobile)] text-center">
            <p className="text-body text-text-muted">Loading…</p>
          </div>
        </section>
      }
    >
      <RequestPageContent />
    </Suspense>
  );
}

function RequestPageContent() {
  const searchParams = useSearchParams();
  const configRaw = searchParams.get("config");

  const config = useMemo(() => {
    if (!configRaw) return null;
    return decodeConfig(configRaw);
  }, [configRaw]);

  // Invalid or missing config
  if (!config) {
    return (
      <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-lg px-[var(--shell-px-mobile)] text-center">
          <div className="rounded-2xl bg-surface-raised p-8 ring-1 ring-border shadow-card">
            <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-surface-muted">
              <FileText className="size-8 text-text-muted" aria-hidden="true" />
            </div>
            <h1 className="mb-2 text-h3 font-semibold text-text">
              Service configuration unavailable
            </h1>
            <p className="mb-6 text-body text-text-muted">
              Your service configuration could not be loaded. Please start a
              new quote to configure your service.
            </p>
            <Link
              href="/quote"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Start a new quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <RequestForm config={config} />;
}

// ─── Form ────────────────────────────────────────────────

function RequestForm({ config }: { config: ServiceConfig }) {
  const clientRequestIdRef = useRef(crypto.randomUUID());
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  let pricing: PricingBreakdown;
  try {
    pricing = calculatePricing(config);
  } catch {
    return (
      <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-lg px-[var(--shell-px-mobile)] text-center">
          <p className="text-destructive">
            Unable to calculate pricing. Please{' '}
            <Link href="/quote" className="underline">
              start a new quote
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

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
      service: config,
    };

    setStatus("submitting");

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
      <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
        <div className="mx-auto max-w-lg px-[var(--shell-px-mobile)]">
          <div className="rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card concept:p-8">
            <div className="mb-6 text-center">
              <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle
                  className="size-8 text-success"
                  aria-hidden="true"
                />
              </div>
              <h1 className="mb-2 text-h3 font-semibold text-text">
                Request received
              </h1>
              <p className="text-body text-text-muted">
                Thank you. We&apos;ve received your service request and will be
                in touch shortly to confirm your appointment and final
                pricing.
              </p>
            </div>

            <div className="mb-6 rounded-xl bg-surface-muted p-4 text-sm">
              <p className="mb-1 font-semibold text-text">
                {formatEquipmentLabel(config.equipmentType)} (
                {formatCapacityLabel(config.capacity)}) —{" "}
                {formatOilLabel(config.oilType)}
              </p>
              <p className="text-text-muted">
                {config.frequency === "MONTHLY"
                  ? "Monthly service"
                  : "One-time service"}
                {config.addOns.length > 0 &&
                  ` · ${config.addOns.map((a) => ADDON_LABELS[a]).join(", ")}`}
              </p>
              <p className="mt-3 text-base font-bold text-text">
                Estimated total: {formatCents(pricing.totalMinor)}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Final pricing confirmed by the business.
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-full",
                })}
              >
                Return home
              </Link>
              <Link
                href="/quote"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Configure another service
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Form state ─────────────────────────────────────────

  return (
    <section className="bg-surface py-[var(--section-py-mobile)] lg:py-[var(--section-py-desktop)]">
      <div className="mx-auto max-w-[var(--shell-max-w)] px-[var(--shell-px-mobile)]">
        <div className="mb-14 text-center">
          <h1 className="mb-4 text-h2 font-semibold leading-[var(--lh-h2)] tracking-[var(--ls-h2)] text-text">
            Request your service
          </h1>
          <p className="mx-auto max-w-2xl text-body text-text-muted">
            Tell us where and how to reach&nbsp;you.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 concept:grid-cols-5 concept:gap-10">
          {/* ── Estimate summary (left) ─────────────────── */}
          <div className="concept:col-span-2">
            <div className="sticky top-24 rounded-2xl bg-surface-raised p-6 ring-1 ring-border shadow-card concept:p-8">
              <h2 className="mb-5 text-h4 font-semibold text-text">
                Your estimate
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-text-muted">Equipment</span>
                  <p className="font-medium text-text">
                    {formatEquipmentLabel(config.equipmentType)}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Capacity</span>
                  <p className="font-medium text-text">
                    {formatCapacityLabel(config.capacity)}
                  </p>
                </div>
                <div>
                  <span className="text-text-muted">Oil type</span>
                  <p className="font-medium text-text">
                    {formatOilLabel(config.oilType)}
                  </p>
                </div>
                {config.addOns.length > 0 && (
                  <div>
                    <span className="text-text-muted">Additional services</span>
                    <p className="font-medium text-text">
                      {config.addOns.map((a) => ADDON_LABELS[a]).join(", ")}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-text-muted">Frequency</span>
                  <p className="font-medium text-text">
                    {FREQUENCY_LABELS[config.frequency]}
                  </p>
                </div>

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Service fee</span>
                    {pricing.serviceFeeMinor !== null ? (
                      <span className="font-medium text-text">
                        {formatCents(pricing.serviceFeeMinor)}
                      </span>
                    ) : (
                      <span className="font-medium text-text">
                        Custom quote
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">
                    Oil (
                    {CAPACITY_TIERS[config.capacity]!.estimateGallons} gal)
                  </span>
                  <span className="font-medium text-text">
                    {formatCents(pricing.oilCostMinor)}
                  </span>
                </div>
                {pricing.addOnCostsMinor.map((item) => (
                  <div
                    key={item.addOn}
                    className="flex items-center justify-between"
                  >
                    <span className="text-text-muted">
                      {ADDON_LABELS[item.addOn]}
                    </span>
                    <span className="font-medium text-text">
                      {formatCents(item.costMinor)}
                    </span>
                  </div>
                ))}
                {pricing.discountMinor > 0 && (
                  <div className="flex items-center justify-between text-success">
                    <span>Monthly discount (10%)</span>
                    <span className="font-medium">
                      −{formatCents(pricing.discountMinor)}
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-text">
                      Estimated total
                    </span>
                    <span className="text-base font-bold text-text">
                      {formatCents(pricing.totalMinor)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-text-muted">
                Final pricing confirmed on submission by the business.
              </p>
            </div>
          </div>

          {/* ── Request form (right) ────────────────────── */}
          <div className="concept:col-span-3">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Customer details */}
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-text">
                  Your details
                </legend>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rq-name">Name</Label>
                    <Input
                      id="rq-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      disabled={status === "submitting"}
                      aria-invalid={!!fieldErrors["name"]}
                      aria-describedby={
                        fieldErrors["name"] ? "error-rq-name" : undefined
                      }
                    />
                    {fieldErrors["name"] && (
                      <p
                        id="error-rq-name"
                        className="mt-1 text-sm text-destructive"
                      >
                        {fieldErrors["name"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rq-email">Email</Label>
                    <Input
                      id="rq-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      disabled={status === "submitting"}
                      aria-invalid={!!fieldErrors["email"]}
                      aria-describedby={
                        fieldErrors["email"] ? "error-rq-email" : undefined
                      }
                    />
                    {fieldErrors["email"] && (
                      <p
                        id="error-rq-email"
                        className="mt-1 text-sm text-destructive"
                      >
                        {fieldErrors["email"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rq-phone">Phone</Label>
                    <Input
                      id="rq-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="Your phone number"
                      disabled={status === "submitting"}
                      aria-invalid={!!fieldErrors["phone"]}
                      aria-describedby={
                        fieldErrors["phone"] ? "error-rq-phone" : undefined
                      }
                    />
                    {fieldErrors["phone"] && (
                      <p
                        id="error-rq-phone"
                        className="mt-1 text-sm text-destructive"
                      >
                        {fieldErrors["phone"][0]}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Venue details */}
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-text">
                  Venue
                </legend>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rq-venue-name">Venue name</Label>
                    <Input
                      id="rq-venue-name"
                      name="venueName"
                      autoComplete="organization"
                      placeholder="Restaurant or café name"
                      disabled={status === "submitting"}
                      aria-invalid={!!fieldErrors["venueName"]}
                      aria-describedby={
                        fieldErrors["venueName"]
                          ? "error-rq-venue-name"
                          : undefined
                      }
                    />
                    {fieldErrors["venueName"] && (
                      <p
                        id="error-rq-venue-name"
                        className="mt-1 text-sm text-destructive"
                      >
                        {fieldErrors["venueName"][0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rq-venue-address">Venue address</Label>
                    <Input
                      id="rq-venue-address"
                      name="venueAddress"
                      required
                      autoComplete="street-address"
                      placeholder="Full address"
                      disabled={status === "submitting"}
                      aria-invalid={!!fieldErrors["venueAddress"]}
                      aria-describedby={
                        fieldErrors["venueAddress"]
                          ? "error-rq-venue-address"
                          : undefined
                      }
                    />
                    {fieldErrors["venueAddress"] && (
                      <p
                        id="error-rq-venue-address"
                        className="mt-1 text-sm text-destructive"
                      >
                        {fieldErrors["venueAddress"][0]}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Scheduling */}
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-text">
                  Scheduling
                </legend>
                <div>
                  <Label htmlFor="rq-date">Preferred date</Label>
                  <Input
                    id="rq-date"
                    name="preferredDate"
                    type="date"
                    min={todayISO()}
                    disabled={status === "submitting"}
                    aria-invalid={!!fieldErrors["preferredDate"]}
                    aria-describedby={
                      fieldErrors["preferredDate"]
                        ? "error-rq-date"
                        : "rq-date-hint"
                    }
                  />
                  {fieldErrors["preferredDate"] ? (
                    <p
                      id="error-rq-date"
                      className="mt-1 text-sm text-destructive"
                    >
                      {fieldErrors["preferredDate"][0]}
                    </p>
                  ) : (
                    <p id="rq-date-hint" className="mt-1 text-xs text-text-muted">
                      Optional — we&apos;ll confirm availability.
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Message */}
              <div>
                <Label htmlFor="rq-message">Message</Label>
                <textarea
                  id="rq-message"
                  name="message"
                  rows={3}
                  maxLength={2000}
                  placeholder="Anything else we should know?"
                  disabled={status === "submitting"}
                  className="flex w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  aria-invalid={!!fieldErrors["message"]}
                  aria-describedby={
                    fieldErrors["message"] ? "error-rq-message" : undefined
                  }
                />
                {fieldErrors["message"] && (
                  <p
                    id="error-rq-message"
                    className="mt-1 text-sm text-destructive"
                  >
                    {fieldErrors["message"][0]}
                  </p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive"
                >
                  <AlertCircle
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Submit */}
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
        </div>
      </div>
    </section>
  );
}
