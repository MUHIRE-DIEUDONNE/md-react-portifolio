// src/components/Hero.jsx

import React, {
  useRef,
  useState,
  useEffect,
  Suspense,
  lazy,
} from 'react'

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

// Lazy load ThreeHero
const ThreeHero = lazy(() => import('./ThreeHero'))

/* ─────────────────────────────────────────────
   PREMIUM STYLES
───────────────────────────────────────────── */

const PREMIUM_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

:root {
  --hero-bg: #0c0b09;
  --hero-surface: #131210;
  --hero-card: rgba(22,20,16,0.95);

  --hero-border: rgba(255,245,220,0.07);
  --hero-border-hi: rgba(212,175,85,0.35);

  --hero-gold: #d4af55;
  --hero-gold-dim: rgba(212,175,85,0.18);

  --hero-cream: #f5eed8;

  --hero-muted: rgba(245,238,216,0.5);
  --hero-dim: rgba(245,238,216,0.2);

  --hero-display: 'Playfair Display', serif;
  --hero-body: 'Instrument Sans', sans-serif;
}

.hero-root *,
.hero-root *::before,
.hero-root *::after {
  box-sizing: border-box;
}

.hero-root {
  position: relative;
  overflow: hidden;
  background: var(--hero-bg);
  color: var(--hero-cream);
  font-family: var(--hero-body);
}

/* Grain */
.hero-root::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 1;

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

/* Buttons */
.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 14px 32px;

  border-radius: 999px;
  border: none;

  background: var(--hero-gold);
  color: #0c0b09;

  cursor: pointer;

  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  transition: 0.3s ease;

  box-shadow: 0 10px 40px rgba(212,175,85,0.35);
}

.hero-btn-primary:hover {
  transform: translateY(-3px);
}

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  padding: 13px 30px;

  border-radius: 999px;

  background: transparent;
  border: 1px solid var(--hero-border);

  color: var(--hero-muted);

  cursor: pointer;

  transition: 0.3s ease;
}

.hero-btn-ghost:hover {
  border-color: var(--hero-border-hi);
  color: var(--hero-cream);
}

/* Stat */
.hero-stat {
  padding: 20px;

  min-width: 140px;

  border-radius: 18px;

  border: 1px solid var(--hero-border);

  background: rgba(255,255,255,0.02);

  backdrop-filter: blur(20px);

  transition: 0.3s ease;
}

.hero-stat:hover {
  border-color: var(--hero-border-hi);
  background: rgba(212,175,85,0.04);
}

/* Pill */
.hero-pill {
  padding: 8px 18px;

  border-radius: 999px;

  border: 1px solid var(--hero-border);

  color: var(--hero-muted);

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.08em;
  text-transform: uppercase;

  transition: 0.3s ease;
}

.hero-pill:hover {
  border-color: var(--hero-border-hi);
  color: var(--hero-cream);
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  mix-blend-mode: screen;
}
`

/* ─────────────────────────────────────────────
   MAGNETIC
───────────────────────────────────────────── */

const useMagnetic = () => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const r = el.getBoundingClientRect()

      const x = (e.clientX - (r.left + r.width / 2)) * 0.2
      const y = (e.clientY - (r.top + r.height / 2)) * 0.2

      el.style.transform = `translate(${x}px, ${y}px)`
    }

    const onLeave = () => {
      el.style.transform = 'translate(0,0)'
      el.style.transition =
        'transform 0.6s cubic-bezier(0.23,1,0.32,1)'
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return ref
}

/* ─────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────── */

const InfiniteTypewriter = ({
  texts,
  speed = 38,
  pauseDuration = 2000,
  className,
}) => {
  const [shown, setShown] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex]

    let timeout

    if (!isDeleting) {
      if (shown.length < currentText.length) {
        timeout = setTimeout(() => {
          setShown(currentText.slice(0, shown.length + 1))
        }, speed)
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, pauseDuration)
      }
    } else {
      if (shown.length > 0) {
        timeout = setTimeout(() => {
          setShown(currentText.slice(0, shown.length - 1))
        }, speed / 2)
      } else {
        setIsDeleting(false)
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [shown, isDeleting, currentIndex])

  return (
    <span className={className}>
      {shown}

      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.8,
        }}
        style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          background: 'currentColor',
          marginLeft: 3,
        }}
      />
    </span>
  )
}

/* ─────────────────────────────────────────────
   GRID
───────────────────────────────────────────── */

const GridLines = () => (
  <svg
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0.04,
      pointerEvents: 'none',
    }}
  >
    <defs>
      <pattern
        id="grid"
        width="60"
        height="60"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 60 0 L 0 0 0 60"
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
)

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

const TechPill = ({ label }) => (
  <div className="hero-pill">{label}</div>
)

const StatCard = ({ value, label }) => (
  <div className="hero-stat">
    <div
      style={{
        fontSize: 'clamp(28px,4vw,42px)',
        fontWeight: 900,
        fontFamily: 'var(--hero-display)',
      }}
    >
      {value}
    </div>

    <div
      style={{
        fontSize: 11,
        color: 'var(--hero-dim)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
)

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */

const Hero = () => {
  const containerRef = useRef()

  const btn1 = useMagnetic()
  const btn2 = useMagnetic()

  const shouldReduceMotion = useReducedMotion()

  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const [mounted, setMounted] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    import('./ThreeHero')

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()

    window.addEventListener('resize', checkMobile)

    const onMove = (e) => {
      setMouse({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      })
    }

    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.4], [1, 0]),
    { damping: 25, stiffness: 80 }
  )

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 120]),
    { damping: 25, stiffness: 80 }
  )

  if (!mounted) return null

  return (
    <>
      <style>{PREMIUM_STYLES}</style>

      <section
        ref={containerRef}
        className="hero-root"
        style={{
          minHeight: '100svh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* 3D */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
          }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    border: '2px solid #d4af55',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />

                <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                `}</style>
              </div>
            }
          >
            <ThreeHero mousePosition={mouse} />
          </Suspense>
        </div>

        {/* Glows */}
        <div
          className="glow-orb"
          style={{
            width: 700,
            height: 700,
            background:
              'radial-gradient(circle, rgba(212,175,85,0.08), transparent)',
            top: '-20%',
            left: '-10%',
          }}
        />

        <div
          className="glow-orb"
          style={{
            width: 500,
            height: 500,
            background:
              'radial-gradient(circle, rgba(46,204,154,0.06), transparent)',
            bottom: '-10%',
            right: '-10%',
          }}
        />

        <GridLines />

        {/* CONTENT */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  y: [0, -8, 0],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            opacity,
            y,
            position: 'relative',
            zIndex: 10,
            maxWidth: 1000,
            padding: '0 24px',
            textAlign: 'center',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 30 }}
          >
            <span
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                background: 'rgba(212,175,85,0.12)',
                border: '1px solid rgba(212,175,85,0.3)',
                color: '#d4af55',
                fontSize: 13,
              }}
            >
              Available for new projects
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(48px,9vw,110px)',
              lineHeight: 1,
              marginBottom: 30,
              fontFamily: 'var(--hero-display)',
            }}
          >
            Creative Developer
            <br />
            & 3D Artist
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              maxWidth: 720,
              margin: '0 auto 50px',
              color: 'var(--hero-muted)',
              fontSize: 'clamp(16px,2vw,20px)',
              minHeight: 80,
            }}
          >
            <InfiniteTypewriter
              texts={[
                'Crafting immersive digital experiences with cutting-edge web technologies.',
                'Building stunning 3D visualizations and interactive web applications.',
                'Transforming ideas into beautiful high-performance solutions.',
              ]}
            />
          </motion.div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 70,
            }}
          >
            <div ref={btn1}>
              <button className="hero-btn-primary">
                View My Work
              </button>
            </div>

            <div ref={btn2}>
              <button className="hero-btn-ghost">
                Contact Me
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: 60,
            }}
          >
            <StatCard value="5+" label="Years Exp." />
            <StatCard value="40+" label="Projects" />
            <StatCard value="20+" label="Clients" />
            <StatCard value="15+" label="Countries" />
          </div>

          {/* Pills */}
          {!isMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {[
                'React',
                'Three.js',
                'Node.js',
                'Framer Motion',
                'Tailwind',
                'TypeScript',
              ].map((item) => (
                <TechPill key={item} label={item} />
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </>
  )
}

export default Hero