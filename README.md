# DentWise

A full-stack dental appointment application with a patient dashboard, doctor management, email confirmations, and an AI voice assistant integration.

Built with Next.js, TypeScript, PostgreSQL, Prisma, and Clerk.

**[Live demo → dentwise.konradpatla.pl](https://dentwise.konradpatla.pl/)**

## Features

### Appointment booking

- Browse active doctors and select a dentist.
- Choose an appointment type, date, and time.
- See already-booked time slots disabled in the booking interface.
- Review appointment details before confirming.
- Save appointments to PostgreSQL and display them in the patient's account.
- Request a confirmation email through Resend after a successful booking.

### Patient dashboard

- View appointment totals and completed visits.
- See the next appointment.
- Access booking and voice-assistant pages.
- Sign in and manage an account through Clerk.

### Administration

- Add doctors and edit their contact details, specialty, gender, and active status.
- Generate doctor avatars using DiceBear.
- View appointment records and administrative statistics.
- Update appointment status between confirmed and completed.
- Restrict access to the admin page using the configured administrator email.

### Voice assistant and plans

- Start and end browser voice calls with a configured Vapi assistant.
- Display speaking/listening states and conversation transcripts.
- Show Clerk's pricing table on the Pro page.
- Gate the voice page using the Clerk plan slugs `ai_basic` and `ai_pro`.

Voice calls, subscription plans, and email delivery require configuration in their respective external services.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 15 App Router, React 19 |
| Language | TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Radix UI, Lucide |
| Data fetching | TanStack Query, Next.js Server Actions |
| Database | PostgreSQL, Prisma 6 |
| Authentication and plans | Clerk |
| Voice integration | Vapi Web SDK |
| Email | Resend, React Email |
| Notifications | Sonner |
| Code quality | Biome |

## Architecture

Next.js serves the interface and server-side application logic in one project.

- **Server Components** render pages and retrieve server-side account data.
- **Client Components** handle the booking flow, forms, and voice-call interface.
- **Server Actions** access doctors, users, and appointments through Prisma.
- **TanStack Query** manages client-side queries, mutations, and cache invalidation.
- **Clerk** provides authentication and subscription-plan checks.
- **Resend** sends appointment emails through a Next.js route handler.
- **Vapi** connects the browser to an assistant configured outside the repository.

The database contains three main models:

| Model | Purpose |
| --- | --- |
| `User` | Application profile linked to a Clerk account |
| `Doctor` | Doctor details, specialty, and availability status |
| `Appointment` | Patient, doctor, date, time, reason, and status |

## Project Structure

| Path | Purpose |
| --- | --- |
| `src/app/` | App Router pages and the email API route |
| `src/components/appointments/` | Multi-step booking interface |
| `src/components/admin/` | Doctor management and appointment administration |
| `src/components/dashboard/` | Patient statistics and next appointment |
| `src/components/voice/` | Vapi call interface and plan access UI |
| `src/components/emails/` | React Email confirmation template |
| `src/components/ui/` | Shared UI components |
| `src/hooks/` | TanStack Query hooks |
| `src/lib/actions/` | Server Actions for users, doctors, and appointments |
| `src/lib/` | Prisma, Resend, Vapi, and utility configuration |
| `prisma/schema.prisma` | Database schema |
| `public/` | Static images and assets |

## Local Development

### Prerequisites

- Node.js and npm.
- A PostgreSQL database, such as a development database on Neon.
- A Clerk application.
- A Resend API key for confirmation emails.
- A Vapi public key and assistant ID for voice calls.

### 1. Clone and install

```bash
git clone https://github.com/konrad3211/dentwise.git
cd dentwise
npm ci
```

### 2. Configure environment variables

Create a `.env` file in the project root. Using this file makes the database URL available to both Next.js and the Prisma CLI.

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_EMAIL=your_admin_email

RESEND_API_KEY=your_resend_api_key

NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id
```

Replace the placeholders with your service configuration. Use the Vapi **public** key for `NEXT_PUBLIC_VAPI_API_KEY`: variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Keep private keys and database credentials out of version control.

### 3. Initialize a development database

```bash
npx prisma generate
npx prisma db push
```

The repository contains a Prisma schema but no checked-in migration history. Use `db push` with a new development database; it changes the schema of the database specified by `DATABASE_URL`.

### 4. Enable user synchronization

Booking requires a PostgreSQL user record linked to the signed-in Clerk account.

The project includes a `UserSync` component, but its usage is currently commented out in `src/app/layout.tsx`. Enable it inside the existing Clerk provider by changing:

```tsx
{/* <UserSync /> */}
```

to:

```tsx
<UserSync />
```

The component calls the existing `syncUser` Server Action after sign-in to create a missing application user.

### 5. Start the application

```bash
npm run dev
```

Open **http://localhost:3000**.

Sign in with a Clerk account whose first email address matches `ADMIN_EMAIL`, open `/admin`, and add an active doctor. You can then try the booking flow at `/appointments`.

## External Service Setup

### Clerk

Use keys from the same Clerk application. The admin page compares `ADMIN_EMAIL` with the first email address returned for the signed-in account.

To use the voice page, configure Clerk Billing plans with the slugs `ai_basic` or `ai_pro` and give the test user access to one of them. The `/pro` page renders Clerk's pricing table.

### Resend

The email handler currently uses `DentWise <no-reply@resend.dev>` as a testing sender. For your own deployment, configure a verified sender domain and update the `from` value in:

```text
src/app/api/send-appointment-email/route.ts
```

A booking is saved before the email request. Email delivery failure does not roll back the appointment.

### Vapi

Create an assistant in Vapi and provide its ID and your public API key. The assistant's prompt and service configuration are managed in Vapi rather than in this repository.

Allow microphone access when starting a call.

## Available Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js with Turbopack |
| `npm run build` | Generate Prisma Client and build Next.js |
| `npm start` | Start the production server |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format files using Biome |
| `npx prisma studio` | Inspect the development database |

## Production Build

Provide the environment variables and prepare the database, then run:

```bash
npm run build
npm start
```

The build generates Prisma Client; it does not create or migrate database tables. Provide public Clerk and Vapi configuration before building, because Next.js embeds public environment variables in the client bundle.

Serve the application through HTTPS for browser voice access outside localhost.

## Current Scope

This is a portfolio application demonstrating appointment workflows and third-party integrations.

- The admin page checks the configured email, but administrative Server Actions still need their own authorization checks.
- Booked slots are disabled in the UI; the booking action does not yet enforce a database-level constraint against simultaneous bookings for the same slot.
- Voice transcripts are held in client state rather than stored in the application database.
- Automated tests are not currently configured.

## Author

**Konrad Patla** · [@konrad3211](https://github.com/konrad3211)
