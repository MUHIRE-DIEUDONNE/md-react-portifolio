// src/components/Hero.jsx
// Pure CSS + Framer Motion hero — refactored for responsiveness,
// cleaner structure, and a mobile hamburger nav menu.

import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import profilePhoto from '../images/Muhire_dieudonne.JPG'

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const TECH_STACK = ['React', 'Three.js', 'Node.js', 'Framer Motion', 'Tailwind', 'TypeScript']

const STATS = [
  { value: '5+', label: 'Years Exp.' },
  { value: '40+', label: 'Projects' },
  { value: '20+', label: 'Clients' },
  { value: '15+', label: 'Countries' },
]

const TYPEWRITER_TEXTS = [
  'Crafting immersive digital experiences with cutting-edge web technologies.',
  'Building stunning 3D visualizations and interactive web applications.',
  'Transforming ideas into beautiful high-performance solutions.',
]

const MOBILE_BREAKPOINT = 768

/* ─────────────────────────────────────────────
   PREMIUM STYLES
───────────────────────────────────────────── */

const PREMIUM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

:root {
  --hero-bg: #0c0b09;
  --hero-surface: #131210;
  --hero-card: rgba(22,20,16,0.95);

  --hero-border: rgba(255,245,220,0.07);
  --hero-border-hi: rgba(212,175,85,0.35);

  --hero-gold: #d4af55;
  --hero-gold-dim: rgba(212,175,85,0.18);

  --hero-cream: #f5eed8;

  --hero-muted: rgba(245,238,216,0.5);
  --hero-dim: rgba(245,238,216,0.2);

  --hero-display: 'Playfair Display', serif;
  --hero-body: 'Instrument Sans', sans-serif;

  --nav-height: 84px;
}

.hero-root *,
.hero-root *::before,
.hero-root *::after {
  box-sizing: border-box;
}

.hero-root {
  position: relative;
  overflow: hidden;
  background: var(--hero-bg);
  color: var(--hero-cream);
  font-family: var(--hero-body);
}

/* Film-grain overlay */
.hero-root::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ── Buttons ── */
.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 999px;
  border: none;
  background: var(--hero-gold);
  color: #0c0b09;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: 0.3s ease;
  box-shadow: 0 10px 40px rgba(212,175,85,0.35);
  width: 100%;
  max-width: 240px;
}
.hero-btn-primary:hover { transform: translateY(-3px); }

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 30px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid var(--hero-border);
  color: var(--hero-muted);
  cursor: pointer;
  transition: 0.3s ease;
  width: 100%;
  max-width: 240px;
}
.hero-btn-ghost:hover {
  border-color: var(--hero-border-hi);
  color: var(--hero-cream);
}

/* ── Stat card ── */
.hero-stat {
  padding: clamp(14px, 2.4vw, 20px);
  flex: 1 1 130px;
  min-width: 110px;
  max-width: 160px;
  border-radius: 18px;
  border: 1px solid var(--hero-border);
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(20px);
  transition: 0.3s ease;
}
.hero-stat:hover {
  border-color: var(--hero-border-hi);
  background: rgba(212,175,85,0.04);
}

/* ── Tech pill ── */
.hero-pill {
  padding: 8px 18px;
  border-radius: 999px;
  border: 1px solid var(--hero-border);
  color: var(--hero-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: 0.3s ease;
}
.hero-pill:hover {
  border-color: var(--hero-border-hi);
  color: var(--hero-cream);
}

/* ── Ambient glow orb ── */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  mix-blend-mode: screen;
}

/* ── Animated rings ── */
@keyframes ring-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
@keyframes ring-spin-rev {
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
}
@keyframes ring-pulse {
  0%, 100% { opacity: 0.18; }
  50%       { opacity: 0.38; }
}

.hero-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid var(--hero-gold);
  transform-origin: center;
  pointer-events: none;
}

/* ── Content layout ── */
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1000px;
  width: 100%;
  padding: calc(var(--nav-height) + 24px) 24px 40px;
  text-align: center;
}

.hero-title {
  font-size: clamp(38px, 9vw, 110px);
  line-height: 1.04;
  margin-bottom: clamp(18px, 4vw, 30px);
  font-family: var(--hero-display);
}

.hero-subtitle {
  max-width: 720px;
  margin: 0 auto clamp(30px, 5vw, 50px);
  color: var(--hero-muted);
  font-size: clamp(15px, 2vw, 20px);
  min-height: 80px;
  padding: 0 8px;
}

.hero-cta-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: clamp(40px, 8vw, 70px);
}

.hero-stats-row {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: clamp(36px, 6vw, 60px);
}

.hero-tech-row {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 0 12px;
}

/* ── Responsive breakpoints ── */
@media (max-width: 768px) {
  .hero-cta-row { flex-direction: column; }
  .hero-btn-primary,
  .hero-btn-ghost { width: 100%; max-width: 280px; }
}

@media (max-width: 480px) {
  .hero-stat { min-width: 42%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-ring { animation: none !important; }
}
`

/* ─────────────────────────────────────────────
   AMBIENT RINGS  (CSS replacement for a 3D canvas)
───────────────────────────────────────────── */

const RING_CONFIG = [
  { size: 340, speed: '18s', opacity: 0.22, dir: 1, tiltX: 65, tiltY: 10 },
  { size: 500, speed: '28s', opacity: 0.14, dir: -1, tiltX: 45, tiltY: 25 },
  { size: 680, speed: '40s', opacity: 0.1, dir: 1, tiltX: 25, tiltY: 60 },
  { size: 880, speed: '55s', opacity: 0.07, dir: -1, tiltX: 72, tiltY: 18 },
]

const AmbientRings = ({ mouse }) => {
  const mx = (mouse?.x ?? 0) * 0.008
  const my = (mouse?.y ?? 0) * 0.008

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {RING_CONFIG.map((r, i) => (
        <div
          key={r.size}
          className="hero-ring"
          style={{
            width: r.size,
            height: r.size,
            marginLeft: -r.size / 2,
            marginTop: -r.size / 2,
            opacity: r.opacity,
            animation: `${r.dir > 0 ? 'ring-spin' : 'ring-spin-rev'} ${r.speed} linear infinite,
                        ring-pulse ${parseFloat(r.speed) * 0.7}s ease-in-out infinite`,
            transform: `rotateX(${r.tiltX + my}deg) rotateY(${r.tiltY + mx}deg)`,
            transition: 'transform 0.6s ease',
            borderColor: i % 2 === 0 ? 'rgba(212,175,85,0.6)' : 'rgba(46,204,154,0.4)',
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#d4af55',
          boxShadow: '0 0 40px 20px rgba(212,175,85,0.15)',
          opacity: 0.8,
        }}
      />
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAGNETIC HOOK  (desktop-only; no-op on touch)
───────────────────────────────────────────── */

const useMagnetic = (enabled = true) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * 0.2
      const y = (e.clientY - (r.top + r.height / 2)) * 0.2
      el.style.transform = `translate(${x}px, ${y}px)`
    }
    const onLeave = () => {
      el.style.transform = 'translate(0,0)'
      el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled])

  return ref
}

/* ─────────────────────────────────────────────
   WINDOW SIZE HOOK
───────────────────────────────────────────── */

const useIsMobile = (breakpoint = MOBILE_BREAKPOINT) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}

/* ─────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────── */

const InfiniteTypewriter = ({ texts, speed = 38, pauseDuration = 2000, className }) => {
  const [shown, setShown] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex]
    let timeout

    if (!isDeleting) {
      if (shown.length < currentText.length) {
        timeout = setTimeout(() => setShown(currentText.slice(0, shown.length + 1)), speed)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      }
    } else if (shown.length > 0) {
      timeout = setTimeout(() => setShown(currentText.slice(0, shown.length - 1)), speed / 2)
    } else {
      setIsDeleting(false)
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    }

    return () => clearTimeout(timeout)
  }, [shown, isDeleting, currentIndex, texts, speed, pauseDuration])

  return (
    <span className={className}>
      {shown}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        style={{ display: 'inline-block', width: 2, height: '1em', background: 'currentColor', marginLeft: 3 }}
      />
    </span>
  )
}

/* ─────────────────────────────────────────────
   GRID LINES
───────────────────────────────────────────── */

const GridLines = () => (
  <svg
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none', zIndex: 2 }}
  >
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

/* ─────────────────────────────────────────────
   SMALL PRESENTATIONAL COMPONENTS
───────────────────────────────────────────── */

const TechPill = ({ label }) => <div className="hero-pill">{label}</div>

const StatCard = ({ value, label }) => (
  <div className="hero-stat">
    <div style={{ fontSize: 'clamp(24px,5vw,42px)', fontWeight: 900, fontFamily: 'var(--hero-display)' }}>
      {value}
    </div>
    <div style={{ fontSize: 11, color: 'var(--hero-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {label}
    </div>
  </div>
)

const MagneticButton = ({ as: As = 'button', className, children, enabled, ...rest }) => {
  const ref = useMagnetic(enabled)
  return (
    <div ref={ref}>
      <As className={className} {...rest}>
        {children}
      </As>
    </div>
  )
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */

const Hero = () => {
  const containerRef = useRef()
  const shouldReduceMotion = useReducedMotion()
  const isMobile = useIsMobile()

  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (isMobile) return undefined // skip mouse-parallax listener on touch devices

    const onMove = (e) => {
      setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.4], [1, 0]), { damping: 25, stiffness: 80 })
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), { damping: 25, stiffness: 80 })

  if (!mounted) return null

  return (
    <>
      <style>{PREMIUM_STYLES}</style>

      <section
        id="top"
        ref={containerRef}
        className="hero-root"
        style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {!shouldReduceMotion && <AmbientRings mouse={mouse} />}

        <div
          className="glow-orb"
          style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(212,175,85,0.10), transparent)', top: '-20%', left: '-10%', zIndex: 1 }}
        />
        <div
          className="glow-orb"
          style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(46,204,154,0.07), transparent)', bottom: '-10%', right: '-10%', zIndex: 1 }}
        />

        <GridLines />

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity, y, margin: '0 auto' }}
            className="hero-content"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: 30 }}
            >
              <span
                style={{
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: 'rgba(212,175,85,0.12)',
                  border: '1px solid rgba(212,175,85,0.3)',
                  color: '#d4af55',
                  fontSize: 13,
                  display: 'inline-block',
                }}
              >
                Available for new projects
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-title"
            >
              Creative Developer
              <br />
              &amp; 3D Artist
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="hero-subtitle"
            >
              <InfiniteTypewriter texts={TYPEWRITER_TEXTS} />
            </motion.div>

            <div className="hero-cta-row">
              <MagneticButton className="hero-btn-primary" enabled={!isMobile}>
                View My Work
              </MagneticButton>
              <MagneticButton className="hero-btn-ghost" enabled={!isMobile}>
                Contact Me
              </MagneticButton>
            </div>

            <div className="hero-stats-row">
              {STATS.map((s) => (
                <StatCard key={s.label} value={s.value} label={s.label} />
              ))}
            </div>

            {!isMobile && (
              <div className="hero-tech-row">
                {TECH_STACK.map((item) => (
                  <TechPill key={item} label={item} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Hero
