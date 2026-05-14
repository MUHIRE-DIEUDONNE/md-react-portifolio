import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'

// ─── Magnetic Button Hook ────────────────────────────────────────────────────
const useMagnetic = () => {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * 0.25
      const y = (e.clientY - (r.top + r.height / 2)) * 0.25
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.transition = 'transform 0.1s ease'
    }
    const onLeave = () => {
      el.style.transform = 'translate(0,0)'
      el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [])
  return ref
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
const Typewriter = ({ text, speed = 38, delay = 1200, className }) => {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setShown(text.slice(0, ++i))
        if (i >= text.length) clearInterval(iv)
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [text, speed, delay])
  return (
    <span className={className}>
      {shown}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        style={{ display: 'inline-block', width: '2px', height: '1em', background: 'currentColor', marginLeft: '2px', verticalAlign: 'text-bottom' }}
      />
    </span>
  )
}

// ─── Infinite Typewriter ──────────────────────────────────────────────────────
const InfiniteTypewriter = ({ texts, speed = 38, delay = 1200, pauseDuration = 2000, className }) => {
  const [shown, setShown] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const startTyping = () => {
      setIsTyping(true)
      setIsPaused(false)
      let i = 0
      const currentText = texts[currentIndex]
      
      const iv = setInterval(() => {
        setShown(currentText.slice(0, ++i))
        if (i >= currentText.length) {
          clearInterval(iv)
          setIsTyping(false)
          setIsPaused(true)
          
          // Pause before deleting
          setTimeout(() => {
            let j = currentText.length
            const deleteIv = setInterval(() => {
              setShown(currentText.slice(0, --j))
              if (j <= 0) {
                clearInterval(deleteIv)
                setIsPaused(false)
                setCurrentIndex((prev) => (prev + 1) % texts.length)
              }
            }, speed / 2)
            return () => clearInterval(deleteIv)
          }, pauseDuration)
        }
      }, speed)
      
      return () => clearInterval(iv)
    }

    const timer = setTimeout(startTyping, delay)
    return () => clearTimeout(timer)
  }, [currentIndex, texts, speed, delay, pauseDuration])

  return (
    <span className={className}>
      {shown}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
        style={{ display: 'inline-block', width: '2px', height: '1em', background: 'currentColor', marginLeft: '2px', verticalAlign: 'text-bottom' }}
      />
    </span>
  )
}

// ─── Noise Overlay ───────────────────────────────────────────────────────────
const NoiseLayer = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035, pointerEvents: 'none', zIndex: 0 }}>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>
)

// ─── Animated Grid ───────────────────────────────────────────────────────────
const GridLines = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }}>
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

// ─── Orbiting Ring ───────────────────────────────────────────────────────────
const OrbitRing = ({ radius, duration, dotColor, offset = 0 }) => (
  <motion.div
    style={{ position: 'absolute', top: '50%', left: '50%', width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }}
    animate={{ rotate: 360 }}
    transition={{ duration, repeat: Infinity, ease: 'linear', delay: offset }}
  >
    <div style={{ position: 'absolute', top: -4, left: '50%', marginLeft: -4, width: 8, height: 8, borderRadius: '50%', background: dotColor, boxShadow: `0 0 12px ${dotColor}` }} />
  </motion.div>
)

// ─── Tech Pill ───────────────────────────────────────────────────────────────
const TechPill = ({ label, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 999,
      border: '1px solid rgba(255,255,255,0.1)',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.55)',
      letterSpacing: '0.04em',
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa' }} />
    {label}
  </motion.div>
)

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    style={{
      padding: '20px 28px',
      borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', fontFamily: "'Syne', sans-serif" }}>{value}</div>
    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
  </motion.div>
)

// ─── Hero ────────────────────────────────────────────────────────────────────
const Hero = () => {
  const containerRef = useRef(null)
  const btn1 = useMagnetic()
  const btn2 = useMagnetic()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const sp = { damping: 25, stiffness: 80 }
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.45], [1, 0]), sp)
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), sp)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return
    const onMove = (e) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 30, y: (e.clientY / window.innerHeight - 0.5) * 30 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [isMobile])

  const words = [
    { text: 'Creative', color: '#a78bfa' },
    { text: 'Developer', color: '#f0abfc' },
    { text: '&', color: 'rgba(255,255,255,0.3)' },
    { text: '3D', color: '#67e8f9' },
    { text: 'Artist', color: '#fff' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #070710; }

        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 999px;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff; font-size: 15px; font-weight: 500;
          border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          position: relative; overflow: hidden;
          transition: box-shadow 0.3s;
        }
        .hero-btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .hero-btn-primary:hover::after { opacity: 1; }
        .hero-btn-primary:hover { box-shadow: 0 0 32px rgba(139,92,246,0.5); }

        .hero-btn-ghost {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 13px 30px; border-radius: 999px;
          background: transparent; color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12); cursor: pointer;
          font-size: 15px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
        }
        .hero-btn-ghost:hover {
          border-color: rgba(167,139,250,0.5);
          color: #fff;
          background: rgba(167,139,250,0.06);
        }

        .glow-orb {
          position: absolute; border-radius: 50%;
          filter: blur(80px); pointer-events: none;
        }
      `}</style>

      <section
        ref={containerRef}
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          background: '#070710',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Ambient glows */}
        <div className="glow-orb" style={{ width: 700, height: 700, background: 'rgba(109,40,217,0.18)', top: '-10%', left: '-15%', transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)`, transition: 'transform 0.8s ease' }} />
        <div className="glow-orb" style={{ width: 500, height: 500, background: 'rgba(16,185,129,0.08)', bottom: '0%', right: '-10%', transform: `translate(${-mouse.x * 0.3}px, ${-mouse.y * 0.3}px)`, transition: 'transform 0.8s ease' }} />
        <div className="glow-orb" style={{ width: 300, height: 300, background: 'rgba(6,182,212,0.1)', top: '30%', right: '5%', transform: `translate(${mouse.x * 0.2}px, ${mouse.y * 0.2}px)`, transition: 'transform 0.8s ease' }} />

        <GridLines />
        <NoiseLayer />

        {/* Orbiting rings — only desktop */}
        {!isMobile && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <OrbitRing radius={260} duration={18} dotColor="#a78bfa" />
            <OrbitRing radius={380} duration={28} dotColor="#67e8f9" offset={5} />
          </div>
        )}

        {/* Main content */}
        <motion.div style={{ opacity, y, position: 'relative', zIndex: 10, maxWidth: 860, padding: '0 24px', textAlign: 'center' }}>

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            style={{ marginBottom: 28 }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 18px', borderRadius: 999,
              border: '1px solid rgba(167,139,250,0.25)',
              background: 'rgba(109,40,217,0.1)',
              fontSize: 13, color: '#c4b5fd', letterSpacing: '0.04em',
              backdropFilter: 'blur(12px)',
            }}>
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }}
              />
              Available for new projects
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 style={{ marginBottom: 24, lineHeight: 1.05, fontFamily: "'Syne', sans-serif" }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 14px' }}>
              {words.map((w, i) => (
                <motion.span
                  key={w.text}
                  initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 0.2 + i * 0.09, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    color: w.color,
                    fontSize: 'clamp(40px, 7vw, 88px)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    display: 'inline-block',
                  }}
                >
                  {w.text}
                </motion.span>
              ))}
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginBottom: 48, fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em', minHeight: 28 }}
          >
            <InfiniteTypewriter
              texts={[
                "Crafting immersive digital experiences with cutting-edge web technologies",
                "Building stunning 3D visualizations and interactive web applications",
                "Transforming ideas into beautiful, high-performance digital solutions",
                "Creating innovative user experiences with modern web frameworks"
              ]}
              delay={900}
              speed={32}
              pauseDuration={2500}
            />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginBottom: 60 }}
          >
            <div ref={btn1}>
              <button
                className="hero-btn-primary"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View My Work
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h9M12 5l6 7-6 7" /></svg>
              </button>
            </div>
            <div ref={btn2}>
              <button
                className="hero-btn-ghost"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact Me
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}
          >
            {[
              { value: '5+', label: 'Years exp.' },
              { value: '40+', label: 'Projects' },
              { value: '20+', label: 'Clients' },
            ].map((s, i) => <StatCard key={s.label} {...s} delay={1.2 + i * 0.08} />)}
          </motion.div>

          {/* Tech stack pills */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}
            >
              {['React', 'Three.js', 'GSAP', 'Framer Motion', 'TypeScript', 'WebGL'].map((t, i) => (
                <TechPill key={t} label={t} delay={1.4 + i * 0.07} />
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(167,139,250,0.6), transparent)', position: 'relative', overflow: 'hidden' }}>
            <motion.div
              animate={{ y: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', background: 'rgba(167,139,250,0.9)' }}
            />
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default Hero