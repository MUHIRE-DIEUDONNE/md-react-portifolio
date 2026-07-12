// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useMagneticEffect } from '../hooks/useMagneticEffect'
import { FiHome, FiUser, FiZap, FiBriefcase, FiTrendingUp, FiMail, FiSun, FiMoon, FiX } from 'react-icons/fi'
import profilePhoto from '../images/Muhire_dieudonne.JPG'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES
───────────────────────────────────────────── */
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --nv-bg: #0c0b09;
    --nv-surface: #131210;
    --nv-card: rgba(22, 20, 16, 0.95);
    --nv-border: rgba(255,245,220,0.07);
    --nv-border-hi: rgba(212,175,85,0.35);
    --nv-gold: #d4af55;
    --nv-gold-dim: rgba(212,175,85,0.18);
    --nv-cream: #f5eed8;
    --nv-muted: rgba(245,238,216,0.42);
    --nv-dim: rgba(245,238,216,0.18);
    --nv-display: 'Playfair Display', Georgia, serif;
    --nv-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .nv-root *, .nv-root *::before, .nv-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .nv-root {
    font-family: var(--nv-body);
    background: var(--nv-bg);
    color: var(--nv-cream);
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }

  .nv-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .nv-root ::-webkit-scrollbar { width: 3px; }
  .nv-root ::-webkit-scrollbar-track { background: transparent; }
  .nv-root ::-webkit-scrollbar-thumb { background: var(--nv-border-hi); border-radius: 4px; }
`

// ─── 3D Floating Elements ──────────────────────────────────────────────
const Floating3DElement = ({ delay, duration, size = 20, color = '#6366f1', style: extraStyle }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: 0 }}
    animate={{ opacity: [0, 1, 0.8, 1], rotateY: [0, 180, 360], scale: [1, 1.2, 1] }}
    transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, transparent)`,
      transformStyle: 'preserve-3d',
      boxShadow: `0 0 20px ${color}40`,
      ...extraStyle,
    }}
  />
)

// ─── 3D Card Component ───────────────────────────────────────────────
const Card3D = ({ children, className = '', delay = 0, disableMobile3D = false, ...rest }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: -15, y: 30 }}
    animate={{ opacity: 1, rotateX: 0, y: 0 }}
    whileHover={!disableMobile3D ? { rotateX: 15, scale: 1.05 } : {}}
    transition={{ delay, duration: 0.6, type: 'spring', stiffness: 100 }}
    className={`relative ${className}`}
    style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    {...rest}
  >
    <div style={disableMobile3D ? {} : { transform: 'translateZ(30px)', backfaceVisibility: 'hidden' }}>
      {children}
    </div>
  </motion.div>
)

// ─── Sound hook ───────────────────────────────────────────────────────
const useSound = (enabled) => {
  const clickSound = useRef(null)
  const hoverSound = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      clickSound.current = new Audio('/sounds/click.mp3')
      hoverSound.current = new Audio('/sounds/hover.mp3')
      if (clickSound.current) clickSound.current.volume = 0.3
      if (hoverSound.current) hoverSound.current.volume = 0.2
    }
    return () => {
      clickSound.current?.pause()
      hoverSound.current?.pause()
    }
  }, [])

  const playClick = () => {
    if (enabled && clickSound.current) {
      clickSound.current.currentTime = 0
      clickSound.current.play().catch(() => {})
    }
  }
  const playHover = () => {
    if (enabled && hoverSound.current) {
      hoverSound.current.currentTime = 0
      hoverSound.current.play().catch(() => {})
    }
  }

  return { playClick, playHover }
}

// ─── Navbar ───────────────────────────────────────────────────────────
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [compact, setCompact] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, activeIndex: -1 })
  const [isDarkMode, setIsDarkMode] = useState(true)

  const magneticLogo = useMagneticEffect()
  const magneticTheme = useMagneticEffect()

  const navRef = useRef(null)
  const topBarRef = useRef(null) // measures only the fixed-height top row (logo/links/hamburger), excluding the collapsible mobile menu
  const linkRefs = useRef([])
  const { playClick, playHover } = useSound(false)

  const { scrollYProgress } = useScroll()
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, 10])

  const navItems = [
    { id: 'home', label: 'Home', icon: <FiHome /> },
    { id: 'about', label: 'About', icon: <FiUser /> },
    { id: 'skills', label: 'Skills', icon: <FiZap /> },
    { id: 'projects', label: 'Projects', icon: <FiBriefcase /> },
    { id: 'experience', label: 'Experience', icon: <FiTrendingUp /> },
    { id: 'contact', label: 'Contact', icon: <FiMail /> },
  ]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    const isDark = saved === 'dark'
    setIsDarkMode(isDark)
    applyTheme(isDark)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollPercent(height > 0 ? (winScroll / height) * 100 : 0)
      setIsVisible(!(currentScrollY > lastScrollY && currentScrollY > 100))
      setLastScrollY(currentScrollY)
      setScrolled(currentScrollY > 50)
      setCompact(currentScrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { root: null, rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 💡 ENHANCED SCROLL ENGINE FOR MOBILE ACCURACY
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // FIX: use topBarRef (fixed-height row) instead of navRef (whole nav).
      // navRef includes the expanded mobile menu grid while it's open, which
      // inflates offsetHeight and pushes offsetPosition negative — the browser
      // then clamps the scroll to 0, making taps look like they do nothing.
      const navHeight = topBarRef.current?.offsetHeight || 80

      // Calculate real absolute coordinates, ignoring parent offsets or overlay height drops
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - navHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })

      // Gracefully close layout wrappers
      setIsOpen(false)
      window.dispatchEvent(new CustomEvent('nav-menu-toggle', { detail: false }))
      playClick()
    }
  }

  const handleLinkMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top, activeIndex: index })
    playHover()
  }
  const handleLinkMouseLeave = () => setMousePos({ x: 0, y: 0, activeIndex: -1 })

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('dark-mode', isDark)
    document.documentElement.classList.toggle('light-mode', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setIsDarkMode((prev) => { applyTheme(!prev); playClick(); return !prev })
  }

  const handleHamburgerClick = () => {
    setIsOpen((prev) => {
      const next = !prev
      window.dispatchEvent(new CustomEvent('nav-menu-toggle', { detail: next }))
      return next
    })
    playClick()
  }

  const showUnderline = mousePos.activeIndex !== -1 && windowWidth >= 1024

  const lightModeStyles = `
    html.light-mode .nv-root {
      --nv-bg: #ffffff; --nv-surface: #f8fafc; --nv-card: rgba(255,255,255,0.95);
      --nv-border: rgba(0,0,0,0.1); --nv-border-hi: rgba(99,102,241,0.3);
      --nv-gold: #6366f1; --nv-gold-dim: rgba(99,102,241,0.1);
      --nv-cream: #0f172a; --nv-muted: rgba(15,23,42,0.7); --nv-dim: rgba(15,23,42,0.5);
    }
  `

  return (
    <>
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>

      {/* 3D Floating Elements */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <Floating3DElement delay={0}  duration={8}  size={15} color="#6366f1" style={{ top: '10%', left: '5%' }} />
          <Floating3DElement delay={1}  duration={10} size={20} color="#8b5cf6" style={{ top: '20%', right: '10%' }} />
          <Floating3DElement delay={2}  duration={12} size={12} color="#ec4899" style={{ bottom: '30%', left: '15%' }} />
          <Floating3DElement delay={3}  duration={9}  size={18} color="#10b981" style={{ top: '50%', right: '20%' }} />
          <Floating3DElement delay={4}  duration={11} size={14} color="#f59e0b" style={{ bottom: '10%', right: '30%' }} />
        </div>
      )}

      {/* Main Navbar */}
      <motion.nav
        ref={navRef}
        style={{ opacity: navOpacity, backdropFilter: `blur(${navBlur}px)` }}
        initial={{ y: -100 }}
        animate={{
          y: isVisible ? 0 : -100,
          backgroundColor: scrolled
            ? isDarkMode ? 'rgba(15,23,42,0.8)' : 'rgba(255,255,255,0.8)'
            : 'transparent',
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, type: 'spring', stiffness: 100 }}
        className="fixed w-full z-40 transition-all duration-300 shadow-lg shadow-primary/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={topBarRef} className="flex justify-between items-center py-3 sm:py-4">

            {/* ── Logo ── */}
            <Card3D delay={0.2} className="cursor-pointer" onClick={() => scrollToSection('home')} onMouseEnter={playHover}>
              <motion.div
                ref={magneticLogo}
                whileHover={!prefersReducedMotion ? { scale: 1.05, rotateZ: 5 } : {}}
                whileTap={{ scale: 0.95, rotateZ: -5 }}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden"
                style={{ transformStyle: 'preserve-3d', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}
              >
                <motion.img
                  src={profilePhoto}
                  alt="Muhire Dieudonne"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  style={{ transform: 'translateZ(10px)' }}
                />
              </motion.div>
            </Card3D>

            {/* ── Desktop Menu ── */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item, index) => (
                <div key={item.id} className="relative">
                  <Card3D delay={0.3 + index * 0.1} className="cursor-pointer">
                    <motion.button
                      ref={(el) => (linkRefs.current[index] = el)}
                      onClick={() => scrollToSection(item.id)}
                      onMouseMove={(e) => handleLinkMouseMove(e, index)}
                      onMouseLeave={handleLinkMouseLeave}
                      className={`relative px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium uppercase tracking-wider rounded-lg group transition-colors ${
                        activeSection === item.id ? 'text-primary' : 'text-light/70 hover:text-light'
                      }`}
                      whileHover={!prefersReducedMotion ? { scale: 1.05, rotateX: 10, rotateY: 5, translateZ: 20 } : {}}
                      whileTap={{ scale: 0.95, rotateX: -5 }}
                      style={{ transformStyle: 'preserve-3d', transform: 'translateZ(10px)' }}
                    >
                      <span className="relative z-10 flex items-center gap-1 lg:gap-2" style={{ transform: 'translateZ(15px)' }}>
                        <motion.span className="text-base lg:text-lg" whileHover={{ rotateZ: 360 }} transition={{ duration: 0.6 }}>
                          {item.icon}
                        </motion.span>
                        <span className="hidden lg:inline">{item.label}</span>
                      </span>
                      {activeSection === item.id && (
                        <motion.div
                          layoutId="activeSection"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ transform: 'translateZ(-5px)' }}
                        />
                      )}
                      <motion.div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'translateZ(-10px)' }} />
                    </motion.button>
                  </Card3D>

                  {showUnderline && mousePos.activeIndex === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                      initial={{ x: 0, width: 0 }}
                      animate={{ x: mousePos.x - 20, width: 40 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              ))}

              {/* Theme toggle */}
              <Card3D delay={1.0}>
                <motion.button
                  ref={magneticTheme}
                  onClick={toggleTheme}
                  onMouseEnter={playHover}
                  className="ml-2 p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                  aria-label="Toggle theme"
                  whileHover={{ scale: 1.1, rotateZ: -15, translateZ: 10 }}
                  whileTap={{ scale: 0.9, rotateZ: 15 }}
                  style={{ transformStyle: 'preserve-3d', boxShadow: '0 4px 15px rgba(139,92,246,0.3)' }}
                >
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.6 }} style={{ transform: 'translateZ(5px)', display: 'flex' }}>
                    {isDarkMode ? <FiMoon className="w-4 h-4 lg:w-5 lg:h-5 text-light" /> : <FiSun className="w-4 h-4 lg:w-5 lg:h-5 text-light" />}
                  </motion.span>
                </motion.button>
              </Card3D>
            </div>

            {/* ── Mobile UI Controls ── */}
            <div className="flex items-center gap-2 md:hidden">
              {/* Theme */}
              <Card3D delay={1.0}>
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 bg-primary/10 rounded-full"
                  aria-label="Toggle theme"
                  whileHover={{ scale: 1.1, rotateZ: -15 }} whileTap={{ scale: 0.9 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span style={{ display: 'flex' }}>
                    {isDarkMode ? <FiMoon className="w-4 h-4 text-light" /> : <FiSun className="w-4 h-4 text-light" />}
                  </span>
                </motion.button>
              </Card3D>

              {/* Hamburger Toggle */}
              <motion.button
                onClick={handleHamburgerClick}
                onMouseEnter={playHover}
                aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
                aria-expanded={isOpen}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isOpen ? 'rgba(212,175,85,0.18)' : 'rgba(255,255,255,0.06)',
                  boxShadow: isOpen ? '0 0 0 1.5px rgba(212,175,85,0.5), 0 4px 16px rgba(212,175,85,0.2)' : '0 0 0 1px rgba(255,255,255,0.1)',
                  transition: 'background 0.25s, box-shadow 0.25s',
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex' }}
                    >
                      <FiX size={20} color="#d4af55" strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                    >
                      <span style={{ display: 'block', width: 20, height: 3, borderRadius: 4, background: '#f5eed8' }} />
                      <span style={{ display: 'block', width: 20, height: 3, borderRadius: 4, background: '#f5eed8' }} />
                      <span style={{ display: 'block', width: 20, height: 3, borderRadius: 4, background: '#f5eed8' }} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu Layer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              className={`md:hidden backdrop-blur-lg border-t border-primary/20 ${isDarkMode ? 'bg-dark/95' : 'bg-white/95'}`}
            >
              <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item, index) => (
                    /* 💡 Touch-Safe Mobile Card Wrapper */
                    <Card3D 
                      key={item.id} 
                      delay={0.1 + index * 0.05} 
                      disableMobile3D={true} // Bypasses translateZ touch-breaking offsets on phone displays
                      onClick={() => scrollToSection(item.id)} // Captures absolute container taps immediately
                      className="cursor-pointer"
                    >
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                          activeSection === item.id
                            ? 'bg-primary/20 text-primary'
                            : 'bg-dark/50 text-light/70 hover:bg-primary/10'
                        }`}
                        style={{
                          boxShadow: activeSection === item.id
                            ? '0 8px 25px rgba(99,102,241,0.4)'
                            : '0 4px 15px rgba(0,0,0,0.2)',
                        }}
                      >
                        <span className="text-2xl mb-1">{item.icon}</span>
                        <span className="text-xs font-medium">{item.label}</span>
                      </motion.div>
                    </Card3D>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar — desktop only */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/20 hidden md:block">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        <div className="absolute bottom-1 right-4 text-xs text-primary font-mono hidden md:block">
          {Math.round(scrollPercent)}%
        </div>
      </motion.nav>

      {/* Mini Floating Compact Navbar */}
      <AnimatePresence>
        {compact && !isOpen && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-dark/90 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-primary/30"
          >
            <div className="flex space-x-2">
              {navItems.map((item, index) => (
                <Card3D key={item.id} delay={0.1 + index * 0.05} disableMobile3D={true}>
                  <motion.button
                    onClick={() => scrollToSection(item.id)}
                    onMouseEnter={playHover}
                    whileHover={{ scale: 1.1, rotateZ: 15 }}
                    whileTap={{ scale: 0.9, rotateZ: -15 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      activeSection === item.id
                        ? 'bg-primary text-white'
                        : isDarkMode
                          ? 'bg-primary/10 hover:bg-primary/30 text-light/80'
                          : 'bg-primary/10 hover:bg-primary/30 text-dark/80'
                    }`}
                    title={item.label}
                    style={{
                      boxShadow: activeSection === item.id
                        ? '0 6px 20px rgba(99,102,241,0.5)'
                        : '0 3px 10px rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="text-sm">{item.icon}</span>
                  </motion.button>
                </Card3D>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
