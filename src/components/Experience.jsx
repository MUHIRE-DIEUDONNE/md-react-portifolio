// src/components/Experience.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FiBriefcase, FiMapPin, FiCalendar, FiChevronDown,
  FiArrowUpRight, FiDownload, FiCheckCircle
} from 'react-icons/fi'

/* ─────────────────────────────────────────────
   INJECTED STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --exp-bg:        #0c0b09;
    --exp-surface:   #131210;
    --exp-card:      rgba(22, 20, 16, 0.95);
    --exp-border:    rgba(255,245,220,0.07);
    --exp-border-hi: rgba(212,175,85,0.35);
    --exp-gold:      #d4af55;
    --exp-gold-dim:  rgba(212,175,85,0.18);
    --exp-cream:     #f5eed8;
    --exp-muted:     rgba(245,238,216,0.42);
    --exp-dim:       rgba(245,238,216,0.18);
    --exp-red:       #c0392b;
    --exp-teal:      #2ecc9a;
    --exp-shadow:    0 24px 64px rgba(0,0,0,0.65);
    --exp-display:   'Playfair Display', Georgia, serif;
    --exp-body:      'Instrument Sans', system-ui, sans-serif;
  }

  .exp-root *, .exp-root *::before, .exp-root *::after {
    box-sizing: border-box;
    margin: 0; padding: 0;
  }

  .exp-root {
    font-family: var(--exp-body);
    background: var(--exp-bg);
    color: var(--exp-cream);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }

  /* Grain overlay */
  .exp-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  /* Scrollbar */
  .exp-root ::-webkit-scrollbar { width: 3px; }
  .exp-root ::-webkit-scrollbar-track { background: transparent; }
  .exp-root ::-webkit-scrollbar-thumb { background: var(--exp-border-hi); border-radius: 4px; }

  /* Filter pill */
  .exp-pill {
    padding: 8px 22px; border-radius: 100px; font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--exp-border); background: transparent;
    color: var(--exp-muted); font-family: var(--exp-body);
    transition: all 0.22s ease;
  }
  .exp-pill:hover { border-color: var(--exp-border-hi); color: var(--exp-cream); }
  .exp-pill.active {
    background: var(--exp-gold); border-color: var(--exp-gold);
    color: #0c0b09; font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }

  /* Card hover */
  .exp-card {
    border: 1px solid var(--exp-border);
    background: var(--exp-card);
    border-radius: 16px;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    will-change: transform;
    position: relative; overflow: hidden;
  }
  .exp-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--exp-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .exp-card:hover {
    border-color: var(--exp-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 0 transparent;
    transform: translateY(-2px);
  }
  .exp-card:hover::before { opacity: 1; }

  /* Tech badge */
  .exp-badge {
    padding: 4px 12px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid; font-family: var(--exp-body);
    transition: transform 0.15s;
  }
  .exp-badge:hover { transform: scale(1.05); }

  /* Index number */
  .exp-index {
    font-family: var(--exp-display);
    font-size: clamp(80px, 12vw, 140px);
    font-weight: 900; line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(212,175,85,0.15);
    user-select: none; pointer-events: none;
    position: absolute; top: -10px; right: 12px;
    transition: -webkit-text-stroke-color 0.3s;
  }
  .exp-card:hover .exp-index { -webkit-text-stroke-color: rgba(212,175,85,0.28); }

  /* Section rule */
  .exp-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--exp-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  /* CTA button */
  .exp-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 100px; border: none;
    background: var(--exp-gold); color: #0c0b09;
    font-family: var(--exp-body); font-size: 13px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
    text-decoration: none;
    box-shadow: 0 8px 32px rgba(212,175,85,0.35);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .exp-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(212,175,85,0.45);
    background: #e0be6a;
  }
  .exp-cta:active { transform: translateY(0); }

  /* Expand toggle */
  .exp-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-family: var(--exp-body); font-size: 11px;
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 8px 0; transition: opacity 0.2s;
  }
  .exp-toggle:hover { opacity: 0.7; }

  /* Stat card */
  .exp-stat {
    border: 1px solid var(--exp-border);
    border-radius: 12px; padding: 20px 16px;
    text-align: center;
    background: rgba(255,255,255,0.015);
    transition: border-color 0.25s, background 0.25s;
    position: relative; overflow: hidden;
  }
  .exp-stat:hover {
    border-color: var(--exp-border-hi);
    background: rgba(212,175,85,0.04);
  }

  /* Vertical timeline line */
  .exp-vline {
    position: absolute; left: 27px; top: 80px; bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, var(--exp-gold-dim) 0%, transparent 100%);
    pointer-events: none;
  }

  /* Type badge */
  .exp-type {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    font-family: var(--exp-body);
  }

  @media (max-width: 640px) {
    .exp-index { font-size: 80px; right: 8px; }
  }
`

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 1,
    company: 'Creative Agency',
    position: 'Lead Frontend Developer',
    period: '2022 – Present',
    location: 'San Francisco, CA (Remote)',
    description: 'Leading a team of 5 developers in crafting immersive web experiences for global brands — from concept to deployment.',
    achievements: [
      'Architected a component library adopted across 10+ client projects',
      'Mentored junior developers, resulting in 3 promotions within the team',
      'Introduced Three.js for interactive 3-D product showcases',
    ],
    technologies: ['React', 'Three.js', 'GSAP', 'TypeScript'],
    type: 'full-time',
    color: '#d4af55',
    typeColor: { bg: 'rgba(212,175,85,0.12)', text: '#d4af55', border: 'rgba(212,175,85,0.3)' },
  },
  {
    id: 2,
    company: 'Tech Startup',
    position: 'Senior React Developer',
    period: '2020 – 2022',
    location: 'Austin, TX',
    description: 'Developed and maintained multiple React applications with relentless focus on performance and delightful UX.',
    achievements: [
      'Reduced bundle size by 35% through code splitting and lazy loading',
      'Implemented real-time collaborative features via WebSockets',
      'Led migration from class components to functional Hooks',
    ],
    technologies: ['React', 'Framer Motion', 'Redux', 'Node.js'],
    type: 'full-time',
    color: '#2ecc9a',
    typeColor: { bg: 'rgba(46,204,154,0.1)', text: '#2ecc9a', border: 'rgba(46,204,154,0.3)' },
  },
  {
    id: 3,
    company: 'Digital Studio',
    position: 'Frontend Developer',
    period: '2018 – 2020',
    location: 'New York, NY',
    description: 'Created responsive, high-conversion websites for diverse clients across fashion, tech, and publishing verticals.',
    achievements: [
      'Delivered 20+ client projects on time and within budget',
      'Won "Best Interactive Design" at local hackathon',
      'Developed reusable animation components adopted company-wide',
    ],
    technologies: ['JavaScript', 'CSS3', 'GSAP', 'PHP'],
    type: 'full-time',
    color: '#e07070',
    typeColor: { bg: 'rgba(224,112,112,0.1)', text: '#e07070', border: 'rgba(224,112,112,0.3)' },
  },
  {
    id: 4,
    company: 'Procedural Worlds Lab',
    position: '3D Graphics Developer',
    period: '2021 – Present',
    location: 'Remote (Global)',
    description: 'Specialising in procedural generation, terrain systems, and interactive 3-D environments for the open web.',
    achievements: [
      'Developed real-time terrain generation using Perlin noise',
      'Built interactive planet rendering with atmospheric shader effects',
      'Created a procedural world generator with biomes and ecosystems',
    ],
    technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'React'],
    type: 'freelance',
    color: '#7ec8e3',
    typeColor: { bg: 'rgba(126,200,227,0.1)', text: '#7ec8e3', border: 'rgba(126,200,227,0.3)' },
  },
  {
    id: 5,
    company: 'Game Dev Studio',
    position: 'WebGL Developer',
    period: '2020 – 2021',
    location: 'Remote',
    description: 'Pushed the browser as a game platform — real-time physics, particle systems, and multiplayer gameplay.',
    achievements: [
      'Shipped a multiplayer 3-D game with real-time physics simulation',
      'Engineered a GPU particle system for visual FX and explosions',
      'Built a voxel terrain editor with live preview rendering',
    ],
    technologies: ['WebGL', 'Three.js', 'TypeScript', 'Socket.io'],
    type: 'freelance',
    color: '#f0a060',
    typeColor: { bg: 'rgba(240,160,96,0.1)', text: '#f0a060', border: 'rgba(240,160,96,0.3)' },
  },
]

const STATS = [
  { value: '5+', label: 'Years Active' },
  { value: '50+', label: 'Projects Shipped' },
  { value: '30+', label: 'Happy Clients' },
  { value: '10+', label: 'Technologies' },
]

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'full-time', label: 'Full-Time' },
  { id: 'freelance', label: 'Freelance' },
]

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const Counter = ({ value }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const num = parseInt(value)
  const suffix = value.replace(/[0-9]/g, '')
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = num
    const dur = 1200
    const step = dur / end
    const timer = setInterval(() => {
      start += 1
      setDisplay(start)
      if (start >= end) clearInterval(timer)
    }, step)
    return () => clearInterval(timer)
  }, [inView, num])

  return <span ref={ref}>{inView ? display : 0}{suffix}</span>
}

/* ─────────────────────────────────────────────
   EXPERIENCE CARD
───────────────────────────────────────────── */
const ExpCard = ({ exp, index, total }) => {
  const [expanded, setExpanded] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', marginBottom: index < total - 1 ? 20 : 0 }}
    >
      <div className="exp-card">
        {/* Ghost index numeral */}
        <div className="exp-index">{String(index + 1).padStart(2, '0')}</div>

        <div style={{ padding: '28px 28px 24px', position: 'relative', zIndex: 1 }}>
          {/* TOP ROW */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            {/* Dot + vertical connector */}
            <div style={{ flexShrink: 0, paddingTop: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: exp.color,
                boxShadow: `0 0 16px ${exp.color}60`,
                border: '3px solid var(--exp-bg)',
                flexShrink: 0,
              }} />
            </div>

            {/* Company + Meta */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{
                  fontFamily: 'var(--exp-display)', fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: 700, color: 'var(--exp-cream)', lineHeight: 1.2,
                }}>
                  {exp.company}
                </h3>
                <span className="exp-type" style={{
                  background: exp.typeColor.bg, color: exp.typeColor.text,
                  border: `1px solid ${exp.typeColor.border}`,
                }}>
                  {exp.type}
                </span>
              </div>

              <p style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                color: exp.color, marginBottom: 10,
              }}>
                {exp.position}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 14 }}>
                {[
                  { icon: FiCalendar, text: exp.period },
                  { icon: FiMapPin, text: exp.location },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--exp-muted)', fontSize: 12 }}>
                    <Icon size={11} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--exp-muted)', maxWidth: 640, marginBottom: 16 }}>
                {exp.description}
              </p>

              {/* Tech badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {exp.technologies.map(tech => (
                  <span key={tech} className="exp-badge" style={{
                    background: `${exp.color}10`,
                    color: exp.color,
                    borderColor: `${exp.color}35`,
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

              {/* Expand toggle */}
              <button className="exp-toggle" style={{ color: exp.color }} onClick={() => setExpanded(e => !e)}>
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <FiChevronDown size={13} />
                </motion.span>
                {expanded ? 'Hide details' : 'View achievements'}
              </button>
            </div>
          </div>

          {/* EXPANDED — achievements */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: 20, paddingTop: 20,
                  borderTop: '1px solid var(--exp-border)',
                }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--exp-gold)',
                    marginBottom: 14,
                  }}>
                    Key Achievements
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {exp.achievements.map((a, i) => (
                      <motion.li key={i}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                      >
                        <FiCheckCircle size={13} color={exp.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: 'var(--exp-muted)', lineHeight: 1.65 }}>{a}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
const Experience = () => {
  const [filter, setFilter] = useState('all')
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDarkMode(!html.classList.contains('light-mode'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const filtered = filter === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.type === filter)

  const lightModeStyles = `
    html.light-mode .exp-root {
      --exp-bg: #ffffff;
      --exp-surface: #f8fafc;
      --exp-card: rgba(255, 255, 255, 0.95);
      --exp-border: rgba(0, 0, 0, 0.1);
      --exp-border-hi: rgba(99, 102, 241, 0.3);
      --exp-gold: #6366f1;
      --exp-gold-dim: rgba(99, 102, 241, 0.1);
      --exp-cream: #0f172a;
      --exp-muted: rgba(15, 23, 42, 0.7);
      --exp-dim: rgba(15, 23, 42, 0.5);
      --exp-shadow: 0 24px 64px rgba(0,0,0,0.1);
    }
  `

  return (
    <section id="experience" className="exp-root" style={{ padding: 'clamp(60px, 8vw, 120px) 0' }}>
      <style>{STYLES}{lightModeStyles}</style>

      {/* Ambient blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '8%', left: '-10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(212,175,85,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-8%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px, 7vw, 80px)' }}
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'var(--exp-gold)' }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--exp-gold)', fontFamily: 'var(--exp-body)',
            }}>
              Career Timeline
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--exp-display)',
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 900, lineHeight: 1.02,
            color: 'var(--exp-cream)', letterSpacing: '-0.02em',
            marginBottom: 18,
          }}>
            Professional<br />
            <em style={{ color: 'var(--exp-gold)', fontStyle: 'italic' }}>Experience</em>
          </h2>

          <p style={{ fontSize: 15, color: 'var(--exp-muted)', maxWidth: 480, lineHeight: 1.7 }}>
            Five years across agencies, startups, and independent labs — building interfaces that move and worlds that breathe.
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, marginBottom: 'clamp(36px, 5vw, 56px)',
          }}
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="exp-stat"
              whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div style={{
                fontFamily: 'var(--exp-display)', fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 900, color: 'var(--exp-cream)', lineHeight: 1,
                marginBottom: 6,
              }}>
                <Counter value={s.value} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--exp-dim)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FILTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', gap: 8, marginBottom: 'clamp(28px, 4vw, 44px)', flexWrap: 'wrap' }}
        >
          {FILTERS.map(f => (
            <button key={f.id} className={`exp-pill ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── RULE ── */}
        <div className="exp-rule" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }} />

        {/* ── CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={filter}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((exp, i) => (
              <ExpCard key={exp.id} exp={exp} index={i} total={filtered.length} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── RULE ── */}
        <div className="exp-rule" style={{ margin: 'clamp(32px, 5vw, 52px) 0' }} />

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}
        >
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--exp-dim)' }}>
            Want the full picture?
          </p>
          <a href="#" className="exp-cta">
            <FiDownload size={14} />
            Download Résumé
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
              <FiArrowUpRight size={14} />
            </motion.span>
          </a>
        </motion.div>

      </div>
    </section>
  )
}

export default Experience