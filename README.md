# LiveWell by James Bell

> *"American Christianity has domesticated Jesus. This is an attempt to recover what we've lost."*

LiveWell is the writing and teaching platform of James C. Bell — a space for theological writing, pastoral resources, books, and discipleship tools rooted in a prophetic, Christ-centered faith.

**Live site:** [livewellbyjamesbell.co](https://www.livewellbyjamesbell.co)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Routing | Wouter |
| API | tRPC |
| Backend | Express.js (Node) |
| Database | PostgreSQL + Drizzle ORM |
| Styling | Tailwind CSS |
| Deployment | Vercel (serverless) |
| Email | Mailchimp |
| Payments | Stripe |
| Package Manager | pnpm |

---

## Project Structure

```
livewell/
├── api/            # Vercel serverless entry point
├── client/         # React frontend (Vite)
│   ├── public/     # Static assets (robots.txt, favicon, etc.)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level page components
│       ├── contexts/     # React context providers
│       ├── hooks/        # Custom hooks
│       └── lib/          # tRPC client, utilities
├── drizzle/        # Database schema & migrations
├── scripts/        # Seed & utility scripts
├── server/         # Express server, routers, services
├── shared/         # Shared types & constants
└── vercel.json     # Vercel deployment config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root with the following:

```env
DATABASE_URL=postgresql://user:password@host:5432/livewell
SESSION_SECRET=your-session-secret
MAILCHIMP_API_KEY=your-mailchimp-key
MAILCHIMP_AUDIENCE_ID=your-audience-id
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=your-bucket-name
```

### Installation

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm exec drizzle-kit migrate

# Seed initial content (optional)
node scripts/seed-data.mjs

# Start development server
pnpm dev
```

### Development

The dev server starts both the Express API and Vite frontend concurrently.

- Frontend: `http://localhost:5173`
- API: `http://localhost:3000/api`

---

## Key Features

- **Writing platform** — Articles organized by theological pillars
- **Reading Paths** — Curated sequences of articles for guided study
- **Books & Store** — Book listings with Stripe-powered purchases
- **Resources** — Downloadable guides and tools for pastors and leaders
- **Membership** — Subscriber tiers with gated content
- **Lead Magnets** — Email capture with Mailchimp integration
- **Admin Dashboard** — Full CMS for posts, resources, books, and settings
- **Content Sync** — Substack RSS feed integration
- **Theology Quiz** — Interactive quiz for audience engagement
- **Search** — Full-text article search

---

## Deployment

The project deploys to Vercel. All API requests route through `api/index.ts` as a serverless function. The frontend is a Vite-built SPA served from `dist/public`.

```bash
# Production build
pnpm run build
```

---

## Database

Migrations are managed with Drizzle Kit:

```bash
# Generate a new migration
pnpm exec drizzle-kit generate

# Apply migrations
pnpm exec drizzle-kit migrate
```

---

## Admin Access

See `ADMIN_LOGIN_GUIDE.md` for instructions on accessing the admin dashboard.

---

## License

Private — All rights reserved. James C. Bell © 2024–2026.
