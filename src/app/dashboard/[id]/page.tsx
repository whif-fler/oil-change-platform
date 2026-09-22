import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/formatting";
import { buttonVariants } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StatusControl } from "@/components/dashboard/status-control";
import { QuotationDetails } from "@/components/dashboard/quotation-details";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-muted">
      {children}
    </h2>
  );
}

export default async function EnquiryDetailPage(
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  let enquiry;
  try {
    enquiry = await prisma.enquiry.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        kind: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        venueName: true,
        venueAddress: true,
        preferredDate: true,
        status: true,
        createdAt: true,
        quotation: {
          select: {
            equipmentType: true,
            capacity: true,
            oilType: true,
            addOns: true,
            frequency: true,
            totalMinor: true,
            currency: true,
            breakdown: true,
          },
        },
      },
    });
  } catch {
    return (
      <div className="min-h-screen bg-surface">
        <DashboardHeader />
        <main className="mx-auto max-w-3xl px-[var(--shell-px-mobile)] py-8">
          <div className="rounded-xl bg-surface-raised p-8 text-center ring-1 ring-border">
            <p className="text-sm text-text-muted">
              Something went wrong loading this enquiry. Please try again later.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!enquiry) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />
      <main className="mx-auto max-w-3xl px-[var(--shell-px-mobile)] py-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-3 focus-visible:outline-focus focus-visible:outline-offset-2"
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
          Back to dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-h3 font-semibold text-text">
              {enquiry.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  enquiry.kind === "SERVICE_REQUEST"
                    ? "bg-accent/10 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {enquiry.kind === "SERVICE_REQUEST"
                  ? "Service request"
                  : "Question"}
              </span>
              <StatusBadge status={enquiry.status} />
            </div>
          </div>
        </div>

        {/* Customer */}
        <section className="mb-8">
          <SectionHeading>Customer</SectionHeading>
          <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="min-w-[80px] text-text-muted">Name</dt>
                <dd className="font-medium text-text">{enquiry.name}</dd>
              </div>
              {enquiry.email && (
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="min-w-[80px] text-text-muted">Email</dt>
                  <dd className="font-medium text-text break-all">
                    {enquiry.email}
                  </dd>
                </div>
              )}
              {enquiry.phone && (
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="min-w-[80px] text-text-muted">Phone</dt>
                  <dd className="font-medium text-text">{enquiry.phone}</dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {enquiry.phone && (
                <a
                  href={`tel:${enquiry.phone}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Phone aria-hidden="true" />
                  Call Customer
                </a>
              )}
              {enquiry.email && (
                <a
                  href={`mailto:${enquiry.email}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Mail aria-hidden="true" />
                  Email Customer
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Venue */}
        {(enquiry.venueName || enquiry.venueAddress || enquiry.preferredDate) && (
          <section className="mb-8">
            <SectionHeading>Venue & service</SectionHeading>
            <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
              <dl className="space-y-3 text-sm">
                {enquiry.venueName && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <dt className="min-w-[80px] text-text-muted">Venue</dt>
                    <dd className="font-medium text-text">
                      {enquiry.venueName}
                    </dd>
                  </div>
                )}
                {enquiry.venueAddress && (
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <dt className="min-w-[80px] text-text-muted">Address</dt>
                    <dd className="font-medium text-text break-words">
                      {enquiry.venueAddress}
                    </dd>
                  </div>
                )}
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <dt className="min-w-[80px] text-text-muted">
                    Preferred date
                  </dt>
                  <dd className="font-medium text-text">
                    {enquiry.preferredDate
                      ? formatDate(enquiry.preferredDate)
                      : "Not specified"}
                  </dd>
                </div>
              </dl>
              {enquiry.venueAddress && (
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(enquiry.venueAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <MapPin aria-hidden="true" />
                    Get Directions
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Request */}
        <section className="mb-8">
          <SectionHeading>Request</SectionHeading>
          <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
            <dl className="space-y-3 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                <dt className="min-w-[80px] text-text-muted">Created</dt>
                <dd className="font-medium text-text">
                  {formatDate(enquiry.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Quotation */}
        {enquiry.quotation && (
          <section className="mb-8">
            <SectionHeading>Quotation</SectionHeading>
            <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
              <QuotationDetails quotation={enquiry.quotation} />
            </div>
          </section>
        )}

        {/* Message */}
        {enquiry.message && (
          <section className="mb-8">
            <SectionHeading>Message</SectionHeading>
            <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text">
                {enquiry.message}
              </p>
            </div>
          </section>
        )}

        {/* Status control */}
        <section className="mb-8">
          <SectionHeading>Update status</SectionHeading>
          <div className="rounded-xl bg-surface-raised p-4 ring-1 ring-border">
            <StatusControl
              enquiryId={enquiry.id}
              currentStatus={enquiry.status}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
