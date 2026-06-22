# Experience Blueprint (v3)
## Domain Expansion — Bespoke, Awwwards-Tier Build Plan
**Version:** 3.0 | **Owner:** Ishwar B. Mule | **Basis:** strictly derived from `FSD_v3.md`, `PRD_v3.md`, `TAD_v3.md`, `SAD_v3.md`.

> Honesty note: this is an authored architecture + creative blueprint. It does not run a live environment, generate media, or audit local tooling. Asset slots are marked `[ASSET]` for you to fill. All brand facts and page structure are taken from the v3 docs (brand orange `#FF6200`, near-black `#0D0D0D`, four pillars, TechGuild, 21 case studies).

---

## 1. Creative Thesis — The Anti-Template Mandate

Domain Expansion's flagship must feel *human-crafted and expensive*, never a symmetrical Tailwind grid. The design system already gives us the palette and tokens (DE Dark-Premium). This blueprint layers on the experiential craft:

- **Asymmetry by default.** No centered hero with two stacked buttons. The homepage hero is an off-axis split (62/38) with the 3D layer bleeding past the right margin into the viewport edge.
- **Negative space as a material.** Sections breathe with 12–20vw side gutters that collapse intentionally on key moments (full-bleed case study pins).
- **Overlap & masking.** Portfolio thumbnails overlap section boundaries; headings are revealed through clip-path masks tied to scroll velocity.
- **Custom cursor.** A magnetic dot+ring cursor that scales over interactive elements, inverts over media, and reads `data-cursor` labels ("View", "Drag", "Open").
- **Tactility.** Spring physics on every primary control so buttons feel magnetic, not clicked.

**Reference language (from knowledge, not live-sourced):** the layered depth and editorial restraint associated with aura.build / 21.dev / top Framer creators — generous type scale, monochrome base with a single hot accent, motion that serves narrative.

---

## 2. Typography Architecture

Replaces the FSD baseline (DM Sans) for the flagship build per directive:

- **Display / dynamic text:** **Bricolage Grotesque** (variable). Used for `text-hero`/`text-display`/`text-h1`, scroll-reveal lines, 3D floating typography.
- **Body / utility:** **Inter** (variable) for all body, captions, nav, form, and table text.
- **Mono accent (kept from FSD):** JetBrains Mono for stat labels and technical tags.

Type scale carries over from FSD A4 (hero 80 → display 56 → h1 40 …). Load via `next/font` (variable, `display:swap`, Latin subset). Orange gradient text effect retained on key display words.

---

## 3. Global Experiential Layers

| Layer | Tool | Always-on? |
|---|---|---|
| Smooth scroll | Lenis | Yes (root) |
| Micro-interaction / layout | Motion (Framer Motion) | Yes |
| Scroll narrative / pinning | GSAP + ScrollTrigger | Per-section |
| 3D / WebGL | React Three Fiber + drei | Hero + accent scenes only |
| Custom cursor | Motion (springs) | Desktop only, pointer:fine |

Reduced-motion (`prefers-reduced-motion`) disables Lenis, GSAP triggers, and R3F autoplay, falling back to static layout with instant reveals — mandatory per FSD A8.

---

## 4. Per-Page Choreography (mapped to FSD pages)

### 4.1 HomePage (`/`) — FSD B1
- **3D Hero (R3F):** floating, slowly rotating 3D wordmark "EXPANSION" in extruded glass, with an interactive particle swarm (1.5–3k instanced points) that drifts toward the cursor with damped attraction. Orange rim-light from a single point light; the `#0D0D0D` fog hides the far field. Headline "Think Outside The Box" reveals word-by-word over the canvas. Falls back to the FSD static mockup collage if WebGL unavailable.
- **Client Marquee:** Lenis-driven velocity skews the marquee text slightly on fast scroll (GSAP `skewX` proportional to scroll velocity), then eases back.
- **Four Pillars:** asymmetric staircase, not a 2×2 grid — cards offset vertically (0, +40px, +80px, +120px) with parallax depth.
- **Impact Stats:** GSAP counters with a numeric "odometer" roll, pinned briefly while counting.
- **Featured Portfolio:** thumbnails are **layout-morph** candidates (Motion `layoutId`) that expand into the project page header on click.
- **Process Flow:** horizontal-scroll pinned section (GSAP) — Discover→Strategy→Execute→Measure scroll sideways while the page is pinned; connector fills orange.

### 4.2 Case Study pages (`/case-studies/[slug]`) — FSD B9 + Part C
- **Entry transition:** the clicked thumbnail morphs into the full-bleed hero (shared `layoutId`).
- **Pinned metric reveal:** the three metric tiles pin and count up on scroll-in.
- **Image masking:** execution screenshots reveal via clip-path wipes tied to scroll progress.
- **Line-by-line text:** challenge/strategy paragraphs split into lines and reveal on scroll velocity (GSAP SplitText pattern).
- One scene per the 21 Part-C studies; PolyMint/PRCA is the featured horizontal-scroll showcase.

### 4.3 Portfolio Archive (`/portfolio`) — FSD B6
- Filter pills drive Motion layout animation; cards reflow with spring physics. Hover tilts cards (3D transform) toward the cursor.

### 4.4 Services + 4 Pillar pages — FSD B4/B5
- Each pillar hero gets a distinct accent R3F accent object (Marketing: orbiting nodes; Development: wireframe lattice; Design: morphing blob; AI: neural particle field). Process steps reveal line-by-line.

### 4.5 TechGuild (`/techguild`) — FSD B14
- Violet+orange gradient mesh background (R3F shader plane). Tabbed "How it works" uses Motion crossfade + height morph. Waitlist form retains all FSD/SAD security behavior.

### 4.6 About / Contact / Blog / Legal
- About timeline animates as a scroll-drawn line. Contact keeps the FSD form spec exactly (no experiential compromise to conversion). Blog/legal stay on the light canvas with restrained reveals for readability.

---

## 5. Custom Cursor Spec

State machine: `default` (8px dot + 32px ring, ring lags via spring), `hover` (ring scales to 56px, label fades in from `data-cursor`), `media` (ring inverts to blend-mode difference), `drag` (ring becomes a horizontal capsule with ↔). Hidden on `pointer:coarse`. Implemented with Motion `useSpring` on x/y.

---

## 6. Performance Budget (per TAD §10)

- R3F only on routes that need it; canvas lazy-loaded via dynamic import, `frameloop="demand"` where static.
- Instanced geometry for particles; cap DPR at `Math.min(devicePixelRatio, 2)`.
- Pause WebGL when canvas off-screen (Intersection Observer).
- JS budget < 200KB gz for non-3D routes; 3D chunk code-split.
- Targets unchanged: LCP < 2.5s, CLS < 0.1, INP < 200ms.

---

## 7. Asset Manifest (you supply)

`[ASSET]` hero environment HDR (studio, low-intensity); `[ASSET]` 21 case-study cover images (16:9, dark-graded); `[ASSET]` client wordmark SVGs; `[ASSET]` founder portrait; `[ASSET]` OG images per page; `[ASSET]` optional looping hero video fallback for no-WebGL devices.

---

*Document Version: 3.0 | Domain Expansion © 2026*
