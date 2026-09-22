# FreshOil — Cooking Oil Service Platform

A mobile-first full-stack platform for a solo cooking-oil and fryer service business serving restaurants and cafes.

**Not an automotive oil-change application.** This is an onsite commercial kitchen service platform for managing fryer oil changes, filtration, and related maintenance.

### Requirement Clarification

The original evaluation specification referred to selecting a vehicle type and oil type. The business context was subsequently clarified by the employer as an **onsite cooking/fryer oil-change service for restaurants and cafés**.

Based on that clarification, the quotation flow uses:

- Equipment/fryer type
- Cooking oil type
- Optional additional services (filter replacement, deep clean, waste oil disposal)
- Service frequency (one-time or monthly)

The service is designed around the business owner traveling to the customer's venue to perform the service. Monthly frequency represents a recurring service preference rather than automated subscription billing.

## Live Demo

[Live Demo](https://oil-change-platform-gilt.vercel.app/)

## Tech Stack

- **Framework:** Next.js 15.5 (App Router)
- **UI:** React 19.1, Tailwind CSS 4, shadcn/ui
- **Language:** TypeScript 5 (strict mode)
- **Validation:** Zod 4.6
- **ORM:** Prisma 6.19
- **Database:** PostgreSQL (Supabase-hosted)
- **Deployment:** Vercel

## Features

### Customer-facing

- Mobile-first responsive landing page with scroll-reveal animations
- Dedicated `/quote` page — focused service configurator
- Dedicated `/request` page — service request form with estimate summary
- Dedicated `/about` page — business overview with supporting imagery
- Interactive quote builder with equipment, oil, add-on, and frequency selection
- Real-time client-side pricing estimates (estimate only — server is authoritative)
- One-time and monthly service options with monthly discount
- General enquiry (question) form via homepage Contact section
- Service request form with venue details and preferred date
- Persistent quotation snapshots stored in PostgreSQL

### Owner dashboard

- Protected owner authentication (login/logout)
- Dashboard enquiry list (cards on mobile, table on desktop)
- Enquiry detail view with full customer, venue, and quotation information
- Status management (New, Contacted, Scheduled, Completed, Cancelled)
- Quotation breakdown display from persisted snapshots

### Cross-cutting

- Loading skeletons, empty states, error boundaries
- Zod-validated API inputs with structured error responses
- Idempotent service request submission (`clientRequestId`)
- Graceful handling of invalid/malformed data
- Keyboard accessibility, visible focus states, semantic HTML

## Architecture

### Frontend

The application uses the Next.js 15 App Router with a Server Component / Client Component boundary:

- **Server Components** handle static content, layout, and server-side data fetching (dashboard list, dashboard detail).
- **Client Components** handle browser interactivity: quote builder state, form submissions, mobile navigation, and status updates.

### Backend

- **Route Handler** (`POST /api/enquiries`) — public endpoint for general questions and service requests. Validates with Zod, recalculates quotation pricing server-side, and persists enquiry + quotation in a database transaction.
- **Server Action** (`updateEnquiryStatus`) — protected action for dashboard status updates. Verifies authentication, validates input, and updates the database.
- **Prisma** provides typed access to PostgreSQL.
- **Server-side pricing** — the server recalculates the full quotation breakdown on submission. Client-submitted prices are never trusted.

### Authentication

- Middleware protects `/dashboard` and `/api/dashboard` routes.
- Server-side `getSessionUser()` provides belt-and-suspenders verification in pages and Server Actions.
- HttpOnly session cookie with `SameSite=Lax`, `Secure` in production.
- Session cookie is HMAC-signed using a server-side secret.
- Password verification uses PBKDF2 with a per-installation salt.
- No database-backed session table — the signed cookie is self-contained.

### Database

PostgreSQL accessed through Prisma. Key models and enums:

- **`Enquiry`** — customer contact information, venue details, status, and optional link to a quotation.
- **`Quotation`** — equipment, oil, add-ons, frequency, total, and a JSON breakdown of the full pricing snapshot.
- **`EnquiryKind`** — `QUESTION` or `SERVICE_REQUEST`.
- **`EnquiryStatus`** — `NEW`, `CONTACTED`, `SCHEDULED`, `COMPLETED`, `CANCELLED`.
- **`Frequency`** — `ONE_TIME` or `MONTHLY`.

The Prisma schema and migration files are included in the repository.

## Data Flow

### Customer quotation flow

1. Customer visits `/quote` and selects equipment type, oil type, add-ons, and frequency.
2. Client-side pricing provides immediate UI feedback (estimate only).
3. Customer clicks "Continue" — the service configuration is base64-encoded in the URL and the customer is taken to `/request?config=...`.
4. `/request` decodes and validates the configuration, displays the estimate summary, and collects customer/venue details.
5. Customer submits the form. Server validates the payload, recalculates the quotation server-side, and persists both the quotation and enquiry in a database transaction.
6. Customer sees a confirmation with their estimate and next-step explanation.

The homepage also includes an embedded quote builder for quick access from the landing page.

### Owner workflow

1. Owner navigates to `/dashboard` and is redirected to `/login` if unauthenticated.
2. Dashboard loads enquiries from PostgreSQL, ordered newest first.
3. Owner clicks an enquiry to view full details, including persisted quotation breakdown.
4. Owner updates the enquiry status via the protected Server Action.
5. Status is persisted and the page refreshes.

## Key Architectural Decisions

### Server-side quotation calculation

The server recalculates the full quotation breakdown when a service request is submitted. This ensures pricing is never tampered with in transit and remains consistent with the server-side catalog, even if the catalog changes after submission.

### Integer-based money

All monetary values use integer minor units (cents). For example:

```text
1500 = $15.00
2500 = $25.00
```

This avoids floating-point rounding issues that are common with currency calculations.

### Idempotent requests

Each service request includes a client-generated `clientRequestId` (UUID). If the same ID is submitted twice (e.g., due to a network retry), the server returns the existing enquiry instead of creating a duplicate. This prevents duplicate enquiries and quotations.

### Persisted quotation breakdown

The full pricing breakdown is persisted as JSON alongside the quotation record. Historical quotations are displayed from this snapshot rather than being recalculated, ensuring the owner sees exactly what the customer was quoted at submission time.

### Simple authentication

A signed cookie-based authentication system was chosen over a full database-backed session system because the application serves a single owner. There are no multiple user roles, no team management, and no requirement for server-side session invalidation. The HMAC-signed cookie is sufficient for this scope.

## Trade-offs

The following were intentionally kept out of scope to focus on the core customer-request and owner-management workflow:

- **No customer accounts** — the platform is owner-operated; customers submit via a public form.
- **No online payments** — pricing is informational; payment is handled offline.
- **No full calendar/scheduling system** — a preferred date field captures intent, but scheduling is managed externally.
- **No email/SMS notifications** — the owner checks the dashboard directly.
- **No employee management** — single-owner tool.
- **No inventory management** — outside the scope of enquiry and quotation management.
- **No CRM** — the enquiry system serves as a lightweight equivalent.
- **No analytics or reporting** — not required for the core workflow.

These decisions are deliberate scope boundaries, not missing features.

## Validation & Error Handling

- **Zod** validates all API inputs (enquiry payloads, status updates, quotation breakdown structure).
- **Structured API responses** use `{ ok: true, data }` and `{ ok: false, error: { code, message, details? } }`.
- **HTTP status codes:** 200 (idempotent hit), 201 (created), 400 (malformed JSON), 401 (unauthorized), 422 (validation), 500 (server error).
- **Idempotent request handling** via `clientRequestId` unique constraint with P2002 race-safe catch.
- **Loading states** via React Suspense with skeleton components.
- **Empty states** when no enquiries exist.
- **Error boundaries** on dashboard routes with retry capability.
- **Dashboard 404 handling** for missing enquiry IDs.
- **Graceful invalid quotation JSON** — corrupted breakdowns show a fallback message instead of crashing.
- **Database error handling** — Prisma errors are caught and surface as user-friendly messages.

## Database & Migrations

- The Prisma schema (`prisma/schema.prisma`) defines the database structure.
- Migration files are included in `prisma/migrations/`.
- Migrations can be applied with:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Local Development

### Requirements

- Node.js 18+
- PostgreSQL-compatible database (Supabase, local Postgres, etc.)

### Install

```bash
npm install
```

### Environment

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (transaction pooler) |
| `DIRECT_URL` | PostgreSQL direct connection (for migrations) |
| `OWNER_USERNAME` | Dashboard login username |
| `OWNER_PASSWORD_SALT` | Hex-encoded salt for password hashing |
| `OWNER_PASSWORD_HASH` | Hex-encoded PBKDF2 password hash |
| `OWNER_SESSION_SECRET` | Hex-encoded HMAC signing key |

Generate password credentials with:

```bash
npx tsx scripts/generate-password-hash.ts
```

### Database setup

```bash
npx prisma migrate deploy
npx prisma generate
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

## Verification

The following commands pass successfully:

```bash
npx tsc --noEmit        # TypeScript strict mode — 0 errors
npm run lint             # ESLint — 0 errors, 0 warnings
npm run build            # Next.js production build — compiles successfully
```

No automated test suite is included in this project.

## Project Structure

```text
src/
├── app/
│   ├── (public)/             # Public route group (Header + Footer)
│   │   ├── about/            # About page
│   │   ├── quote/            # Dedicated quote configuration page
│   │   ├── request/          # Dedicated service request page
│   │   └── page.tsx          # Homepage
│   ├── api/
│   │   ├── auth/             # Login and logout endpoints
│   │   └── enquiries/        # Public enquiry submission endpoint
│   ├── dashboard/            # Protected dashboard (list, detail, error)
│   ├── login/                # Owner login page
│   └── layout.tsx            # Root layout (Manrope font, design tokens)
├── components/
│   ├── dashboard/            # Dashboard-specific components
│   ├── sections/             # Homepage sections
│   ├── ui/                   # shadcn/ui primitives (Button, Input, Label, Card)
│   ├── header.tsx            # Public site header
│   ├── footer.tsx            # Public site footer
│   ├── quote-builder.tsx     # Interactive quote calculator (used on /quote and homepage)
│   ├── scroll-reveal.tsx     # Intersection Observer scroll reveal
│   └── service-request-form.tsx
├── config/
│   └── catalog.ts            # Equipment, oil, add-on, and pricing catalog
├── lib/
│   ├── actions/              # Server Actions (status updates)
│   ├── auth.ts               # Session and password utilities (Node.js)
│   ├── auth-edge.ts          # Edge-compatible session verification
│   ├── db.ts                 # Prisma client singleton
│   ├── formatting.ts         # Currency and date formatting
│   ├── pricing.ts            # Server-side pricing engine
│   ├── types.ts              # Shared TypeScript types
│   ├── validations.ts        # Zod schemas
│   └── utils.ts              # General utilities
├── middleware.ts              # Route protection middleware
prisma/
├── schema.prisma             # Database schema
└── migrations/               # Migration history
```

## Design / UX

- Mobile-first responsive design across 375px to 1440px
- Dedicated pages for quote configuration, service requests, and about
- Scroll-reveal animations with `prefers-reduced-motion` support
- Cards on mobile, table on desktop for the enquiry list
- No horizontal overflow at any viewport width
- Keyboard navigation with visible focus states
- Semantic form controls with associated labels
- Loading states via React Suspense
- Empty and error states with clear messaging
- Design tokens for consistent color, typography, and spacing
