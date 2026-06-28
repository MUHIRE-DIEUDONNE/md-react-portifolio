// src/components/About.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion'
import {
  FiClock, FiTrendingUp, FiAward, FiActivity,
  FiCalendar, FiTarget, FiMonitor, FiBook,
  FiHeadphones, FiMapPin, FiCamera, FiDownload,
  FiArrowUpRight, FiZap, FiBriefcase
} from 'react-icons/fi'

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

  return (
    <section id="about" className="py-[clamp(60px,8vw,120px)] relative overflow-hidden" style={{ background: '#0c0b09' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] right-[-12%] w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,85,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[8%] left-[-10%] w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="container-responsive relative z-10">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[clamp(48px,6vw,72px)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: '#d4af55' }} />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: '#d4af55', fontFamily: "'Instrument Sans', system-ui" }}>
              Personal Profile
            </span>
          </div>
          <h2 className="section-title">
            About<br />
            <em style={{ color: '#d4af55', fontStyle: 'italic' }}>Me</em>
          </h2>
          <p className="section-sub">
            A creative developer who believes great interfaces are felt, not just seen.
          </p>
        </motion.div>

        {/* ── RULE ── */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-[clamp(36px,5vw,56px)]"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              className="glass-card p-5 text-center transition-all hover:-translate-y-1"
            >
              <div
                className="text-[clamp(24px,4vw,36px)] font-black leading-none mb-1.5"
                style={{ fontFamily: "'Playfair Display', serif", color: s.color }}
              >
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(245,238,216,0.3)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── RULE ── */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* ── TWO COLUMN BODY ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.15fr] gap-[clamp(28px,4vw,56px)] items-start">
          {/* LEFT — Image with tilt */}
          <motion.div
            style={{ perspective: 900, rotateX: rx, rotateY: ry }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <div
                className="absolute -top-5 -left-3 text-[clamp(80px,14vw,160px)] font-black leading-none select-none pointer-events-none"
                style={{ fontFamily: "'Playfair Display', serif", color: 'transparent', WebkitTextStroke: '1px rgba(212,175,85,0.1)' }}
              >
                MD
              </div>
              <div className="rounded-2xl overflow-hidden border border-[rgba(255,245,220,0.07)] h-[clamp(280px,40vw,440px)] bg-[#131210] relative z-10 transition-all hover:border-[rgba(212,175,85,0.35)]">
                <img
                  src="/images/muhire-dieudonne.jpg"
                  alt="Muhire Dieudonne"
                  className="w-full h-full object-cover block"
                />
                <div className="absolute bottom-5 left-5 z-20 flex flex-col gap-1">
                  <div className="w-8 h-0.5 rounded-sm" style={{ background: '#d4af55' }} />
                  <div className="w-5 h-0.5 rounded-sm" style={{ background: '#d4af55', opacity: 0.5 }} />
                </div>
              </div>
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-4 py-2.5 rounded-full border flex items-center gap-2 w-fit"
              style={{ borderColor: 'rgba(46,204,154,0.3)', background: 'rgba(46,204,154,0.08)' }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2ecc9a' }} />
              <span className="text-[11px] font-semibold tracking-[0.08em] uppercase whitespace-nowrap" style={{ color: '#2ecc9a' }}>
                Available for Work
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT — Tabs + Content */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-7">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider border transition-all ${
                    activeTab === t.id
                      ? 'bg-[#d4af55] border-[#d4af55] text-[#0c0b09] font-semibold shadow-lg shadow-[#d4af55]/35'
                      : 'border-[rgba(255,245,220,0.07)] bg-transparent text-[rgba(245,238,216,0.42)] hover:border-[rgba(212,175,85,0.35)] hover:text-[#f5eed8]'
                  }`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── BIO ── */}
              {activeTab === 'bio' && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="glass-card p-[clamp(20px,3vw,28px)] mb-5">
                    <h3
                      className="text-[clamp(20px,3vw,26px)] font-bold mb-3.5"
                      style={{ fontFamily: "'Playfair Display', serif", color: '#f5eed8' }}
                    >
                      Hi, I'm <em style={{ color: '#d4af55', fontStyle: 'italic' }}>Muhire Dieudonne</em>
                    </h3>
                    <p className="text-sm leading-relaxed mb-3.5" style={{ color: 'rgba(245,238,216,0.42)' }}>
                      A passionate creative developer with 5+ years of experience building immersive web experiences. I specialise in React, Three.js, and advanced animations to craft sites that don't just look stunning — they feel alive.
                    </p>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(245,238,216,0.42)' }}>
                      My journey started with curiosity for visual effects and has evolved into a career pushing the boundaries of what's possible on the web — one frame at a time.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {SKILLS.map(s => (
                        <span key={s} className="badge-gold">{s}</span>
                      ))}
                    </div>
                    <a href="#" className="btn-gold">
                      <FiDownload size={14} />
                      Download CV
                      <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
                        <FiArrowUpRight size={14} />
                      </motion.span>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* ── TIMELINE ── */}
              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="glass-card p-[clamp(20px,3vw,28px)]">
                    <p className="text-[9px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: '#d4af55' }}>
                      Career Milestones
                    </p>
                    <div className="flex flex-col">
                      {TIMELINE.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09 }}
                          className={`flex gap-4 relative ${i < TIMELINE.length - 1 ? 'pb-6' : ''}`}
                        >
                          {i < TIMELINE.length - 1 && (
                            <div className="absolute left-1 top-4.5 bottom-0 w-px" style={{ background: 'linear-gradient(180deg, rgba(212,175,85,0.2), transparent)' }} />
                          )}
                          <div
                            className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 border-2 border-[#0c0b09]"
                            style={{ background: item.color, boxShadow: `0 0 10px ${item.color}60` }}
                          />
                          <div>
                            <div className="text-[11px] font-bold tracking-[0.1em] mb-1" style={{ color: item.color }}>
                              {item.year}
                            </div>
                            <div className="text-sm leading-relaxed" style={{ color: 'rgba(245,238,216,0.42)' }}>
                              {item.event}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── INTERESTS ── */}
              {activeTab === 'interests' && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {INTERESTS.map((item, i) => (
                      <motion.div
                        key={i}
                        className="border border-[rgba(255,245,220,0.07)] rounded-xl p-4 text-center bg-[rgba(255,255,255,0.015)] transition-all hover:border-[rgba(212,175,85,0.35)] hover:bg-[rgba(212,175,85,0.05)] hover:-translate-y-1"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        <div className="text-2xl mb-2 leading-none">{item.icon}</div>
                        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: 'rgba(245,238,216,0.42)' }}>
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
        <div className="rule-gold mt-[clamp(40px,5vw,64px)]" />
      </div>
    </section>
  )
}

export default About
