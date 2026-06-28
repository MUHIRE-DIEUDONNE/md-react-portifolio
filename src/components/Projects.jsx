// src/components/Projects.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiMonitor, FiZap, FiExternalLink, FiGithub } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES (mirrors About.jsx)
───────────────────────────────────────────── */
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --pj-bg: #0c0b09;
    --pj-surface: #131210;
    --pj-card: rgba(22, 20, 16, 0.95);
    --pj-border: rgba(255,245,220,0.07);
    --pj-border-hi: rgba(212,175,85,0.35);
    --pj-gold: #d4af55;
    --pj-gold-dim: rgba(212,175,85,0.18);
    --pj-cream: #f5eed8;
    --pj-muted: rgba(245,238,216,0.42);
    --pj-dim: rgba(245,238,216,0.18);
    --pj-display: 'Playfair Display', Georgia, serif;
    --pj-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .pj-root *, .pj-root *::before, .pj-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .pj-root {
    font-family: var(--pj-body);
    background: var(--pj-bg);
    color: var(--pj-cream);
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }

  .pj-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .pj-root ::-webkit-scrollbar { width: 3px; }
  .pj-root ::-webkit-scrollbar-track { background: transparent; }
  .pj-root ::-webkit-scrollbar-thumb { background: var(--pj-border-hi); border-radius: 4px; }

  /* Filter pill — matches ab-tab */
  .pj-pill {
    padding: 8px 22px; border-radius: 100px; font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--pj-border);
    background: transparent;
    color: var(--pj-muted); font-family: var(--pj-body);
    transition: all 0.22s ease;
  }
  .pj-pill:hover { border-color: var(--pj-border-hi); color: var(--pj-cream); }
  .pj-pill.active {
    background: var(--pj-gold); border-color: var(--pj-gold);
    color: #0c0b09; font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }

  /* Card — matches ab-card */
  .pj-card {
    border: 1px solid var(--pj-border);
    background: var(--pj-card);
    border-radius: 16px;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    position: relative; overflow: hidden;
  }
  .pj-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--pj-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .pj-card:hover {
    border-color: var(--pj-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
  .pj-card:hover::before { opacity: 1; }

  /* Badge — matches ab-badge */
  .pj-badge {
    padding: 4px 14px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid var(--pj-border-hi);
    background: var(--pj-gold-dim); color: var(--pj-gold);
    font-family: var(--pj-body);
    transition: transform 0.15s, background 0.15s;
  }
  .pj-badge:hover { transform: scale(1.05); background: rgba(212,175,85,0.25); }

  /* Section rule */
  .pj-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--pj-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }
`

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [screenshotIndex, setScreenshotIndex] = useState(0)

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

  const projects = [
    {
      id: 1,
      title: 'Snake Game',
      category: 'game',
      categoryLabel: 'Game Dev',
      image: 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      video: null,
      description: 'Classic snake game with smooth controls and retro design.',
      longDescription: 'A fully functional Snake game built with JavaScript. Features smooth keyboard controls, score tracking, increasing difficulty, and a retro pixel art style.',
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API'],
      color: '#10b981',
      duration: '1 week',
      client: 'Personal Project',
      features: ['Smooth Controls', 'Score Tracking', 'Difficulty Progression', 'Retro Design'],
      screenshots: [
        'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/3945650/close-up-of-video-game-console-3945650.jpg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
      ],
      github: 'https://github.com/muhire-dieudonne/snake_game',
      live: 'https://muhire-dieudonne.github.io/snake_game/',
      logo: '🎮'
    },
    {
      id: 2,
      title: 'Jump Game in Vue',
      category: 'game',
      categoryLabel: 'Game Dev',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      video: null,
      description: 'Endless runner jumping game built with Vue.js.',
      longDescription: 'An exciting endless runner game where you control a character jumping over obstacles. Built with Vue.js featuring smooth animations, score system, and progressively increasing difficulty.',
      technologies: ['Vue.js', 'JavaScript', 'CSS3', 'HTML5'],
      color: '#42b883',
      duration: '2 weeks',
      client: 'Personal Project',
      features: ['Endless Runner', 'Progressive Difficulty', 'Score System', 'Smooth Animations'],
      screenshots: [
        'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
      ],
      github: 'https://github.com/muhire-dieudonne/jump_game_in_vue',
      live: 'https://muhire-dieudonne.github.io/jump_game_in_vue/',
      logo: '⚡'
    },
    {
      id: 3,
      title: 'Language Translator',
      category: 'webapp',
      categoryLabel: 'Web App',
      image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      video: null,
      description: 'Real-time language translation tool supporting multiple languages.',
      longDescription: 'A powerful language translator that supports over 100 languages. Features real-time translation, text-to-speech, and a clean intuitive interface.',
      technologies: ['JavaScript', 'API Integration', 'HTML5', 'CSS3'],
      color: '#8b5cf6',
      duration: '1 week',
      client: 'Personal Project',
      features: ['100+ Languages', 'Real-time Translation', 'Text-to-Speech', 'Copy to Clipboard'],
      screenshots: [
        'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
      ],
      github: 'https://github.com/muhire-dieudonne/language_translator',
      live: 'https://muhire-dieudonne.github.io/language_translator/',
      logo: '🌐'
    },
    {
      id: 4,
      title: 'Money Converter',
      category: 'webapp',
      categoryLabel: 'Web App',
      image: 'https://images.pexels.com/photos/4386425/pexels-photo-4386425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      video: null,
      description: 'Currency converter with real-time exchange rates.',
      longDescription: 'A real-time currency converter that fetches live exchange rates. Supports over 150 currencies with a clean, user-friendly interface and historical rate charts.',
      technologies: ['JavaScript', 'API Integration', 'Chart.js', 'Responsive Design'],
      color: '#f59e0b',
      duration: '1 week',
      client: 'Personal Project',
      features: ['Live Exchange Rates', '150+ Currencies', 'Historical Charts', 'Amount Formatting'],
      screenshots: [
        'https://images.pexels.com/photos/4386425/pexels-photo-4386425.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/4386427/pexels-photo-4386427.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/4386428/pexels-photo-4386428.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
      ],
      github: 'https://github.com/muhire-dieudonne/money_converter',
      live: 'https://muhire-dieudonne.github.io/money_converter/',
      logo: '💱'
    },
    {
      id: 5,
      title: '3D Interactive Portfolio',
      category: 'threejs',
      categoryLabel: 'Three.js',
      image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-3d-animation-of-moving-shapes-44486-large.mp4',
      description: 'Immersive 3D portfolio with interactive elements and particle systems.',
      longDescription: 'A cutting-edge 3D portfolio featuring interactive 3D models, particle systems, and smooth animations. Built with React Three Fiber and Framer Motion.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'WebGL'],
      color: '#6366f1',
      duration: '2 months',
      client: 'Personal Portfolio',
      features: ['3D Models', 'Particle Systems', 'Interactive Animations', 'Responsive Design'],
      screenshots: [
        'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/777002/pexels-photo-777002.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
      ],
      github: 'https://github.com/muhire-dieudonne/3d-portfolio',
      live: 'https://muhire-dieudonne.github.io/portfolio/',
      logo: '🎯'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'game', label: 'Games' },
    { id: 'webapp', label: 'Web Apps' },
    { id: 'threejs', label: 'Three.js' }
  ]

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter)

  const lightModeStyles = `
    html.light-mode .pj-root {
      --pj-bg: #ffffff;
      --pj-surface: #f8fafc;
      --pj-card: rgba(255, 255, 255, 0.95);
      --pj-border: rgba(0, 0, 0, 0.1);
      --pj-border-hi: rgba(99, 102, 241, 0.3);
      --pj-gold: #6366f1;
      --pj-gold-dim: rgba(99, 102, 241, 0.1);
      --pj-cream: #0f172a;
      --pj-muted: rgba(15, 23, 42, 0.7);
      --pj-dim: rgba(15, 23, 42, 0.5);
    }
  `

  return (
    <section id="projects" className="pj-root" style={{ padding: 'clamp(60px,8vw,120px) 0' }}>
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>

      {/* Ambient blobs */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '-12%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(212,175,85,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '8%', right: '-10%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(20px,5vw,48px)', position: 'relative', zIndex: 1 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px,6vw,72px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'var(--pj-gold)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--pj-gold)', fontFamily: 'var(--pj-body)' }}>
              Portfolio
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--pj-display)', fontSize: 'clamp(38px,7vw,72px)', fontWeight: 900, lineHeight: 1.02, color: 'var(--pj-cream)', letterSpacing: '-0.02em', marginBottom: 18 }}>
            Featured<br />
            <em style={{ color: 'var(--pj-gold)', fontStyle: 'italic' }}>Projects</em>
          </h2>
          <p style={{ fontSize: 15, color: 'var(--pj-muted)', maxWidth: 480, lineHeight: 1.7 }}>
            A selection of my best work — where creativity meets technical excellence.
          </p>
        </motion.div>

        {/* ── RULE ── */}
        <div className="pj-rule" style={{ marginBottom: 'clamp(28px,4vw,40px)' }} />

        {/* ── FILTERS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', gap: 8, marginBottom: 'clamp(28px,4vw,44px)', flexWrap: 'wrap' }}
        >
          {filters.map(f => (
            <button key={f.id} className={`pj-pill ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── PROJECTS GRID ── */}
        <motion.div
          key={filter}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 }
            }
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: 'clamp(20px,3vw,32px)',
          }}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="pj-card"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedProject(project)
                setScreenshotIndex(0)
              }}
            >
              <div style={{ position: 'relative', height: 'clamp(200px,30vw,260px)', overflow: 'hidden' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                  }}
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: '60%',
                  background: 'linear-gradient(180deg, transparent, rgba(12,11,9,0.85))',
                  pointerEvents: 'none',
                }} />
                {/* Category badge */}
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  padding: '4px 12px',
                  borderRadius: 100,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  background: 'rgba(12,11,9,0.7)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid var(--pj-border-hi)',
                  color: 'var(--pj-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ fontSize: 14 }}>{project.logo}</span>
                  {project.categoryLabel}
                </div>
                {/* Content overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '20px 20px 18px',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--pj-display)',
                    fontSize: 'clamp(18px,2.4vw,22px)',
                    fontWeight: 700,
                    color: 'var(--pj-cream)',
                    marginBottom: 4,
                  }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--pj-muted)', lineHeight: 1.6, marginBottom: 10 }}>
                    {project.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="pj-badge" style={{ fontSize: 8, padding: '2px 10px' }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="pj-badge" style={{ fontSize: 8, padding: '2px 10px' }}>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── RULE ── */}
        <div className="pj-rule" style={{ margin: 'clamp(40px,5vw,64px) 0 0' }} />
      </div>

      {/* ── PROJECT MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 'clamp(16px,4vw,40px)',
              background: 'rgba(12,11,9,0.92)',
              backdropFilter: 'blur(16px)',
              overflowY: 'auto',
            }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth: 720, width: '100%',
                background: 'var(--pj-card)',
                borderRadius: 20,
                border: '1px solid var(--pj-border)',
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Carousel */}
              <div style={{ position: 'relative', height: 'clamp(220px,40vw,360px)', background: '#0c0b09', flexShrink: 0 }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={screenshotIndex}
                    src={selectedProject.screenshots[screenshotIndex]}
                    alt={`Screenshot ${screenshotIndex + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                    }}
                  />
                </AnimatePresence>

                {/* Carousel controls */}
                {selectedProject.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setScreenshotIndex(prev => prev === 0 ? selectedProject.screenshots.length - 1 : prev - 1)
                      }}
                      style={{
                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(12,11,9,0.7)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid var(--pj-border)',
                        color: 'var(--pj-cream)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,85,0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(12,11,9,0.7)'}
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setScreenshotIndex(prev => prev === selectedProject.screenshots.length - 1 ? 0 : prev + 1)
                      }}
                      style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        width: 40, height: 40, borderRadius: '50%',
                        background: 'rgba(12,11,9,0.7)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid var(--pj-border)',
                        color: 'var(--pj-cream)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,85,0.3)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(12,11,9,0.7)'}
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Dots */}
                {selectedProject.screenshots.length > 1 && (
                  <div style={{
                    position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: 6,
                  }}>
                    {selectedProject.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setScreenshotIndex(i) }}
                        style={{
                          width: i === screenshotIndex ? 24 : 6,
                          height: 6,
                          borderRadius: 4,
                          border: 'none',
                          background: i === screenshotIndex ? 'var(--pj-gold)' : 'rgba(245,238,216,0.3)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    position: 'absolute', top: 14, right: 14,
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(12,11,9,0.7)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid var(--pj-border)',
                    color: 'var(--pj-cream)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,175,85,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(12,11,9,0.7)'}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: 'clamp(20px,4vw,32px)', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <h3 style={{
                    fontFamily: 'var(--pj-display)',
                    fontSize: 'clamp(22px,3vw,28px)',
                    fontWeight: 700,
                    color: 'var(--pj-cream)',
                  }}>
                    {selectedProject.title}
                  </h3>
                  <span style={{
                    padding: '4px 14px',
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    background: `${selectedProject.color}20`,
                    color: selectedProject.color,
                    border: `1px solid ${selectedProject.color}50`,
                  }}>
                    {selectedProject.categoryLabel}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--pj-muted)', lineHeight: 1.8, marginBottom: 16 }}>
                  {selectedProject.longDescription}
                </p>

                {/* Features */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--pj-gold)', marginBottom: 8 }}>
                    Key Features
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedProject.features.map((feature, i) => (
                      <span key={i} style={{
                        padding: '3px 12px',
                        borderRadius: 100,
                        fontSize: 10,
                        fontWeight: 500,
                        background: 'rgba(212,175,85,0.08)',
                        border: '1px solid var(--pj-border)',
                        color: 'var(--pj-muted)',
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--pj-gold)', marginBottom: 8 }}>
                    Technologies
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {selectedProject.technologies.map((tech, i) => (
                      <span key={i} className="pj-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 24px',
                      borderRadius: 100,
                      border: 'none',
                      background: 'var(--pj-gold)',
                      color: '#0c0b09',
                      fontFamily: 'var(--pj-body)',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 8px 32px rgba(212,175,85,0.3)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(212,175,85,0.45)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(212,175,85,0.3)' }}
                  >
                    <FiExternalLink size={14} />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 24px',
                      borderRadius: 100,
                      border: '1px solid var(--pj-border)',
                      background: 'transparent',
                      color: 'var(--pj-cream)',
                      fontFamily: 'var(--pj-body)',
                      fontSize: 12,
                      fontWeight: 500,
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--pj-gold)'; e.currentTarget.style.background = 'rgba(212,175,85,0.05)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--pj-border)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <FiGithub size={14} />
                    Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
