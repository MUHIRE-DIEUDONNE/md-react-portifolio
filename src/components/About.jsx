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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --about-bg: #0c0b09;
    --about-surface: #131210;
    --about-card: rgba(22,20,16,0.95);
    --about-border: rgba(255,245,220,0.07);
    --about-border-hi: rgba(212,175,85,0.35);
    --about-gold: #d4af55;
    --about-gold-dim: rgba(212,175,85,0.18);
    --about-cream: #f5eed8;
    --about-muted: rgba(245,238,216,0.5);
    --about-dim: rgba(245,238,216,0.2);
    --about-display: 'Playfair Display', serif;
    --about-body: 'Instrument Sans', sans-serif;
  }

  .about-root *, .about-root *::before, .about-root *::after {
    box-sizing: border-box;
  }

  .about-root {
    position: relative;
    overflow: hidden;
    background: var(--about-bg);
    color: var(--about-cream);
    font-family: var(--about-body);
    padding: clamp(80px, 10vw, 160px) 0;
  }

  .about-root::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .about-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 60px);
    position: relative;
    z-index: 1;
  }

  .about-stat {
    padding: 20px;
    min-width: 140px;
    border-radius: 18px;
    border: 1px solid var(--about-border);
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(20px);
    transition: 0.3s ease;
    text-align: center;
  }
  .about-stat:hover {
    border-color: var(--about-border-hi);
    background: rgba(212,175,85,0.04);
    transform: translateY(-4px);
  }

  .about-card {
    border: 1px solid var(--about-border);
    background: var(--about-card);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    position: relative;
    overflow: hidden;
  }
  .about-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--about-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .about-card:hover {
    border-color: var(--about-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
  .about-card:hover::before { opacity: 1; }

  .about-tab {
    padding: 8px 22px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid var(--about-border);
    background: transparent;
    color: var(--about-muted);
    font-family: var(--about-body);
    transition: all 0.22s ease;
    white-space: nowrap;
  }
  .about-tab:hover {
    border-color: var(--about-border-hi);
    color: var(--about-cream);
  }
  .about-tab.active {
    background: var(--about-gold);
    border-color: var(--about-gold);
    color: #0c0b09;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }

  .about-badge {
    padding: 4px 14px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1px solid var(--about-border-hi);
    background: var(--about-gold-dim);
    color: var(--about-gold);
    font-family: var(--about-body);
    transition: transform 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .about-badge:hover {
    transform: scale(1.05);
    background: rgba(212,175,85,0.25);
  }

  .about-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 32px;
    border-radius: 999px;
    border: none;
    background: var(--about-gold);
    color: #0c0b09;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: 0.3s ease;
    box-shadow: 0 10px 40px rgba(212,175,85,0.35);
    min-height: 48px;
    min-width: 140px;
    white-space: nowrap;
    text-decoration: none;
    font-family: var(--about-body);
  }
  .about-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 40px rgba(212,175,85,0.45);
    background: #e0be6a;
  }

  .about-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 30px;
    border-radius: 999px;
    background: transparent;
    border: 1px solid var(--about-border);
    color: var(--about-muted);
    cursor: pointer;
    transition: 0.3s ease;
    min-height: 48px;
    min-width: 120px;
    white-space: nowrap;
    text-decoration: none;
    font-family: var(--about-body);
  }
  .about-btn-ghost:hover {
    border-color: var(--about-border-hi);
    color: var(--about-cream);
  }

  .about-interest {
    border: 1px solid var(--about-border);
    border-radius: 16px;
    padding: 16px 12px;
    text-align: center;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(20px);
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
    cursor: default;
  }
  .about-interest:hover {
    border-color: var(--about-border-hi);
    background: rgba(212,175,85,0.04);
    transform: translateY(-3px);
  }

  .about-tl-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--about-gold); flex-shrink: 0;
    box-shadow: 0 0 12px rgba(212,175,85,0.5);
    border: 2px solid var(--about-bg);
    margin-top: 5px;
  }

  .about-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--about-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  .about-imgframe {
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid var(--about-border);
    position: relative;
    transition: border-color 0.3s;
  }
  .about-imgframe:hover {
    border-color: var(--about-border-hi);
  }
  .about-imgframe::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(12,11,9,0.85) 100%);
    pointer-events: none;
  }

  .about-glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    mix-blend-mode: screen;
  }

  @media (max-width: 640px) {
    .about-tab { padding: 7px 14px; }
  }
`

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

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-120, 120], [10, -10]), { damping: 30 })
  const ry = useSpring(useTransform(mx, [-120, 120], [-10, 10]), { damping: 30 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - (r.left + r.width / 2))
    my.set(e.clientY - (r.top + r.height / 2))
  }
  const onLeave = () => { mx.set(0); my.set(0) }

  const STATS = [
    { value: 5, suffix: '+', label: 'Years Active', color: '#d4af55' },
    { value: 50, suffix: '+', label: 'Projects Shipped', color: '#2ecc9a' },
    { value: 30, suffix: '+', label: 'Happy Clients', color: '#e07070' },
    { value: 15, suffix: '+', label: 'Awards Won', color: '#7ec8e3' },
  ]

  const TIMELINE = [
    { year: '2023', event: 'Lead Frontend Developer at Creative Agency', color: '#d4af55' },
    { year: '2021', event: 'Senior Frontend Developer — Tech Startup', color: '#2ecc9a' },
    { year: '2019', event: 'Full-Stack Developer — Digital Studio', color: '#e07070' },
    { year: '2017', event: 'Started the Coding Journey', color: '#7ec8e3' },
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
    { id: 'bio', label: 'Bio' },
    { id: 'timeline', label: 'Timeline' },
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
        i += 1
        setDisplay(i)
        if (i >= value) clearInterval(t)
      }, step)
      return () => clearInterval(t)
    }, [inView, value])
    return <span ref={ref}>{inView ? display : 0}{suffix}</span>
  }

  const lightModeStyles = `
    html.light-mode .about-root {
      --about-bg: #ffffff;
      --about-surface: #f8fafc;
      --about-card: rgba(255, 255, 255, 0.95);
      --about-border: rgba(0, 0, 0, 0.1);
      --about-border-hi: rgba(99, 102, 241, 0.3);
      --about-gold: #6366f1;
      --about-gold-dim: rgba(99, 102, 241, 0.1);
      --about-cream: #0f172a;
      --about-muted: rgba(15, 23, 42, 0.5);
      --about-dim: rgba(15, 23, 42, 0.2);
    }
    html.light-mode .about-root::before {
      opacity: 0.1;
    }
  `

  return (
    <section className="about-root">
      <style>{STYLES}{lightModeStyles}</style>

      <div className="about-glow-orb" style={{
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(212,175,85,0.08), transparent)',
        top: '-20%', left: '-10%',
        zIndex: 0,
      }} />
      <div className="about-glow-orb" style={{
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(46,204,154,0.05), transparent)',
        bottom: '-10%', right: '-10%',
        zIndex: 0,
      }} />

      <div className="about-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px, 6vw, 72px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'var(--about-gold)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--about-gold)', fontFamily: 'var(--about-body)' }}>
              Personal Profile
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--about-display)',
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 900,
            lineHeight: 1.02,
            color: 'var(--about-cream)',
            letterSpacing: '-0.02em',
            marginBottom: 18,
          }}>
            About<br />
            <em style={{ color: 'var(--about-gold)', fontStyle: 'italic' }}>Me</em>
          </h2>
          <p style={{
            fontSize: 15,
            color: 'var(--about-muted)',
            maxWidth: 480,
            lineHeight: 1.7,
          }}>
            A creative developer who believes great interfaces are felt, not just seen.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: 12,
            marginBottom: 'clamp(36px, 5vw, 56px)',
          }}
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="about-stat" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div style={{
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 900,
                fontFamily: 'var(--about-display)',
                color: s.color,
                lineHeight: 1,
                marginBottom: 6,
              }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--about-dim)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rule */}
        <div className="about-rule" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }} />

        {/* Two Column Body */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)',
          gap: 'clamp(28px, 4vw, 56px)',
          alignItems: 'start',
        }}>
          {/* Left – Image */}
          <motion.div
            style={{ perspective: 900, rotateX: rx, rotateY: ry }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{
                fontFamily: 'var(--about-display)',
                fontSize: 'clamp(80px, 14vw, 160px)',
                fontWeight: 900,
                lineHeight: 1,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(212,175,85,0.1)',
                userSelect: 'none',
                pointerEvents: 'none',
                position: 'absolute',
                top: -20,
                left: -12,
                zIndex: 0,
              }}>
                MD
              </div>
              <div className="about-imgframe" style={{
                height: 'clamp(280px, 40vw, 440px)',
                background: '#131210',
                position: 'relative',
                zIndex: 1,
              }}>
                <img
                  src="/images/muhire-dieudonne.jpg"
                  alt="Muhire Dieudonne"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                  <div style={{ width: 32, height: 2, background: 'var(--about-gold)', borderRadius: 1 }} />
                  <div style={{ width: 20, height: 2, background: 'var(--about-gold)', opacity: 0.5, borderRadius: 1 }} />
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 16,
                padding: '10px 18px',
                borderRadius: 999,
                border: '1px solid rgba(46,204,154,0.3)',
                background: 'rgba(46,204,154,0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#2ecc9a',
                animation: 'about-blink 1.6s ease-in-out infinite',
              }} />
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#2ecc9a',
              }}>
                Available for Work
              </span>
            </motion.div>
          </motion.div>

          {/* Right – Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`about-tab ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'bio' && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="about-card" style={{ padding: 28, marginBottom: 20 }}>
                    <h3 style={{
                      fontFamily: 'var(--about-display)',
                      fontSize: 'clamp(20px, 3vw, 26px)',
                      fontWeight: 700,
                      color: 'var(--about-cream)',
                      marginBottom: 14,
                    }}>
                      Hi, I'm <em style={{ color: 'var(--about-gold)', fontStyle: 'italic' }}>Muhire Dieudonne</em>
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--about-muted)',
                      lineHeight: 1.8,
                      marginBottom: 14,
                    }}>
                      A passionate creative developer with 5+ years of experience building immersive web experiences. I specialise in React, Three.js, and advanced animations to craft sites that don't just look stunning — they feel alive.
                    </p>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--about-muted)',
                      lineHeight: 1.8,
                      marginBottom: 22,
                    }}>
                      My journey started with curiosity for visual effects and has evolved into a career pushing the boundaries of what's possible on the web — one frame at a time.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                      {SKILLS.map(s => <span key={s} className="about-badge">{s}</span>)}
                    </div>
                    <a href="#" className="about-btn-primary">
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
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="about-card" style={{ padding: 28 }}>
                    <p style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--about-gold)',
                      marginBottom: 20,
                    }}>
                      Career Milestones
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                      {TIMELINE.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09 }}
                          style={{
                            display: 'flex',
                            gap: 16,
                            paddingBottom: i < TIMELINE.length - 1 ? 24 : 0,
                            position: 'relative',
                          }}
                        >
                          {i < TIMELINE.length - 1 && (
                            <div style={{
                              position: 'absolute',
                              left: 4,
                              top: 18,
                              bottom: 0,
                              width: 1,
                              background: 'linear-gradient(180deg, var(--about-gold-dim), transparent)',
                            }} />
                          )}
                          <div className="about-tl-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}60` }} />
                          <div>
                            <div style={{
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              color: item.color,
                              marginBottom: 4,
                            }}>
                              {item.year}
                            </div>
                            <div style={{
                              fontSize: 13,
                              color: 'var(--about-muted)',
                              lineHeight: 1.6,
                            }}>
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
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 10,
                  }}>
                    {INTERESTS.map((item, i) => (
                      <motion.div
                        key={i}
                        className="about-interest"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div style={{ fontSize: 24, marginBottom: 8, lineHeight: 1 }}>{item.icon}</div>
                        <div style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'var(--about-muted)',
                        }}>
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

        <div className="about-rule" style={{ margin: 'clamp(40px, 5vw, 64px) 0 0' }} />
      </div>

      <style>{`
        @keyframes about-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </section>
  )
}

export default About
