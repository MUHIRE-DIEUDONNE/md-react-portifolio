// src/components/Skills.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThreeHero from './ThreeHero'

// ─── useTheme hook (inline) ────────────────────
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDarkMode(!html.classList.contains('light-mode'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

// ─── useMediaQuery hook (inline) ──────────────
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    setMatches(mq.matches)
    const handler = (e) => setMatches(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])
  return matches
}

// ─── Styles ──────────────────────────────────────
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  .skills-globe-root {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    background: #0c0b09;
    color: #f5eed8;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* ── Globe stage: full-bleed on desktop, a contained rounded
     panel on mobile so it never fights the title/filter text ── */
  .skills-globe-root .globe-stage {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  @media (max-width: 680px) {
    .skills-globe-root .globe-stage {
      top: max(17%, calc(env(safe-area-inset-top) + 92px));
      bottom: max(20%, calc(env(safe-area-inset-bottom) + 96px));
      left: 3%;
      right: 3%;
      border-radius: 28px;
      overflow: hidden;
      border: 1px solid rgba(212,175,85,0.18);
      box-shadow: 0 0 0 1px rgba(212,175,85,0.06), 0 30px 80px rgba(0,0,0,0.55);
    }
  }

  .skills-globe-root .globe-loading {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
  }

  .skills-globe-root .globe-loading .ring {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 2px solid rgba(212,175,85,0.18);
    border-top-color: #d4af55;
    animation: globe-spin 0.9s linear infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .skills-globe-root .globe-loading .ring { animation-duration: 1.6s; }
  }

  .skills-globe-root .globe-loading span {
    font-size: 0.7rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(245,238,216,0.4);
  }

  @keyframes globe-spin { to { transform: rotate(360deg); } }

  /* ── Vignettes so overlay text stays legible over the globe ── */
  .skills-globe-root .vignette-top,
  .skills-globe-root .vignette-bottom {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    pointer-events: none;
  }
  .skills-globe-root .vignette-top {
    top: 0;
    height: clamp(120px, 22vh, 220px);
    background: linear-gradient(to bottom, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0) 100%);
  }
  .skills-globe-root .vignette-bottom {
    bottom: 0;
    height: clamp(110px, 20vh, 200px);
    background: linear-gradient(to top, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0) 100%);
  }

  .skills-globe-root .globe-title {
    position: absolute;
    top: max(5%, calc(env(safe-area-inset-top) + 18px));
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    text-align: center;
    pointer-events: none;
    width: min(92vw, 640px);
  }

  .skills-globe-root .globe-title h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.75rem, 7vw, 4rem);
    line-height: 1.1;
    margin-bottom: 0.25rem;
    background: linear-gradient(135deg, #d4af55, #f5eed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 40px rgba(212,175,85,0.3);
  }

  .skills-globe-root .globe-title p {
    color: rgba(245,238,216,0.6);
    font-size: clamp(0.75rem, 2.5vw, 1rem);
    letter-spacing: 0.1em;
  }

  /* Filter overlay */
  .skills-globe-root .filter-overlay {
    position: absolute;
    bottom: max(5%, calc(env(safe-area-inset-bottom) + 18px));
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    justify-content: center;
    width: min(92vw, 560px);
    pointer-events: none;
  }

  .skills-globe-root .filter-overlay button {
    pointer-events: auto;
    padding: 0.6rem 1.25rem;
    min-height: 40px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    border: 1px solid rgba(212,175,85,0.25);
    background: rgba(12,11,9,0.6);
    backdrop-filter: blur(8px);
    color: rgba(245,238,216,0.7);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
    touch-action: manipulation;
  }

  .skills-globe-root .filter-overlay button:hover {
    border-color: #d4af55;
    color: #fff;
    background: rgba(212,175,85,0.15);
  }

  .skills-globe-root .filter-overlay button:active {
    transform: scale(0.95);
  }

  .skills-globe-root .filter-overlay button.active {
    background: #d4af55;
    border-color: #d4af55;
    color: #0c0b09;
    font-weight: 600;
  }

  .skills-globe-root .filter-count {
    position: absolute;
    bottom: max(5%, calc(env(safe-area-inset-bottom) + 18px));
    left: 50%;
    transform: translate(-50%, calc(-100% - 52px));
    z-index: 20;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,238,216,0.35);
    pointer-events: none;
    white-space: nowrap;
  }

  @media (max-width: 420px) {
    .skills-globe-root .filter-overlay button {
      padding: 0.55rem 1rem;
      font-size: 0.7rem;
    }
  }
`

// ─── Category tags for the optional filter ─────
const CATEGORY = {
  React: 'frontend', 'Three.js': 'frontend', TypeScript: 'frontend', JavaScript: 'frontend',
  Tailwind: 'frontend', 'Next.js': 'frontend', Svelte: 'frontend', WebGL: 'frontend', GSAP: 'frontend',
  'Node.js': 'backend', GraphQL: 'backend', Python: 'backend',
  MongoDB: 'tools', Docker: 'tools', AWS: 'tools', Figma: 'tools',
}

// ─── Main Component ────────────────────────────
const Skills = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [threeReady, setThreeReady] = useState(false)
  const isDarkMode = useTheme()
  const isMobile = useMediaQuery('(max-width: 680px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  // ─── Optional category filter state ──────────
  const [selectedCategory, setSelectedCategory] = useState('all')

  // ─── Custom tech stack for the globe ──────────
  const allTech = useMemo(() => ([
    { label: 'React',          color: '#61dafb', radius: 3.1, speed: 0.38, phase: 0,   tiltX: 0.3 },
    { label: 'Three.js',       color: '#049EF4', radius: 3.4, speed: 0.30, phase: 1.2, tiltX: 0.2 },
    { label: 'Node.js',        color: '#68A063', radius: 3.2, speed: 0.34, phase: 2.4, tiltX: 0.4 },
    { label: 'TypeScript',     color: '#3178C6', radius: 3.5, speed: 0.28, phase: 3.6, tiltX: 0.1 },
    { label: 'JavaScript',     color: '#f7df1e', radius: 3.0, speed: 0.42, phase: 4.8, tiltX: 0.35 },
    { label: 'Tailwind',       color: '#06B6D4', radius: 3.6, speed: 0.26, phase: 0.6, tiltX: 0.25 },
    { label: 'MongoDB',        color: '#47A248', radius: 3.3, speed: 0.36, phase: 1.8, tiltX: 0.45 },
    { label: 'GSAP',           color: '#88CE02', radius: 3.7, speed: 0.24, phase: 3.0, tiltX: 0.15 },
    { label: 'GraphQL',        color: '#E10098', radius: 3.2, speed: 0.40, phase: 5.4, tiltX: 0.5  },
    { label: 'Next.js',        color: '#ffffff', radius: 3.5, speed: 0.32, phase: 6.0, tiltX: 0.28 },
    { label: 'Python',         color: '#3776AB', radius: 3.8, speed: 0.22, phase: 2.2, tiltX: 0.38 },
    { label: 'WebGL',          color: '#990000', radius: 3.4, speed: 0.35, phase: 4.2, tiltX: 0.22 },
    { label: 'Svelte',         color: '#FF3E00', radius: 3.9, speed: 0.20, phase: 1.0, tiltX: 0.45 },
    { label: 'Docker',         color: '#2496ED', radius: 3.0, speed: 0.44, phase: 3.2, tiltX: 0.18 },
    { label: 'AWS',            color: '#FF9900', radius: 3.3, speed: 0.33, phase: 5.0, tiltX: 0.40 },
    { label: 'Figma',          color: '#F24E1E', radius: 3.6, speed: 0.27, phase: 2.8, tiltX: 0.30 },
  ].map(t => ({ ...t, category: CATEGORY[t.label] || 'tools' }))), [])

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'tools', label: 'Tools' },
  ]

  // ─── Filtering actually applies now ───────────
  const filteredTech = useMemo(
    () => selectedCategory === 'all' ? allTech : allTech.filter(t => t.category === selectedCategory),
    [allTech, selectedCategory]
  )

  // Globe parameters — slightly calmer rotation on mobile / reduced-motion,
  // since lower-power GPUs and smaller viewports make fast spin feel jittery.
  const orbitSpeed = (prefersReducedMotion ? 0.25 : isMobile ? 0.6 : 0.8)
  const ringColor = '#d4af55'
  const accentColor = '#2ecc9a'

  // ─── Pointer tracking (mouse + touch, so the parallax tilt
  //     works on phones too, not just desktop) ─────────────
  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 })
    const onTouch = (e) => {
      const t = e.touches[0]
      if (!t) return
      setMouse({ x: t.clientX - window.innerWidth / 2, y: t.clientY - window.innerHeight / 2 })
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onTouch, { passive: true })
    const t = setTimeout(() => setThreeReady(true), 350)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onTouch)
      clearTimeout(t)
    }
  }, [])

  return (
    <section id="skills" className="skills-globe-root">
      <style>{PREMIUM_STYLES}</style>

      {/* ─── 3D Globe ─── */}
      <div className="globe-stage">
        {threeReady ? (
          <ThreeHero
            mousePosition={mouse}
            orbitSpeed={orbitSpeed}
            ringColor={ringColor}
            accentColor={accentColor}
            techStack={filteredTech}
          />
        ) : (
          <div className="globe-loading">
            <div className="ring" />
            <span>Loading skills</span>
          </div>
        )}
      </div>

      {/* ─── Legibility vignettes ─── */}
      <div className="vignette-top" />
      <div className="vignette-bottom" />

      {/* ─── Title ─── */}
      <div className="globe-title">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Skills &amp; Expertise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Technologies orbiting my universe
        </motion.p>
      </div>

      {/* ─── Filter count (small contextual hint) ─── */}
      <AnimatePresence>
        {selectedCategory !== 'all' && (
          <motion.div
            key="count"
            className="filter-count"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {filteredTech.length} {filteredTech.length === 1 ? 'technology' : 'technologies'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Filter ─── */}
      <div className="filter-overlay" role="group" aria-label="Filter skills by category">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategory === cat.id ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.id)}
            aria-pressed={selectedCategory === cat.id}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Skills
