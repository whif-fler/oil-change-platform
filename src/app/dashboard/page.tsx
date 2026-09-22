import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EnquiryCard } from "@/components/dashboard/enquiry-card";
import { EnquiryTable } from "@/components/dashboard/enquiry-table";
import { EmptyState } from "@/components/dashboard/empty-state";

async function EnquiryList() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  let enquiries;
  try {
    enquiries = await prisma.enquiry.findMany({
      select: {
        id: true,
        kind: true,
        name: true,
        email: true,
        venueName: true,
        venueAddress: true,
        preferredDate: true,
        status: true,
        createdAt: true,
        quotation: {
          select: {
            totalMinor: true,
            currency: true,
            equipmentType: true,
            frequency: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return (
      <div className="rounded-xl bg-surface-raised p-8 text-center ring-1 ring-border">
        <p className="text-sm text-text-muted">
          Something went wrong loading enquiries. Please try again later.
        </p>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {enquiries.map((enquiry) => (
          <EnquiryCard key={enquiry.id} enquiry={enquiry} />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block">
        <div className="rounded-xl bg-surface-raised ring-1 ring-border">
          <EnquiryTable enquiries={enquiries} />
        </div>
      </div>
    </>
  );
}

function EnquiryListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-surface-raised p-4 ring-1 ring-border"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-surface-muted" />
              <div className="h-3 w-20 rounded bg-surface-muted" />
            </div>
            <div className="h-5 w-16 rounded-full bg-surface-muted" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="h-4 w-24 rounded-full bg-surface-muted" />
            <div className="h-4 w-14 rounded bg-surface-muted" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-40 rounded bg-surface-muted" />
            <div className="h-3 w-56 rounded bg-surface-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />
      <main className="mx-auto max-w-5xl px-[var(--shell-px-mobile)] py-8">
        <div className="mb-6">
          <h2 className="text-h3 font-semibold text-text">Enquiries</h2>
        </div>
        <Suspense fallback={<EnquiryListSkeleton />}>
          <EnquiryList />
        </Suspense>
      </main>
    </div>
  );
}
