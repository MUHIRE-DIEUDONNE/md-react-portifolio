// src/components/About.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  FiClock, FiTrendingUp, FiAward, FiActivity,
  FiCalendar, FiTarget, FiMonitor, FiBook,
  FiHeadphones, FiMapPin, FiCamera, FiDownload,
  FiArrowUpRight, FiZap, FiBriefcase
} from 'react-icons/fi'

/* ─────────────────────────────────────────────
   SHARED DESIGN TOKENS (mirrors Experience.jsx)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ab-bg:        #0c0b09;
    --ab-surface:   #131210;
    --ab-card:      rgba(22, 20, 16, 0.95);
    --ab-border:    rgba(255,245,220,0.07);
    --ab-border-hi: rgba(212,175,85,0.35);
    --ab-gold:      #d4af55;
    --ab-gold-dim:  rgba(212,175,85,0.18);
    --ab-cream:     #f5eed8;
    --ab-muted:     rgba(245,238,216,0.42);
    --ab-dim:       rgba(245,238,216,0.18);
    --ab-teal:      #2ecc9a;
    --ab-display:   'Playfair Display', Georgia, serif;
    --ab-body:      'Instrument Sans', system-ui, sans-serif;
  }

  .ab-root *, .ab-root *::before, .ab-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ab-root {
    font-family: var(--ab-body);
    background: var(--ab-bg);
    color: var(--ab-cream);
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }

  /* Grain — identical to Experience */
  .ab-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  /* Scrollbar */
  .ab-root ::-webkit-scrollbar { width: 3px; }
  .ab-root ::-webkit-scrollbar-track { background: transparent; }
  .ab-root ::-webkit-scrollbar-thumb { background: var(--ab-border-hi); border-radius: 4px; }

  /* Section rule */
  .ab-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--ab-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  /* Stat card — matches exp-stat */
  .ab-stat {
    border: 1px solid var(--ab-border);
    border-radius: 12px; padding: 20px 16px;
    text-align: center;
    background: rgba(255,255,255,0.015);
    transition: border-color 0.25s, background 0.25s;
    position: relative; overflow: hidden;
  }
  .ab-stat:hover {
    border-color: var(--ab-border-hi);
    background: rgba(212,175,85,0.04);
  }

  /* Card — matches exp-card */
  .ab-card {
    border: 1px solid var(--ab-border);
    background: var(--ab-card);
    border-radius: 16px;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    position: relative; overflow: hidden;
  }
  .ab-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--ab-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .ab-card:hover {
    border-color: var(--ab-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
  .ab-card:hover::before { opacity: 1; }

  /* Tab pill — matches exp-pill */
  .ab-tab {
    padding: 8px 22px; border-radius: 100px; font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--ab-border); background: transparent;
    color: var(--ab-muted); font-family: var(--ab-body);
    transition: all 0.22s ease;
  }
  .ab-tab:hover { border-color: var(--ab-border-hi); color: var(--ab-cream); }
  .ab-tab.active {
    background: var(--ab-gold); border-color: var(--ab-gold);
    color: #0c0b09; font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }

  /* Skill badge — matches exp-badge */
  .ab-badge {
    padding: 4px 14px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid var(--ab-border-hi);
    background: var(--ab-gold-dim); color: var(--ab-gold);
    font-family: var(--ab-body);
    transition: transform 0.15s, background 0.15s;
  }
  .ab-badge:hover { transform: scale(1.05); background: rgba(212,175,85,0.25); }

  /* CTA — matches exp-cta */
  .ab-cta {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 32px; border-radius: 100px; border: none;
    background: var(--ab-gold); color: #0c0b09;
    font-family: var(--ab-body); font-size: 13px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
    text-decoration: none;
    box-shadow: 0 8px 32px rgba(212,175,85,0.35);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ab-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 40px rgba(212,175,85,0.45);
    background: #e0be6a;
  }

  /* Interest chip */
  .ab-interest {
    border: 1px solid var(--ab-border);
    border-radius: 12px; padding: 16px 12px;
    text-align: center; background: rgba(255,255,255,0.015);
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
    cursor: default;
  }
  .ab-interest:hover {
    border-color: var(--ab-border-hi);
    background: rgba(212,175,85,0.05);
    transform: translateY(-3px);
  }

  /* Timeline dot line */
  .ab-tl-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--ab-gold); flex-shrink: 0;
    box-shadow: 0 0 12px rgba(212,175,85,0.5);
    border: 2px solid var(--ab-bg);
    margin-top: 5px;
  }

  /* Profile image frame */
  .ab-imgframe {
    border-radius: 20px; overflow: hidden;
    border: 1px solid var(--ab-border);
    position: relative;
    transition: border-color 0.3s;
  }
  .ab-imgframe:hover { border-color: var(--ab-border-hi); }
  .ab-imgframe::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(12,11,9,0.85) 100%);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    .ab-tab { padding: 7px 14px; }
  }
`

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const STATS = [
  { value: 5,  suffix: '+', label: 'Years Active',      color: '#d4af55' },
  { value: 50, suffix: '+', label: 'Projects Shipped',  color: '#2ecc9a' },
  { value: 30, suffix: '+', label: 'Happy Clients',     color: '#e07070' },
  { value: 15, suffix: '',  label: 'Awards Won',        color: '#7ec8e3' },
]

const TIMELINE = [
  { year: '2023', event: 'Lead Frontend Developer at Creative Agency', color: '#d4af55' },
  { year: '2021', event: 'Senior Frontend Developer — Tech Startup',   color: '#2ecc9a' },
  { year: '2019', event: 'Full-Stack Developer — Digital Studio',      color: '#e07070' },
  { year: '2017', event: 'Started the Coding Journey',                 color: '#7ec8e3' },
]

const INTERESTS = [
  { icon: '🎮', name: 'Gaming' },
  { icon: '📖', name: 'Reading' },
  { icon: '🎧', name: 'Music' },
  { icon: '🏋️', name: 'Fitness' },
  { icon: '✈️', name: 'Travel' },
  { icon: '📷', name: 'Photography' },
]

const SKILLS = ['React', 'Three.js', 'GSAP', 'Framer Motion', 'TypeScript', 'Node.js']

const TABS = [
  { id: 'bio',       label: 'Bio' },
  { id: 'timeline',  label: 'Timeline' },
  { id: 'interests', label: 'Interests' },
]

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
const Counter = ({ value, suffix }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let i = 0
    const step = 1200 / value
    const t = setInterval(() => {
      i += 1; setDisplay(i)
      if (i >= value) clearInterval(t)
    }, step)
    return () => clearInterval(t)
  }, [inView, value])

  return <span ref={ref}>{inView ? display : 0}{suffix}</span>
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const About = () => {
  const [activeTab, setActiveTab] = useState('bio')
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

  // 3-D tilt on image
  const mx = useMotionValue(0); const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-120, 120], [10, -10]), { damping: 30 })
  const ry = useSpring(useTransform(mx, [-120, 120], [-10, 10]), { damping: 30 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - (r.left + r.width / 2))
    my.set(e.clientY - (r.top  + r.height / 2))
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  const lightModeStyles = `
    html.light-mode .ab-root {
      --ab-bg: #ffffff;
      --ab-surface: #f8fafc;
      --ab-card: rgba(255, 255, 255, 0.95);
      --ab-border: rgba(0, 0, 0, 0.1);
      --ab-border-hi: rgba(99, 102, 241, 0.3);
      --ab-gold: #6366f1;
      --ab-gold-dim: rgba(99, 102, 241, 0.1);
      --ab-cream: #0f172a;
      --ab-muted: rgba(15, 23, 42, 0.7);
      --ab-dim: rgba(15, 23, 42, 0.5);
    }
  `

  return (
    <section id="about" className="ab-root" style={{ padding: 'clamp(60px,8vw,120px) 0' }}>
      <style>{STYLES}{lightModeStyles}</style>

      {/* Ambient blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '-12%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(212,175,85,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '8%', left: '-10%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px,6vw,72px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'var(--ab-gold)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ab-gold)', fontFamily: 'var(--ab-body)' }}>
              Personal Profile
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--ab-display)', fontSize: 'clamp(38px,7vw,72px)', fontWeight: 900, lineHeight: 1.02, color: 'var(--ab-cream)', letterSpacing: '-0.02em', marginBottom: 18 }}>
            About<br />
            <em style={{ color: 'var(--ab-gold)', fontStyle: 'italic' }}>Me</em>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--ab-muted)', maxWidth: 480, lineHeight: 1.7 }}>
            A creative developer who believes great interfaces are felt, not just seen.
          </p>
        </motion.div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 'clamp(36px,5vw,56px)' }}
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="ab-stat" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div style={{ fontFamily: 'var(--ab-display)', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 6 }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ab-dim)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── RULE ── */}
        <div className="ab-rule" style={{ marginBottom: 'clamp(28px,4vw,40px)' }} />

        {/* ── TWO-COLUMN BODY ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)', gap: 'clamp(28px,4vw,56px)', alignItems: 'start' }}>

          {/* LEFT — image with tilt */}
          <motion.div
            style={{ perspective: 900, rotateX: rx, rotateY: ry }}
            onMouseMove={onMove} onMouseLeave={onLeave}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Ghost numeral — decorative like Experience */}
            <div style={{
              fontFamily: 'var(--ab-display)',
              fontSize: 'clamp(80px,14vw,160px)',
              fontWeight: 900, lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '1px rgba(212,175,85,0.1)',
              userSelect: 'none', pointerEvents: 'none',
              position: 'absolute', top: -20, left: -12, zIndex: 0,
            }}>MD</div>

            <div className="ab-imgframe" style={{
              height: 'clamp(280px,40vw,440px)',
              background: '#131210',
              position: 'relative', zIndex: 1,
            }}>
              <img
                src="/src/images/muhire dieudonne.JPG"
                alt="Muhire Dieudonne"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Gold corner accent */}
              <div style={{
                position: 'absolute', bottom: 20, left: 20, zIndex: 2,
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <div style={{ width: 32, height: 2, background: 'var(--ab-gold)', borderRadius: 1 }} />
                <div style={{ width: 20, height: 2, background: 'var(--ab-gold)', opacity: 0.5, borderRadius: 1 }} />
              </div>
            </div>

            {/* Availability badge below image */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 16, padding: '10px 18px', borderRadius: 100,
                border: '1px solid rgba(46,204,154,0.3)',
                background: 'rgba(46,204,154,0.08)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ab-teal)', animation: 'ab-blink 1.6s ease-in-out infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ab-teal)' }}>
                Available for Work
              </span>
            </motion.div>
            <style>{`@keyframes ab-blink { 0%,100%{opacity:1;} 50%{opacity:0.35;} }`}</style>
          </motion.div>

          {/* RIGHT — tabs + content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button key={t.id} className={`ab-tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {/* BIO */}
              {activeTab === 'bio' && (
                <motion.div key="bio"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                  <div className="ab-card" style={{ padding: 28, marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'var(--ab-display)', fontSize: 'clamp(20px,3vw,26px)', fontWeight: 700, color: 'var(--ab-cream)', marginBottom: 14 }}>
                      Hi, I'm <em style={{ color: 'var(--ab-gold)', fontStyle: 'italic' }}>Muhire Dieudonne</em>
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--ab-muted)', lineHeight: 1.8, marginBottom: 14 }}>
                      A passionate creative developer with 5+ years of experience building immersive web experiences. I specialise in React, Three.js, and advanced animations to craft sites that don't just look stunning — they feel alive.
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--ab-muted)', lineHeight: 1.8, marginBottom: 22 }}>
                      My journey started with curiosity for visual effects and has evolved into a career pushing the boundaries of what's possible on the web — one frame at a time.
                    </p>
                    {/* Skill badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                      {SKILLS.map(s => <span key={s} className="ab-badge">{s}</span>)}
                    </div>
                    {/* CTA */}
                    <a href="#" className="ab-cta">
                      <FiDownload size={14} />
                      Download CV
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                        <FiArrowUpRight size={14} />
                      </motion.span>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* TIMELINE */}
              {activeTab === 'timeline' && (
                <motion.div key="timeline"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                  <div className="ab-card" style={{ padding: 28 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ab-gold)', marginBottom: 20 }}>
                      Career Milestones
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {TIMELINE.map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09 }}
                          style={{ display: 'flex', gap: 16, paddingBottom: i < TIMELINE.length - 1 ? 24 : 0, position: 'relative' }}
                        >
                          {/* Vertical connector */}
                          {i < TIMELINE.length - 1 && (
                            <div style={{
                              position: 'absolute', left: 4, top: 18, bottom: 0, width: 1,
                              background: 'linear-gradient(180deg, var(--ab-gold-dim), transparent)',
                            }} />
                          )}
                          <div className="ab-tl-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: item.color, marginBottom: 4 }}>
                              {item.year}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--ab-muted)', lineHeight: 1.6 }}>
                              {item.event}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* INTERESTS */}
              {activeTab === 'interests' && (
                <motion.div key="interests"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {INTERESTS.map((item, i) => (
                      <motion.div key={i} className="ab-interest"
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}>
                        <div style={{ fontSize: 24, marginBottom: 8, lineHeight: 1 }}>{item.icon}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ab-muted)' }}>
                          {item.name}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── RULE ── */}
        <div className="ab-rule" style={{ margin: 'clamp(40px,5vw,64px) 0 0' }} />

      </div>
    </section>
  )
}

export default About