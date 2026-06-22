# SAD — Security & Access Document (v3)
## Domain Expansion — Agency Website & TechGuild Platform
**Version:** 3.0 (Consolidated Master) | **Date:** June 2026 | **Owner:** Ishwar B. Mule (Founder)
**Classification:** Internal — Restricted

---

## 1. Security Philosophy

Three principles: **Defence in Depth** (overlapping layers, no single point of failure), **Least Privilege** (every user/service/process gets only what it needs), **Zero Trust** (every request authenticated and validated regardless of origin). As a startup, controls are pragmatic and high-ROI, using free/low-cost tools that deliver enterprise-grade protection.

---

## 2. Threat Model

### 2.1 Assets
| Asset | Sensitivity | Risk if compromised |
|---|---|---|
| Lead contact data | High | Privacy breach, DPDP violation |
| Admin credentials | Critical | Full data access, defacement |
| Client portfolio content | Medium | Competitive intel leak |
| TechGuild user data | High | Trust loss, privacy breach |
| Env vars / API keys | Critical | Full compromise, API abuse cost |
| Database (Neon) | Critical | Total data loss/breach |

### 2.2 Threat Actors
Automated bots (spam/scrape), script kiddies (defacement), competitors (intel), phishing attackers (credential theft), data scrapers, future insider threat.

### 2.3 Attack Surface
Public: contact + waitlist endpoints, blog/portfolio pages, /api/*, static assets. Internal: /admin/*, /studio, Neon DB, Vercel dashboard, GitHub repo.

---

## 3. Authentication & Access Control

### 3.1 Roles
| Role | Scope | Access |
|---|---|---|
| Super Admin | Ishwar (Founder) | All leads/content, user mgmt, settings |
| Admin | Trusted team | Leads + content (no user mgmt) |
| Editor | Content creator | Blog/case studies only (no leads) |
| Public User | Visitor | Public pages, read-only |
| TechGuild Agency (P2) | Registered agency | Own profile, proposals, messages |
| TechGuild Client (P2) | Registered client | Own projects, proposals, messages |

### 3.2 Admin Auth Flow
Unauthenticated → redirect /admin/login → POST /api/auth/signin → valid: create 256-bit DB session token, set HttpOnly+Secure+SameSite=Strict cookie, redirect dashboard; invalid: increment fail counter (5 fails → 15-min lockout).

### 3.3 Session Management
8-hour sessions, 256-bit DB-stored tokens, HttpOnly+Secure+SameSite=Strict cookies, max 3 concurrent sessions, invalidation on logout/password-change/suspicion, optional 30-day remember-me (separate token, explicit consent).

### 3.4 Password Policy
Min 12 chars, mixed complexity, bcrypt cost-12, time-limited reset (1h), no reuse of last 5, TOTP MFA in Phase 2.

### 3.5 Route Protection
Middleware protects `/admin`, `/admin/:path*`, `/studio/:path*`; `/api/admin/*` and `GET /api/leads` require admin session; `POST /api/leads` and `POST /api/techguild-waitlist` public but rate-limited.

---

## 4. Input Security & Validation

### 4.1 Three Validation Layers
1. **Frontend (RHF + Zod)** — UX only, never trusted for security.
2. **API (Zod)** — re-validate server-side, `.strip()` unknown fields, reject bad content-type, 50KB payload cap.
3. **Database (Prisma)** — parameterized queries, schema-level limits and types.

### 4.2 Injection Prevention
| Attack | Prevention |
|---|---|
| SQL injection | Prisma parameterized only, no raw SQL |
| Stored XSS | DOMPurify before store + render |
| Reflected XSS | JSX auto-escape; no unsanitized dangerouslySetInnerHTML |
| Command injection | No shell/child_process in API routes |
| Path traversal | No user-input file system access |
| SSTI | No server-side templating |

### 4.3 File Upload Security
Allowed: jpeg/png/webp/gif/svg; max 10MB; direct-to-Cloudinary (never server-stored); Cloudinary moderation; UUID filename overwrite; SVG sanitized with svgo + script blocking.

---

## 5. CAPTCHA & Bot Protection

**hCaptcha** on all public forms, verified server-side (POST to hcaptcha.com/siteverify). **Rate limiting (Upstash):** leads 3/IP/hr + 10/IP/day; waitlist 1/IP/day; auth 5 fails/15min lockout; admin 200/session/min (block >500/min). **Additional:** hidden honeypot (silent reject), timing check (reject <2s submissions), Cloudflare Bot Fight Mode, user-agent edge blocking.

---

## 6. Transport Security

TLS 1.2 min / 1.3 preferred; Vercel-managed Let's Encrypt; `HSTS max-age=31536000; includeSubDomains; preload`; HTTP→HTTPS at both Cloudflare and Vercel.

**Security headers:** `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(),microphone=(),geolocation=()`, and a strict **CSP** allowing only self + GTM/hCaptcha (script), fonts.googleapis (style), fonts.gstatic (font), Cloudinary/Sanity (img), Sanity/hCaptcha/GA (connect), Calendly/hCaptcha (frame). No `unsafe-eval`.

---

## 7. Data Security & Privacy

### 7.1 Classification & Encryption
Lead/waitlist data: Confidential, PostgreSQL, TLS + AES-256 at rest (Neon-managed). Admin credentials: Secret, bcrypt. API keys: Secret, Vercel encrypted env. Content: Sanity TLS + at-rest. Images: Cloudinary TLS. Analytics: GA4 (Google-managed).

### 7.2 Retention
Leads (converted) 3y; leads (lost/spam) 6mo auto-delete; admin sessions 30d/on-logout; GA4 14mo; blog content indefinite; TechGuild waitlist until launch + 1y.

### 7.3 DPDP Act 2023 Compliance
Consent checkbox on all forms; purpose limitation stated; data minimization; right-to-erasure via Info@domainexpansion.in; Indian-region storage preference; 72h breach notification; published Privacy Policy.

### 7.4 GDPR (International)
Cookie consent banner (non-essential opt-in), GA4 IP anonymization, no cross-site tracking cookies, email-based deletion process.

---

## 8. API Security

Public endpoints (leads, waitlist): no auth, rate-limited, hCaptcha, Zod. Admin endpoints: session-token auth (DELETE leads = Super Admin only). Hardening: no client-side API keys (all external calls server-side), CORS restricted to domainexpansion.in, 50KB body cap, strict HTTP method enforcement (405), sanitized production errors, idempotency keys on writes.

---

## 9. Infrastructure Security

**Vercel:** env vars in dashboard only; password-protected previews; Owner-only access; audit logs (Pro). **GitHub:** private repo; main branch protection (PR review + CI pass); secret scanning; Dependabot; .gitignore for all .env; Husky pre-commit (ESLint + tsc + secret detection). **Neon:** sslmode=require; connection string in env only; PITR backups; Prisma-only access. **Cloudflare:** always-on DDoS, free-tier WAF (OWASP subset), Full-Strict SSL, Bot Fight Mode, Medium security level, DNS-level rate limiting.

---

## 10. Incident Response

### 10.1 Severity
P0 Critical (confirmed breach/admin compromise/defacement) <1h; P1 High (suspected breach/outage/mass spam) <4h; P2 Medium (anomaly/login spike/form abuse) <24h; P3 Low (scraping/single spam) <72h.

### 10.2 Procedures
**P0:** revoke all sessions (DELETE FROM admin_sessions), rotate all keys, maintenance mode, preserve logs, identify+patch vector, notify users within 72h, notify CERT-In if required, document. **P1:** Cloudflare Under-Attack mode, investigate logs, block IPs, patch+redeploy, monitor 24h.

### 10.3 Contacts
Primary: Ishwar B. Mule — Info@domainexpansion.in; Emergency: +91 89834 33664 (WhatsApp); Hosting: Vercel/Neon support; DNS/CDN: Cloudflare support.

---

## 11. Pre-Launch Security Checklist

Auth: non-obvious login URL, bcrypt cost-12, HttpOnly+Secure+SameSite cookies, lockout tested, admin 401 verified. Input: server-side Zod everywhere, hCaptcha server-verified, honeypots, Prisma-only SQL, XSS injection tests. Transport: HTTPS enforced, all headers present (securityheaders.com), no unsafe-eval, HSTS preload. Data: no committed .env, no client-side keys, Privacy Policy linked from forms, consent required, leads only in authed dashboard. Infra: Vercel env set, private repo, Dependabot on, Neon SSL, Cloudflare DDoS active. API: rate limits tested, /api/admin 401 without session, CORS restricted, no leaked stack traces.

---

*Document Version: 3.0 | Status: Approved | Domain Expansion © 2026 | CONFIDENTIAL*
