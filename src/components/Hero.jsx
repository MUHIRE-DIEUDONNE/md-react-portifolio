import React, { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useMagneticEffect } from '../hooks/useMagneticEffect'

// Lazy load Three.js components for better performance
const ThreeHero = lazy(() => import('./ThreeHero'))

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const magneticRef = useMagneticEffect()
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const springConfig = { damping: 20, stiffness: 100 }
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.8]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0]), springConfig)
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), springConfig)

  // Responsive text sizes
  const getTitleSize = () => {
    if (windowWidth < 640) return 'text-3xl'
    if (windowWidth < 768) return 'text-4xl'
    if (windowWidth < 1024) return 'text-5xl'
    return 'text-7xl'
  }

  const getSubtitleSize = () => {
    if (windowWidth < 640) return 'text-base'
    if (windowWidth < 768) return 'text-lg'
    return 'text-xl'
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Simulate loading
    setTimeout(() => setIsLoaded(true), 1000)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Parallax mouse effect (disabled on mobile)
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { width, height } = containerRef.current.getBoundingClientRect()
      
      const x = (clientX / width - 0.5) * 20
      const y = (clientY / height - 0.5) * 20
      
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isMobile, prefersReducedMotion])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  }

  // Words for text reveal animation
  const titleWords = ['Creative', 'Developer', '&', '3D', 'Artist']
  const subtitleText = 'Crafting immersive digital experiences with cutting-edge web technologies'

  return (
    <section 
      id="home" 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background - Responsive intensity */}
      <div 
        className="absolute inset-0 gradient-bg" 
        style={{ 
          opacity: isMobile ? 0.2 : 0.3,
          transform: !isMobile ? `translate(${mousePosition.x}px, ${mousePosition.y}px)` : 'none'
        }}
      />
      
      {/* Particle overlay - hidden on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
      )}

      {/* 3D Canvas - Only load on desktop */}
      {!isMobile && !prefersReducedMotion && (
        <Suspense fallback={<div className="absolute inset-0 bg-dark/50 animate-pulse" />}>
          <div className="absolute inset-0">
            <ThreeHero isLoaded={isLoaded} mousePosition={mousePosition} />
          </div>
        </Suspense>
      )}

      {/* Content */}
      <motion.div
        style={{ scale, opacity, y }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary text-xs sm:text-sm font-semibold">
            🚀 Welcome to my portfolio
          </span>
        </motion.div>

        {/* Animated Title with word-by-word reveal */}
        <motion.h1
          ref={titleRef}
          variants={itemVariants}
          className={`${getTitleSize()} font-bold mb-4 sm:mb-6 leading-tight`}
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className={index === 2 ? 'w-full sm:w-auto' : ''}
              >
                <span className={
                  index === 0 ? 'text-primary' :
                  index === 1 ? 'text-secondary' :
                  index === 2 ? 'text-light' :
                  index === 3 ? 'text-accent' :
                  'bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
                }>
                  {word}
                </span>
              </motion.span>
            ))}
          </div>
        </motion.h1>

        {/* Typing effect subtitle */}
        <motion.div variants={itemVariants}>
          <TypewriterText 
            text={subtitleText}
            speed={50}
            className={`${getSubtitleSize()} text-light/80 mb-8 sm:mb-12 max-w-2xl mx-auto px-4`}
          />
        </motion.div>

        {/* CTA Buttons - Responsive layout */}
        <motion.div 
          variants={itemVariants} 
          className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"
        >
          <motion.button
            ref={magneticRef}
            whileHover={!prefersReducedMotion && !isMobile ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto magnetic-btn text-sm sm:text-base"
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center justify-center gap-2">
              View My Work
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>
          
          <motion.button
            ref={magneticRef}
            whileHover={!prefersReducedMotion && !isMobile ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors text-sm sm:text-base"
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="flex items-center justify-center gap-2">
              Contact Me
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </motion.button>
        </motion.div>

        {/* Floating Tech Icons - Responsive */}
        {!isMobile && (
          <div className="absolute inset-0 pointer-events-none">
            {['React', 'Three.js', 'GSAP', 'Framer'].map((tech, index) => (
              <motion.div
                key={tech}
                className="absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + index * 0.2 }}
                style={{
                  top: `${20 + index * 15}%`,
                  left: index % 2 === 0 ? '5%' : '90%',
                  rotate: mousePosition.x * 0.02
                }}
              >
                <div className="bg-dark/50 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
                  <span className="text-sm font-medium">{tech}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Scroll Indicator - Responsive */}
        <motion.div
          animate={!prefersReducedMotion ? { y: [0, 10, 0] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 sm:w-8 h-10 sm:h-12 border-2 border-light/30 rounded-full flex justify-center">
            <motion.div 
              animate={!prefersReducedMotion ? { y: [0, 20, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 sm:h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Loading Spinner for 3D */}
      {!isLoaded && !isMobile && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-sm">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </section>
  )
}

// Typewriter Text Component
const TypewriterText = ({ text, speed = 50, className = '' }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prefersReducedMotion] = useState(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  )

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(text)
      return
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed, prefersReducedMotion])

  return <p className={className}>{displayText}</p>
}

export default Hero