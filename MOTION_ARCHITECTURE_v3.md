# Motion Architecture (v3)
## Lenis + GSAP + Motion + React Three Fiber Integration
**Version:** 3.0 | **Basis:** `FSD_v3.md` design system + `TAD_v3.md` stack. Next.js 14 App Router, TypeScript.

> Production-ready integration patterns. Code is authored, not executed here — run locally to verify.

---

## 1. Dependencies

```bash
npm i lenis gsap motion three @react-three/fiber @react-three/drei
# fonts via next/font (no install)
```

Register GSAP plugins client-side only:
```ts
// lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }
```

---

## 2. Lenis ↔ GSAP Sync (the foundation)

Lenis must drive GSAP's ScrollTrigger so pinning and scroll math agree.

```tsx
// components/providers/SmoothScroll.tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy() }
  }, [])
  return <>{children}</>
}
```
Wrap in root layout inside `<body>`.

---

## 3. Motion (Framer Motion) — Micro-interactions & Layout Morph

Shared variants (extends FSD A6):
```ts
// lib/motion.ts
export const ease = { smooth:[0.25,0.46,0.45,0.94] as const, snappy:[0.16,1,0.3,1] as const }
export const fadeUp = { hidden:{opacity:0,y:28}, visible:{opacity:1,y:0,transition:{duration:.55,ease:ease.smooth}} }
export const spring = { type:'spring' as const, stiffness:300, damping:30 }
```

**Magnetic button** (tactile):
```tsx
'use client'
import { motion, useMotionValue, useSpring } from 'motion/react'
export function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 250, damping: 18 })
  return (
    <motion.button style={{ x, y }}
      onMouseMove={(e)=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-(r.left+r.width/2))*0.35);y.set((e.clientY-(r.top+r.height/2))*0.35)}}
      onMouseLeave={()=>{x.set(0);y.set(0)}}
      whileTap={{ scale: 0.96 }}
      className="rounded-full bg-[#FF6200] px-9 py-3.5 text-white">{children}</motion.button>
  )
}
```

**Layout-morph thumbnail → case study header** (shared `layoutId` across routes; pair with Next `Link` + Motion `LayoutGroup`):
```tsx
<motion.img layoutId={`cs-${slug}`} src={cover} className="..." />
// on the case-study page hero, reuse the same layoutId on the full-bleed image
```

---

## 4. GSAP ScrollTrigger — Narrative & Pinning

**Horizontal-scroll pinned section** (homepage process / portfolio showcase):
```tsx
'use client'
import { useRef, useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
export function HorizontalPin({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null); const track = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dist = track.current!.scrollWidth - window.innerWidth
      gsap.to(track.current, { x: -dist, ease: 'none',
        scrollTrigger: { trigger: wrap.current, pin: true, scrub: 1, end: ()=>`+=${dist}` } })
    }, wrap)
    return () => ctx.revert()
  }, [])
  return <section ref={wrap} className="overflow-hidden"><div ref={track} className="flex">{children}</div></section>
}
```

**Velocity-skew text / line reveal:** split headings into lines (wrap each line in a span), then `gsap.from(lines,{yPercent:120,stagger:0.08,scrollTrigger:{trigger,start:'top 80%'}})`. For velocity skew, read `self.getVelocity()` in `onUpdate` and apply `skewY = clamp(velocity/-300, -8, 8)`.

**Clip-path image mask:** `gsap.fromTo(img,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',scrollTrigger:{trigger,scrub:true}})`.

Always clean up with `gsap.context().revert()` to survive App Router navigations.

---

## 5. React Three Fiber — The Hero "Wow"

Lazy, client-only, perf-guarded:
```tsx
// components/hero/HeroCanvas.tsx
'use client'
import { Canvas } from '@react-three/fiber'
import { Float, Environment } from '@react-three/drei'
import { CursorParticles } from './CursorParticles'
export function HeroCanvas() {
  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0, 6], fov: 42 }}>
      <color attach="background" args={[ '#0D0D0D' ]} />
      <fog attach="fog" args={[ '#0D0D0D', 6, 14 ]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 3, 5]} intensity={40} color="#FF6200" />
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
        {/* extruded glass wordmark mesh — swap for your GLB or Text3D */}
      </Float>
      <CursorParticles count={2400} />
      <Environment preset="studio" />
    </Canvas>
  )
}
```
Load with `dynamic(()=>import(...), { ssr:false })` and an Intersection Observer that sets `frameloop` to `'never'` when off-screen. Particles use `InstancedMesh` and a cursor uniform updated in `useFrame` with damping (`lerp`). Provide a static image/video fallback when `gl` context is unavailable or reduced-motion is set.

---

## 6. Custom Cursor

```tsx
'use client'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
export function Cursor() {
  const x = useSpring(useMotionValue(0), { stiffness: 500, damping: 40 })
  const y = useSpring(useMotionValue(0), { stiffness: 500, damping: 40 })
  const [hover, setHover] = useState(false)
  useEffect(() => {
    if (matchMedia('(pointer:coarse)').matches) return
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY)
      setHover(!!(e.target as HTMLElement).closest('[data-cursor]')) }
    window.addEventListener('mousemove', move); return () => window.removeEventListener('mousemove', move)
  }, [x, y])
  return <motion.div style={{ x, y }} className={`pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FF6200] ${hover?'h-14 w-14':'h-8 w-8'} transition-[height,width]`} />
}
```

---

## 7. Handoff Order (avoid conflicts)

1. Mount `SmoothScroll` (Lenis+GSAP ticker) at root.
2. Mount `Cursor` (desktop only).
3. Page sections register their own `gsap.context` in `useLayoutEffect`, cleaned on unmount.
4. R3F canvases are isolated, lazy, and never share the GSAP ticker (they use `useFrame`).
5. Motion handles all layout/`layoutId` morphs and hover springs.
6. Everything checks `prefers-reduced-motion` first.

---

*Document Version: 3.0 | Domain Expansion © 2026*
