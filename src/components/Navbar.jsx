// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useMagneticEffect } from '../hooks/useMagneticEffect'

// ----------------------------------------------------------------------
// Sound hook – defined locally (no import from hooks)
// ----------------------------------------------------------------------
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
      if (clickSound.current) {
        clickSound.current.pause()
        clickSound.current = null
      }
      if (hoverSound.current) {
        hoverSound.current.pause()
        hoverSound.current = null
      }
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

// ----------------------------------------------------------------------
// Navbar component
// ----------------------------------------------------------------------
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [scrollPercent, setScrollPercent] = useState(0)
  const [compact, setCompact] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, activeIndex: -1 })

  // Magnetic effect refs – we apply them to logo and utility buttons
  const magneticLogo = useMagneticEffect()
  const magneticSound = useMagneticEffect()
  const magneticTheme = useMagneticEffect()

  const navRef = useRef(null)
  const linkRefs = useRef([])
  const { playClick, playHover } = useSound(soundEnabled)

  const { scrollYProgress } = useScroll()
  const navOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const navBlur = useTransform(scrollYProgress, [0, 0.1], [0, 10])

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '💼' },
    { id: 'experience', label: 'Experience', icon: '📈' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ]

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = () => setPrefersReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  // Scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const winScroll = document.documentElement.scrollTop
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollPercent((winScroll / height) * 100)

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // scrolling down
      } else {
        setIsVisible(true)  // scrolling up
      }
      setLastScrollY(currentScrollY)
      setScrolled(currentScrollY > 50)
      setCompact(currentScrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Intersection Observer for active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navHeight = navRef.current?.offsetHeight || 80
      const y = element.offsetTop - navHeight
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      setIsOpen(false)
      playClick()
    }
  }

  // Mouse move handler for underline follower
  const handleLinkMouseMove = (e, index) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      activeIndex: index
    })
    playHover()
  }

  const handleLinkMouseLeave = () => {
    setMousePos({ x: 0, y: 0, activeIndex: -1 })
  }

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled)
    if (!soundEnabled) playClick()
  }

  const showUnderline = mousePos.activeIndex !== -1 && windowWidth >= 1024

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        ref={navRef}
        style={{
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`
        }}
        initial={{ y: -100 }}
        animate={{
          y: isVisible ? 0 : -100,
          backgroundColor: scrolled ? 'rgba(15, 23, 42, 0.8)' : 'transparent'
        }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5, type: 'spring', stiffness: 100 }}
        className="fixed w-full z-40 transition-all duration-300 shadow-lg shadow-primary/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo with magnetic effect */}
            <motion.div
              ref={magneticLogo}
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer"
              onClick={() => scrollToSection('home')}
              onMouseEnter={playHover}
            >
              {'<DevPortfolio />'}
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item, index) => (
                <div key={item.id} className="relative">
                  <motion.button
                    ref={el => (linkRefs.current[index] = el)}
                    onClick={() => scrollToSection(item.id)}
                    onMouseMove={(e) => handleLinkMouseMove(e, index)}
                    onMouseLeave={handleLinkMouseLeave}
                    className={`relative px-2 lg:px-4 py-2 text-xs lg:text-sm font-medium uppercase tracking-wider rounded-lg group transition-colors ${
                      activeSection === item.id
                        ? 'text-primary'
                        : 'text-light/70 hover:text-light'
                    }`}
                    whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-1 lg:gap-2">
                      <span className="text-base lg:text-lg">{item.icon}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </span>
                    {activeSection === item.id && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-primary/10 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

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

              {/* Sound toggle with magnetic effect */}
              <button
                ref={magneticSound}
                onClick={toggleSound}
                onMouseEnter={playHover}
                className="ml-2 p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Toggle sound"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>

              {/* Theme toggle with magnetic effect */}
              <button
                ref={magneticTheme}
                onClick={() => document.body.classList.toggle('light-theme')}
                onMouseEnter={playHover}
                className="ml-2 p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Toggle theme"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
            </div>

            {/* Mobile Right Side */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleSound}
                className="p-2 bg-primary/10 rounded-full"
                aria-label="Toggle sound"
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
              <button
                onClick={() => document.body.classList.toggle('light-theme')}
                className="p-2 bg-primary/10 rounded-full"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </button>
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 focus:outline-none"
                animate={isOpen ? 'open' : 'closed'}
              >
                <span className="sr-only">Open main menu</span>
                <motion.span
                  className="absolute h-0.5 w-6 bg-light rounded-full"
                  style={{ top: '30%', left: '20%' }}
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="absolute h-0.5 w-6 bg-light rounded-full"
                  style={{ top: '50%', left: '20%' }}
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="absolute h-0.5 w-6 bg-light rounded-full"
                  style={{ top: '70%', left: '20%' }}
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              className="md:hidden bg-dark/95 backdrop-blur-lg border-t border-primary/20"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => scrollToSection(item.id)}
                      onMouseEnter={playHover}
                      className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                        activeSection === item.id
                          ? 'bg-primary/20 text-primary'
                          : 'bg-dark/50 text-light/70 hover:bg-primary/10'
                      }`}
                    >
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary/20">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${scrollPercent}%` }}
          />
        </div>

        {/* Scroll Percentage Display */}
        <div className="absolute bottom-1 right-4 text-xs text-primary font-mono">
          {Math.round(scrollPercent)}%
        </div>
      </motion.nav>

      {/* Mini Floating Navbar (Compact Mode) */}
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
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={playHover}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'bg-primary/10 hover:bg-primary/30 text-light/80'
                  }`}
                  title={item.label}
                >
                  <span className="text-sm">{item.icon}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar