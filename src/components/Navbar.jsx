// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMagneticEffect } from '../hooks/useMagneticEffect'
import { FiHome, FiUser, FiZap, FiBriefcase, FiTrendingUp, FiMail, FiSun, FiMoon, FiX,
FiLayers, FiAward, FiBookOpen } from 'react-icons/fi'
import {
  House, UserRound, Zap, BriefcaseBusiness, TrendingUp, Mail,
  Layers3, GraduationCap, Award, Newspaper, Sun, Moon, Menu, X
} from 'lucide-react'
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

  .premium-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 40;
    height: 72px;
    background: rgba(12,11,9,.82);
    border-bottom: 1px solid rgba(255,245,220,.08);
    box-shadow: 0 10px 30px rgba(0,0,0,.12);
    backdrop-filter: blur(18px);
  }
  html.light-mode .premium-header {
    background: rgba(255,255,255,.88);
    border-bottom-color: rgba(15,23,42,.08);
  }
  .premium-header-inner {
    width: min(1440px, calc(100% - 32px));
    height: 72px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .premium-brand {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 190px;
    border: none;
    background: transparent;
    color: var(--nv-cream);
    cursor: pointer;
    text-align: left;
  }
  .premium-brand-photo {
    width: 42px;
    height: 42px;
    flex: 0 0 42px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(212,175,85,.42);
  }
  .premium-brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.05;
  }
  .premium-brand-copy strong {
    font-family: var(--nv-display);
    font-size: 14px;
  }
  .premium-brand-copy span {
    margin-top: 4px;
    color: var(--nv-muted);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .premium-desktop-nav {
    min-width: 0;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }
  .premium-nav-link {
    position: relative;
    height: 40px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0 8px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--nv-muted);
    font-family: var(--nv-body);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: color .2s, background .2s;
  }
  .premium-nav-link:hover {
    color: var(--nv-cream);
    background: rgba(212,175,85,.07);
  }
  .premium-nav-link.active {
    color: var(--nv-gold);
    background: var(--nv-gold-dim);
  }
  .premium-nav-link.active::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: -16px;
    height: 2px;
    border-radius: 2px;
    background: var(--nv-gold);
  }
  .premium-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }
  .premium-theme,
  .premium-menu {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--nv-border);
    border-radius: 10px;
    background: var(--nv-card);
    color: var(--nv-cream);
    cursor: pointer;
  }
  .premium-hire {
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 15px;
    border: 0;
    border-radius: 10px;
    background: var(--nv-gold);
    color: #0c0b09;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .04em;
    white-space: nowrap;
    cursor: pointer;
  }
  .premium-mobile-panel {
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    z-index: 39;
    max-height: calc(100dvh - 72px);
    overflow-y: auto;
    background: rgba(12,11,9,.98);
    border-bottom: 1px solid var(--nv-border);
    box-shadow: 0 24px 50px rgba(0,0,0,.35);
  }
  html.light-mode .premium-mobile-panel {
    background: rgba(255,255,255,.98);
  }
  .premium-mobile-inner {
    width: min(640px, calc(100% - 32px));
    margin: 0 auto;
    padding: 14px 0 18px;
  }
  .premium-mobile-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 8px;
  }
  .premium-mobile-link {
    min-height: 48px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--nv-border);
    border-radius: 12px;
    padding: 0 12px;
    background: transparent;
    color: var(--nv-muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }
  .premium-mobile-link.active {
    color: var(--nv-gold);
    border-color: var(--nv-border-hi);
    background: var(--nv-gold-dim);
  }
  .premium-mobile-hire {
    width: 100%;
    min-height: 48px;
    margin-top: 10px;
  }
  .premium-mobile-actions {
    display: grid;
    grid-template-columns: 48px 1fr;
    gap: 8px;
    margin-top: 10px;
  }
  .premium-mobile-actions .premium-theme {
    display: inline-flex;
  }
  .premium-mobile-actions .premium-hire {
    width: 100%;
    margin-top: 0;
  }

  @media (min-width: 1024px) {
    .premium-menu { display: none; }
  }
  @media (max-width: 1023px) {
    .premium-desktop-nav,
    .premium-actions .premium-hire,
    .premium-actions .premium-theme {
      display: none;
    }
  }
  @media (min-width: 1024px) and (max-width: 1180px) {
    .premium-nav-link { padding-inline: 5px; gap: 4px; font-size: 10px; }
    .premium-nav-link svg { width: 14px; height: 14px; }
    .premium-brand { min-width: 175px; }
  }
  @media (max-width: 640px) {
    .premium-header,
    .premium-header-inner { height: 64px; }
    .premium-header-inner { width: calc(100% - 24px); gap: 8px; }
    .premium-brand { min-width: 0; flex: 1; }
    .premium-brand-photo { width: 38px; height: 38px; flex-basis: 38px; }
    .premium-brand-copy strong { font-size: 13px; }
    .premium-mobile-panel { top: 64px; max-height: calc(100dvh - 64px); }
  }
  @media (max-width: 380px) {
    .premium-brand-copy span { display: none; }
    .premium-mobile-inner { width: calc(100% - 24px); }
  }

  .nv-compact {
    width: max-content;
    max-width: calc(100vw - 24px);
  }

  .nv-compact-row {
    display: grid;
    grid-template-columns: repeat(10, 36px);
    justify-content: center;
    align-items: center;
    gap: 6px;
  }

  .nv-compact-button {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    .nv-compact-row {
      grid-template-columns: repeat(5, minmax(0, 38px));
      gap: 4px;
    }
  }

  @media (max-width: 380px) {
    .nv-compact {
      max-width: calc(100vw - 16px);
      padding: 7px 8px;
    }
    .nv-compact-row {
      grid-template-columns: repeat(5, minmax(0, 38px));
      width: 100%;
      gap: 4px;
    }
  }

  @media (max-width: 320px) {
    .nv-compact-row {
      grid-template-columns: repeat(6, minmax(0, 38px));
    }
  }
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
  const navigate = useNavigate()
  const location = useLocation()
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
    { id: 'home', label: 'Home', icon: <House size={16} strokeWidth={1.8} /> },
    { id: 'about', label: 'About', icon: <UserRound size={16} strokeWidth={1.8} /> },
    { id: 'skills', label: 'Skills', icon: <Zap size={16} strokeWidth={1.8} /> },
    { id: 'projects', label: 'Projects', icon: <BriefcaseBusiness size={16} strokeWidth={1.8} /> },
    { id: 'services', label: 'Services', icon: <Layers3 size={16} strokeWidth={1.8} /> },
    { id: 'experience', label: 'Experience', icon: <TrendingUp size={16} strokeWidth={1.8} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={16} strokeWidth={1.8} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={16} strokeWidth={1.8} /> },
    { id: 'blog', label: 'Blog', icon: <Newspaper size={16} strokeWidth={1.8} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={16} strokeWidth={1.8} /> },
  ]

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = previousOverflow
    return () => { document.body.style.overflow = previousOverflow }
  }, [isOpen])

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    const isDark = saved === 'dark'
    setIsDarkMode(isDark)
    applyTheme(isDark)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 1024 && isOpen) setIsOpen(false)
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

  useEffect(() => {
    const path = location.pathname === '/' ? 'home' : location.pathname.slice(1)
    setActiveSection(path)
  }, [location.pathname])

  // 💡 ENHANCED SCROLL ENGINE FOR MOBILE ACCURACY
  const scrollToSection = (sectionId) => {
    // FIX: previously we started window.scrollTo(...) and setIsOpen(false)
    // at the same instant. setIsOpen(false) triggers the mobile menu's
    // 0.3s collapse animation (height: 'auto' -> 0), which keeps shifting
    // the page's layout height WHILE the smooth-scroll animation is also
    // running. The two animations fought each other, and the net visual
    // result was that taps looked like they did nothing.
    //
    // Now: close the menu first, wait for its collapse animation to
    // actually finish, THEN measure the target position and scroll —
    // so nothing is shifting layout underneath the scroll animation.
    const wasOpen = isOpen

    setIsOpen(false)
    window.dispatchEvent(new CustomEvent('nav-menu-toggle', { detail: false }))
    playClick()

    const routeMap = {
      home: '/',
      about: '/about',
      skills: '/skills',
      projects: '/projects',
      services: '/services',
      experience: '/experience',
      education: '/education',
      certificates: '/certificates',
      blog: '/blog',
      contact: '/contact',
    }

    if (routeMap[sectionId]) {
      navigate(routeMap[sectionId])
    }

    const runScroll = () => {
      const element = document.getElementById(sectionId)
      if (!element) return

      // topBarRef (fixed-height row) instead of navRef (whole nav, which
      // would include the now-closed mobile menu anyway, but this stays
      // safe regardless of open/closed state).
      const navHeight = topBarRef.current?.offsetHeight || 80

      // Calculate real absolute coordinates, ignoring parent offsets or overlay height drops
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - navHeight

      // DEFENSIVE FIX: if any global CSS sets scroll-snap-type on html/body
      // (common in "snap section" style templates), it can silently fight
      // or ignore a JS-driven smooth scroll, making it look like nothing
      // happened. Temporarily disable it for this scroll, then restore.
      const htmlEl = document.documentElement
      const bodyEl = document.body
      const prevHtmlSnap = htmlEl.style.scrollSnapType
      const prevBodySnap = bodyEl.style.scrollSnapType
      htmlEl.style.scrollSnapType = 'none'
      bodyEl.style.scrollSnapType = 'none'

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      })

      window.setTimeout(() => {
        htmlEl.style.scrollSnapType = prevHtmlSnap
        bodyEl.style.scrollSnapType = prevBodySnap
      }, 900)
    }

    if (wasOpen) {
      // Match the mobile menu's collapse transition duration (0.3s) with a
      // small safety margin, so layout has fully settled before we scroll.
      setTimeout(runScroll, 340)
    } else {
      runScroll()
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
        className="premium-header"
        style={{ opacity: navOpacity }}
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, type: 'spring', stiffness: 100 }}
      >
        <div ref={topBarRef} className="premium-header-inner">
          <motion.button
            type="button"
            className="premium-brand"
            onClick={() => scrollToSection('home')}
            aria-label="Go to home page"
            whileTap={{ scale: 0.98 }}
          >
            <img className="premium-brand-photo" src={profilePhoto} alt="Muhire Dieudonne" />
            <span className="premium-brand-copy">
              <strong>Muhire Dieudonne</strong>
              <span>Dev Portfolio</span>
            </span>
          </motion.button>

          <nav className="premium-desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                type="button"
                ref={(el) => (linkRefs.current[navItems.indexOf(item)] = el)}
                className={`premium-nav-link ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={playHover}
                aria-current={activeSection === item.id ? 'page' : undefined}
                whileTap={{ scale: 0.96 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="premium-actions">
            <button
              type="button"
              className="premium-theme"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
            </button>
            <motion.button
              type="button"
              className="premium-hire"
              onClick={() => scrollToSection('contact')}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
            >
              Hire Me
            </motion.button>
            <motion.button
              type="button"
              className="premium-menu"
              onClick={handleHamburgerClick}
              aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              whileTap={{ scale: 0.94 }}
            >
              {isOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </motion.button>
          </div>
        </div>

        {/* ── Mobile Menu Layer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              className="premium-mobile-panel"
            >
              <div className="premium-mobile-inner">
                <div className="premium-mobile-grid">
                  {navItems.map((item) => (
                    <motion.button
                      type="button"
                      key={item.id}
                      className={`premium-mobile-link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => scrollToSection(item.id)}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
                <div className="premium-mobile-actions">
                  <button
                    type="button"
                    className="premium-theme"
                    onClick={toggleTheme}
                    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDarkMode ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
                  </button>
                  <button
                    type="button"
                    className="premium-hire"
                    onClick={() => scrollToSection('contact')}
                  >
                    Hire Me
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}

export default Navbar
