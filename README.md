# 🌌 Domain Expansion — Flagship Web Platform
[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016-orange?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Database: Neon PostgreSQL](https://img.shields.io/badge/Database-Neon%20Postgres-purple?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Styling: Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-blue?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Runtime: Node.js v20+](https://img.shields.io/badge/Runtime-Node.js%20v20+-green?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

Domain Expansion is a premium, high-performance digital agency web platform. It integrates a conversion-optimized marketing front-end, a dynamic practitioner-led blog, case study portfolios, an automated admin lead tracking system, and the pre-launch waitlist portal for **TechGuild**—India's verified B2B agency marketplace.

---

## 🚀 Key Features

* **High-Intent Marketing Front-End**: Modern visual system built with custom gradients, frosted glass layers, and interactive elements utilizing GPU-accelerated motion systems.
* **Dynamic Practitioner-Led Insights**: Statically pre-rendered (SSG) blog pages featuring in-depth articles on GEO, Next.js architecture, design systems, and autonomous n8n workflows.
* **Lead Capturing & CRM Logs**: Form validations backed by `/api/leads` and `/api/techguild-waitlist` POST routes, guarded with hCaptcha security, honeypot inputs, and fail-open Upstash Redis rate-limit middleware.
* **Secure Admin Dashboard**: Restricted pathing at `/admin/*` protected via NextAuth.js credentials provider, displaying leads overview grids, Waitlist search databases, and portfolio toggle states.
* **Automated Standalone Pipeline**: Configured for continuous integration, compiling in Next.js `standalone` mode to deploy easily on memory-throttled cPanel setups.

---

## 🛠️ The Tech Stack

| Layer | Technology | Key Capabilities |
| --- | --- | --- |
| **Frontend** | **React 19 / Next.js 16 (App Router)** | Server Components (RSC), static paths pre-generation, client state hooks. |
| **Styling** | **Tailwind CSS v4 / Vanilla CSS** | Custom design tokens, radial light gradients, liquid-glass animations. |
| **Animations** | **GSAP / Framer Motion / Lenis** | Smooth scroll synchronization, staggered viewport fade-ins, GPU ring cursors. |
| **Database** | **Prisma ORM / Neon Serverless** | Serverless PostgreSQL pool adapters, connection pool caching, quick query times. |
| **Auth** | **NextAuth.js (v5)** | Secure admin session tracking, credentials validation, JWT strategy. |
| **Security** | **hCaptcha / CSP Headers** | Form protection, XSS script whitelisting, Referrer transport rules. |
| **Deployment** | **GitHub Actions / Standalone Node** | Standalone bundling, automated build runners, cPanel FTP sync. |

---

## 📁 Repository Structure

```text
├── app/                      # Next.js App Router (Layouts, Pages, Routes)
│   ├── admin/                # NextAuth-protected Admin dashboards
│   ├── api/                  # Lead processing & Waitlist endpoints
│   ├── blog/                 # Blog archive & static details router
│   ├── case-studies/         # SSG Case study templates
│   ├── services/             # Dynamic Service Pillars pages
│   ├── techguild/            # TechGuild countdown and waitlist page
│   └── globals.css           # Tailwind v4 theme specs & global styles
├── components/               # Shared React Components
│   ├── blog/                 # Inline SVG Share bar components
│   ├── layout/               # Header, Footer, and Navbar mega-menus
│   └── ui/                   # Badge, Button, Preloader, and JSON-LD scripts
├── lib/                      # Business & Data logic utilities
│   ├── auth.ts               # NextAuth setup and validation rules
│   ├── data/                 # Static blog and project stores
│   ├── db/                   # Prisma database client pool singleton
│   └── ratelimit.ts          # Fail-safe Upstash rate limiter logic
├── prisma/                   # Prisma Schema & Database Seeding Scripts
└── public/                   # Static visual assets, brand icons, and blogs images
```

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the root directory to map your local resources:

```env
# Neon PostgreSQL database URL (with pool pooling configured)
DATABASE_URL="postgresql://username:password@ep-name-pooler.region.neon.tech/dbname?sslmode=require"

# NextAuth Secrets & URLs
NEXTAUTH_SECRET="your-generate-32-byte-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional Upstash Redis for Rate Limiting (Fails open if mock)
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

---

## 💻 Local Development Setup

Follow these commands to configure the workspace on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Sync the Database Schema**:
   ```bash
   npx prisma db push
   ```

3. **Seed Database Records** (Creates the default Super Admin user):
   ```bash
   npx ts-node prisma/seed.ts
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

---

## 🛡️ Production & Deployment Pipeline

This repository is optimized for deployment via **GitHub Actions** directly onto cPanel Node.js servers:
1. When code is pushed to `main`, a runner triggers `.github/workflows/deploy.yml`.
2. It compiles Next.js in `standalone` mode, packaging server files inside `.next/standalone`.
3. It bundles static files (`public/`, `.next/static/`) and uploads the final build to the cPanel application folder.
4. It touches `tmp/restart.txt` to trigger an automated Phusion Passenger server reload on your host, going live instantly.

---

*Maintained by the Domain Expansion Engineering Team © 2026*
