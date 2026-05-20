// src/components/LoadingScreen.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCode, FiCpu, FiGlobe, FiZap } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES
───────────────────────────────────────────── */
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ld-bg: #0c0b09;
    --ld-surface: #131210;
    --ld-card: rgba(22, 20, 16, 0.95);
    --ld-border: rgba(255,245,220,0.07);
    --ld-border-hi: rgba(212,175,85,0.35);
    --ld-gold: #d4af55;
    --ld-gold-dim: rgba(212,175,85,0.18);
    --ld-cream: #f5eed8;
    --ld-muted: rgba(245,238,216,0.42);
    --ld-dim: rgba(245,238,216,0.18);
    --ld-display: 'Playfair Display', Georgia, serif;
    --ld-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .ld-root *, .ld-root *::before, .ld-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .ld-root {
    font-family: var(--ld-body);
    background: var(--ld-bg);
    color: var(--ld-cream);
    -webkit-font-smoothing: antialiased;
    position: relative; overflow: hidden;
  }

  .ld-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .ld-root ::-webkit-scrollbar { width: 3px; }
  .ld-root ::-webkit-scrollbar-track { background: transparent; }
  .ld-root ::-webkit-scrollbar-thumb { background: var(--ld-border-hi); border-radius: 4px; }
`

const LoadingScreen = ({ isLoading, onLoadingComplete }) => {
  const [loadingText, setLoadingText] = useState('Initializing...')
  const [progress, setProgress] = useState(0)
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

  useEffect(() => {
    if (!isLoading) return

    const loadingSteps = [
      { text: 'Initializing...', duration: 500 },
      { text: 'Loading components...', duration: 800 },
      { text: 'Setting up 3D environments...', duration: 1000 },
      { text: 'Preparing AI assistant...', duration: 700 },
      { text: 'Almost ready...', duration: 500 }
    ]

    let currentIndex = 0
    let currentProgress = 0

    const interval = setInterval(() => {
      if (currentIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[currentIndex].text)
        currentProgress += 100 / loadingSteps.length
        setProgress(Math.min(currentProgress, 100))
        currentIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onLoadingComplete()
        }, 300)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [isLoading, onLoadingComplete])

  const lightModeStyles = `
    html.light-mode .ld-root {
      --ld-bg: #ffffff;
      --ld-surface: #f8fafc;
      --ld-card: rgba(255, 255, 255, 0.95);
      --ld-border: rgba(0, 0, 0, 0.1);
      --ld-border-hi: rgba(99, 102, 241, 0.3);
      --ld-gold: #6366f1;
      --ld-gold-dim: rgba(99, 102, 241, 0.1);
      --ld-cream: #0f172a;
      --ld-muted: rgba(15, 23, 42, 0.7);
      --ld-dim: rgba(15, 23, 42, 0.5);
    }
  `

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="ld-root fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        >
          <style>{PREMIUM_STYLES}{lightModeStyles}</style>
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.5, 1],
                x: [0, 100, 0],
                y: [0, -50, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"
              animate={{ 
                scale: [1.5, 1, 1.5],
                x: [0, -100, 0],
                y: [0, 50, 0]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Main Loading Content */}
          <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20,
                duration: 1.5
              }}
              className="relative mb-8"
            >
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary blur-xl opacity-60"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Profile Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl">
                  <img
                    src="/src/images/muhire dieudonne.jpg"
                    alt="Muhire Dieudonne"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236366f1' font-family='system-ui' font-size='14' font-weight='bold'%3EMD%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  
                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary"
                    animate={{ 
                      rotate: [0, 360],
                      borderDashoffset: [0, 100]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{
                      borderStyle: 'dashed',
                      borderTopColor: 'transparent',
                      borderRightColor: 'transparent'
                    }}
                  />
                </div>

                {/* Floating Icons */}
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiCode className="w-4 h-4 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-2 -left-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    y: [0, 5, 0],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <FiCpu className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-light mb-4 flex items-center gap-3">
                <img
                  src="/src/images/muhire dieudonne.JPG"
                  alt="Muhire Dieudonne"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-primary/50"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236366f1' font-family='system-ui' font-size='14' font-weight='bold'%3EMD%3C/text%3E%3C/svg%3E"
                  }}
                />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Muhire Dieudonne
                </span>
              </h1>
              
              <motion.div
                className="relative"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
              >
                <p className="text-lg sm:text-xl text-light/80 font-medium leading-relaxed">
                  The creative and innovative creator and innovator in 
                  <span className="text-primary font-semibold"> software development</span> and 
                  <span className="text-secondary font-semibold"> machine learning</span>
                </p>
                
                {/* Typing Effect Underline */}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 2, duration: 0.8 }}
                />
              </motion.div>
            </motion.div>

            {/* Loading Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto">
                <div className={`h-2 rounded-full overflow-hidden border border-primary/30 ${isDarkMode ? 'bg-dark/50' : 'bg-white/50'}`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}>{Math.round(progress)}%</p>
              </div>

              {/* Loading Text */}
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="flex gap-1"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <div className="w-2 h-2 bg-accent rounded-full" />
                </motion.div>
                <p className="text-light/70 text-sm">{loadingText}</p>
              </div>

              {/* Tech Stack Icons */}
              <motion.div
                className="flex items-center justify-center gap-4 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-primary"
                >
                  <FiGlobe className="w-5 h-5" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: -360 }}
                  transition={{ duration: 0.6 }}
                  className="text-secondary"
                >
                  <FiZap className="w-5 h-5" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="text-accent"
                >
                  <FiCode className="w-5 h-5" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
