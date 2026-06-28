// src/components/About.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  FiClock, FiTrendingUp, FiAward, FiActivity,
  FiCalendar, FiTarget, FiMonitor, FiBook,
  FiHeadphones, FiMapPin, FiCamera, FiDownload,
  FiArrowUpRight, FiZap, FiBriefcase
} from 'react-icons/fi'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ab-bg: #0c0b09;
    --ab-surface: #131210;
    --ab-card: rgba(22, 20, 16, 0.95);
    --ab-border: rgba(255,245,220,0.07);
    --ab-border-hi: rgba(212,175,85,0.35);
    --ab-gold: #d4af55;
    --ab-gold-dim: rgba(212,175,85,0.18);
    --ab-cream: #f5eed8;
    --ab-muted: rgba(245,238,216,0.42);
    --ab-dim: rgba(245,238,216,0.18);
    --ab-teal: #2ecc9a;
    --ab-display: 'Playfair Display', Georgia, serif;
    --ab-body: 'Instrument Sans', system-ui, sans-serif;
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

  .ab-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .ab-root ::-webkit-scrollbar { width: 3px; }
  .ab-root ::-webkit-scrollbar-track { background: transparent; }
  .ab-root ::-webkit-scrollbar-thumb { background: var(--ab-border-hi); border-radius: 4px; }

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

  .ab-badge {
    padding: 4px 14px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid var(--ab-border-hi);
    background: var(--ab-gold-dim); color: var(--ab-gold);
    font-family: var(--ab-body);
    transition: transform 0.15s, background 0.15s;
  }
  .ab-badge:hover { transform: scale(1.05); background: rgba(212,175,85,0.25); }

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

  .ab-tl-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--ab-gold); flex-shrink: 0;
    box-shadow: 0 0 12px rgba(212,175,85,0.5);
    border: 2px solid var(--ab-bg);
    margin-top: 5px;
  }

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
    <section id="about" className="ab-root py-[clamp(60px,8vw,120px)]">
      <style>{STYLES}{lightModeStyles}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[-12%] w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,85,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[8%] left-[-10%] w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="container-responsive relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[clamp(48px,6vw,72px)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: 'var(--ab-gold)' }} />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--ab-gold)', fontFamily: 'var(--ab-body)' }}>
              Personal Profile
            </span>
          </div>
          <h2 className="section-title">
            About<br />
            <em style={{ color: 'var(--ab-gold)', fontStyle: 'italic' }}>Me</em>
          </h2>
          <p className="section-sub">
            A creative developer who believes great interfaces are felt, not just seen.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-[clamp(36px,5vw,56px)]"
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="ab-stat" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div className="text-[clamp(24px,4vw,36px)] font-black leading-none mb-1.5" style={{ fontFamily: 'var(--ab-display)', color: s.color }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--ab-dim)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rule */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* Two Column Body */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.15fr] gap-[clamp(28px,4vw,56px)] items-start">
          {/* Left - Image */}
          <motion.div
            style={{ perspective: 900, rotateX: rx, rotateY: ry }}
            onMouseMove={onMove} onMouseLeave={onLeave}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div className="absolute -top-5 -left-3 text-[clamp(80px,14vw,160px)] font-black leading-none select-none pointer-events-none" style={{ fontFamily: 'var(--ab-display)', color: 'transparent', WebkitTextStroke: '1px rgba(212,175,85,0.1)' }}>
                MD
              </div>
              <div className="ab-imgframe h-[clamp(280px,40vw,440px)] bg-[#131210] relative z-10">
                <img
                  src="/images/muhire-dieudonne.jpg"
                  alt="Muhire Dieudonne"
                  className="w-full h-full object-cover block"
                />
                <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1">
                  <div className="w-8 h-0.5 rounded-sm" style={{ background: 'var(--ab-gold)' }} />
                  <div className="w-5 h-0.5 rounded-sm" style={{ background: 'var(--ab-gold)', opacity: 0.5 }} />
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-4 py-2.5 rounded-full border flex items-center gap-2"
              style={{ borderColor: 'rgba(46,204,154,0.3)', background: 'rgba(46,204,154,0.08)' }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ab-teal)' }} />
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: 'var(--ab-teal)' }}>
                Available for Work
              </span>
            </motion.div>
          </motion.div>

          {/* Right - Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2 mb-7">
              {TABS.map(t => (
                <button key={t.id} className={`ab-tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'bio' && (
                <motion.div key="bio"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}
                >
                  <div className="ab-card p-[clamp(20px,3vw,28px)] mb-5">
                    <h3 className="text-[clamp(20px,3vw,26px)] font-bold mb-3.5" style={{ fontFamily: 'var(--ab-display)', color: 'var(--ab-cream)' }}>
                      Hi, I'm <em style={{ color: 'var(--ab-gold)', fontStyle: 'italic' }}>Muhire Dieudonne</em>
                    </h3>
                    <p className="text-sm leading-relaxed mb-3.5" style={{ color: 'var(--ab-muted)' }}>
                      A passionate creative developer with 5+ years of experience building immersive web experiences. I specialise in React, Three.js, and advanced animations to craft sites that don't just look stunning — they feel alive.
                    </p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--ab-muted)' }}>
                      My journey started with curiosity for visual effects and has evolved into a career pushing the boundaries of what's possible on the web — one frame at a time.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {SKILLS.map(s => <span key={s} className="ab-badge">{s}</span>)}
                    </div>
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

              {activeTab === 'timeline' && (
                <motion.div key="timeline"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}
                >
                  <div className="ab-card p-[clamp(20px,3vw,28px)]">
                    <p className="text-[9px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: 'var(--ab-gold)' }}>
                      Career Milestones
                    </p>
                    <div className="flex flex-col">
                      {TIMELINE.map((item, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09 }}
                          className={`flex gap-4 relative ${i < TIMELINE.length - 1 ? 'pb-6' : ''}`}
                        >
                          {i < TIMELINE.length - 1 && (
                            <div className="absolute left-1 top-4.5 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, var(--ab-gold-dim), transparent)' }} />
                          )}
                          <div className="ab-tl-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                          <div>
                            <div className="text-[11px] font-bold tracking-[0.1em] mb-1" style={{ color: item.color }}>
                              {item.year}
                            </div>
                            <div className="text-sm leading-relaxed" style={{ color: 'var(--ab-muted)' }}>
                              {item.event}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'interests' && (
                <motion.div key="interests"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {INTERESTS.map((item, i) => (
                      <motion.div key={i} className="ab-interest"
                        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="text-2xl mb-2 leading-none">{item.icon}</div>
                        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'var(--ab-muted)' }}>
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

        {/* Rule */}
        <div className="rule-gold mt-[clamp(40px,5vw,64px)]" />
      </div>
    </section>
  )
}

export default About
