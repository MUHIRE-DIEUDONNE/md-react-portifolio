// src/components/Skills.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiTarget, FiMonitor, FiZap, FiEdit3,
  FiSettings, FiTrendingUp, FiAward, FiCode, FiCpu,
} from 'react-icons/fi'
import ThreeHero from './ThreeHero'
import { useTheme } from '../hooks/useTheme'

// ─── Premium Styles ────────────────────────────
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --sk-bg: #0c0b09;
    --sk-surface: #131210;
    --sk-card: rgba(22,20,16,0.95);
    --sk-border: rgba(255,245,220,0.07);
    --sk-border-hi: rgba(212,175,85,0.35);
    --sk-gold: #d4af55;
    --sk-gold-dim: rgba(212,175,85,0.18);
    --sk-cream: #f5eed8;
    --sk-muted: rgba(245,238,216,0.42);
    --sk-dim: rgba(245,238,216,0.18);
    --sk-display: 'Playfair Display', Georgia, serif;
    --sk-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .sk-root *, .sk-root *::before, .sk-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .sk-root {
    font-family: var(--sk-body);
    background: var(--sk-bg);
    color: var(--sk-cream);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }

  .sk-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }
`

// ─── 3D Card ────────────────────────────────────
const Card3D = ({ children, className = '', delay = 0, color = '#d4af55' }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: -15, y: 30 }}
    animate={{ opacity: 1, rotateX: 0, y: 0 }}
    whileHover={{ rotateX: 15, scale: 1.05, translateZ: 20 }}
    transition={{ delay, duration: 0.6, type: 'spring', stiffness: 100 }}
    className={`relative ${className}`}
    style={{ transformStyle: 'preserve-3d', perspective: '1000px', boxShadow: `0 10px 30px ${color}20` }}
  >
    <div style={{ transform: 'translateZ(30px)', backfaceVisibility: 'hidden' }}>
      {children}
    </div>
  </motion.div>
)

// ─── Skill Orb ──────────────────────────────────
const SkillOrb3D = ({ skill, index, hoveredSkill, setHoveredSkill, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', delay: index * 0.05, stiffness: 50, damping: 20 }}
      whileHover={{ scale: 1.3, rotate: 15, translateZ: 30, transition: { type: 'spring', stiffness: 300 } }}
      className="relative group cursor-pointer"
      style={{
        fontSize: `${Math.max(1.2, skill.level / 12)}rem`,
        zIndex: hoveredSkill === skill.name ? 10 : 1,
        transformStyle: 'preserve-3d',
      }}
      onHoverStart={() => { setHoveredSkill(skill.name); setIsHovered(true) }}
      onHoverEnd={() => { setHoveredSkill(null); setIsHovered(false) }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle at 30% 30%, ${skill.color}40, transparent)`, transform: 'translateZ(-10px)', filter: 'blur(10px)' }}
          animate={{ scale: isHovered ? [1, 1.2, 1] : 1, opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3 }}
          transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
        />
        <div
          className="relative px-6 py-3 rounded-full border-2 inline-flex items-center gap-3 backdrop-blur-sm"
          style={{
            borderColor: skill.color,
            background: `linear-gradient(135deg, rgba(212,175,85,0.08), rgba(46,204,154,0.06))`,
            boxShadow: isHovered ? `0 0 30px ${skill.color}60, 0 0 60px ${skill.color}30` : `0 0 15px ${skill.color}40`,
            transform: 'translateZ(20px)',
          }}
        >
          <motion.img
            src={skill.icon}
            alt={skill.name}
            className="w-6 h-6 object-contain"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transform: 'translateZ(10px)' }}
          />
          <span className="font-semibold" style={{ color: 'var(--sk-cream)' }}>{skill.name}</span>
        </div>
        <AnimatePresence>
          {hoveredSkill === skill.name && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 backdrop-blur-lg px-4 py-2 rounded-xl text-sm whitespace-nowrap"
              style={{
                background: 'rgba(13,12,9,0.95)',
                border: `1px solid ${skill.color}50`,
                boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
                transform: 'translateZ(40px)',
                color: 'var(--sk-cream)',
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: skill.color }} className="font-bold">{skill.level}%</div>
                <div style={{ color: 'var(--sk-dim)' }}>•</div>
                <div>{skill.years} years</div>
                <div style={{ color: 'var(--sk-dim)' }}>•</div>
                <div>{skill.projects} projects</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Data ──────────────────────────────────────
const SKILLS_DATA = {
  frontend: [
    { name: 'React',      level: 95, color: '#61DAFB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',           years: 4, projects: 25 },
    { name: 'JavaScript', level: 98, color: '#F7DF1E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',   years: 5, projects: 40 },
    { name: 'TypeScript', level: 88, color: '#3178C6', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',   years: 3, projects: 15 },
    { name: 'Next.js',    level: 85, color: '#aaaaaa', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',           years: 2, projects: 8  },
    { name: 'Vue',        level: 75, color: '#4FC08D', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',             years: 2, projects: 5  },
  ],
  animation: [
    { name: 'Framer Motion',  level: 92, color: '#0055FF', icon: 'https://img.icons8.com/fluency/48/motion.png',        years: 3, projects: 18 },
    { name: 'GSAP',           level: 90, color: '#88CE02', icon: 'https://img.icons8.com/fluency/48/lightning-bolt.png', years: 3, projects: 15 },
    { name: 'Three.js',       level: 88, color: '#049EF4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', years: 2, projects: 6 },
    { name: 'CSS Animations', level: 95, color: '#264DE4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',       years: 5, projects: 35 },
  ],
  styling: [
    { name: 'Tailwind CSS',      level: 96, color: '#06B6D4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', years: 3, projects: 28 },
    { name: 'SCSS',              level: 90, color: '#CC6699', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',             years: 4, projects: 22 },
    { name: 'Styled Components', level: 85, color: '#DB7093', icon: 'https://img.icons8.com/fluency/48/css3.png',                                           years: 2, projects: 12 },
  ],
  backend: [
    { name: 'Node.js', level: 85, color: '#339933', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',   years: 3, projects: 15 },
    { name: 'Python',  level: 70, color: '#3776AB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',   years: 2, projects: 8  },
    { name: 'GraphQL', level: 75, color: '#E10098', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',    years: 1, projects: 4  },
  ],
  procedural: [
    { name: 'Terrain Generation', level: 85, color: '#10B981', icon: 'https://img.icons8.com/fluency/48/mountain.png',  years: 3, projects: 12 },
    { name: 'Planet Rendering',   level: 80, color: '#F59E0B', icon: 'https://img.icons8.com/fluency/48/globe.png',     years: 2, projects: 8  },
    { name: 'Procedural Worlds',  level: 88, color: '#8B5CF6', icon: 'https://img.icons8.com/fluency/48/infinity.png', years: 3, projects: 15 },
    { name: 'Noise Algorithms',   level: 82, color: '#EC4899', icon: 'https://img.icons8.com/fluency/48/waves.png',    years: 2, projects: 10 },
    { name: 'Voxel Systems',      level: 75, color: '#EF4444', icon: 'https://img.icons8.com/fluency/48/cube.png',     years: 2, projects: 6  },
  ],
  graphics: [
    { name: 'WebGL',             level: 78, color: '#9333EA', icon: 'https://img.icons8.com/fluency/48/webgl.png',        years: 2, projects: 7 },
    { name: 'Shader Programming',level: 72, color: '#F97316', icon: 'https://img.icons8.com/fluency/48/code.png',         years: 2, projects: 5 },
    { name: '3D Modeling',       level: 68, color: '#0EA5E9', icon: 'https://img.icons8.com/fluency/48/3d-modeling.png',  years: 1, projects: 4 },
    { name: 'Particle Systems',  level: 85, color: '#84CC16', icon: 'https://img.icons8.com/fluency/48/particles.png',    years: 3, projects: 9 },
  ],
}

const CATEGORIES = [
  { id: 'all',        label: 'All Skills',  icon: <FiTarget />    },
  { id: 'frontend',   label: 'Frontend',    icon: <FiMonitor />   },
  { id: 'animation',  label: 'Animation',   icon: <FiZap />       },
  { id: 'styling',    label: 'Styling',     icon: <FiEdit3 />     },
  { id: 'backend',    label: 'Backend',     icon: <FiSettings />  },
  { id: 'procedural', label: 'Procedural',  icon: <FiTrendingUp /> },
  { id: 'graphics',   label: 'Graphics',    icon: <FiAward />     },
]

// ─── Main Component ────────────────────────────
const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [threeReady, setThreeReady] = useState(false)
  const isDarkMode = useTheme()

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)

    const onMove = (e) => setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 })
    window.addEventListener('mousemove', onMove)

    const t = setTimeout(() => setThreeReady(true), 400)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMove)
      clearTimeout(t)
    }
  }, [])

  const getVisibleSkills = () =>
    selectedCategory === 'all'
      ? Object.values(SKILLS_DATA).flat()
      : SKILLS_DATA[selectedCategory] || []

  const customTechStack = [
    { label: 'React',          color: '#61dafb', radius: 3.1, speed: 0.38, phase: 0,   tiltX: 0.3 },
    { label: 'Three.js',       color: '#049EF4', radius: 3.4, speed: 0.30, phase: 1.2, tiltX: 0.2 },
    { label: 'Node.js',        color: '#68A063', radius: 3.2, speed: 0.34, phase: 2.4, tiltX: 0.4 },
    { label: 'TypeScript',     color: '#3178C6', radius: 3.5, speed: 0.28, phase: 3.6, tiltX: 0.1 },
    { label: 'JavaScript',     color: '#f7df1e', radius: 3.0, speed: 0.42, phase: 4.8, tiltX: 0.35},
    { label: 'Tailwind',       color: '#06B6D4', radius: 3.6, speed: 0.26, phase: 0.6, tiltX: 0.25},
    { label: 'MongoDB',        color: '#47A248', radius: 3.3, speed: 0.36, phase: 1.8, tiltX: 0.45},
    { label: 'GSAP',           color: '#88CE02', radius: 3.7, speed: 0.24, phase: 3.0, tiltX: 0.15},
    { label: 'GraphQL',        color: '#E10098', radius: 3.2, speed: 0.40, phase: 5.4, tiltX: 0.5 },
    { label: 'Next.js',        color: '#ffffff', radius: 3.5, speed: 0.32, phase: 6.0, tiltX: 0.28},
    { label: 'Python',         color: '#3776AB', radius: 3.8, speed: 0.22, phase: 2.2, tiltX: 0.38},
    { label: 'WebGL',          color: '#990000', radius: 3.4, speed: 0.35, phase: 4.2, tiltX: 0.22},
    { label: 'Svelte',         color: '#FF3E00', radius: 3.9, speed: 0.20, phase: 1.0, tiltX: 0.45 },
    { label: 'Docker',         color: '#2496ED', radius: 3.0, speed: 0.44, phase: 3.2, tiltX: 0.18 },
    { label: 'AWS',            color: '#FF9900', radius: 3.3, speed: 0.33, phase: 5.0, tiltX: 0.40 },
    { label: 'Figma',          color: '#F24E1E', radius: 3.6, speed: 0.27, phase: 2.8, tiltX: 0.30 },
  ]

  const orbitSpeed = 0.8
  const ringColor = '#d4af55'
  const accentColor = '#2ecc9a'

  const btnBase = (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 22px', borderRadius: 999,
    fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer',
    fontFamily: 'var(--sk-body)',
    transition: 'all 0.22s ease',
    background: active ? 'var(--sk-gold)' : 'transparent',
    border: `1px solid ${active ? 'var(--sk-gold)' : 'rgba(255,245,220,0.12)'}`,
    color: active ? '#0c0b09' : 'var(--sk-muted)',
    boxShadow: active ? '0 4px 20px rgba(212,175,85,0.35)' : 'none',
  })

  return (
    <section id="skills" className="sk-root" style={{ padding: '80px 0', minHeight: '100vh', position: 'relative' }}>
      <style>{PREMIUM_STYLES}</style>

      {threeReady && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <ThreeHero
            mousePosition={mouse}
            orbitSpeed={orbitSpeed}
            ringColor={ringColor}
            accentColor={accentColor}
            techStack={customTechStack}
          />
        </div>
      )}

      <div style={{
        position: 'absolute', top: '10%', right: '-5%',
        width: 600, height: 600, borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(circle, rgba(212,175,85,0.06), transparent)',
        filter: 'blur(80px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
        background: 'radial-gradient(circle, rgba(46,204,154,0.05), transparent)',
        filter: 'blur(80px)',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{
            fontSize: 'clamp(36px,6vw,72px)',
            fontFamily: 'var(--sk-display)',
            lineHeight: 1.05,
            marginBottom: 16,
          }}>
            Skills &amp; Expertise
          </h2>
          <p style={{ color: 'var(--sk-muted)', fontSize: 18, maxWidth: 540, margin: '0 auto' }}>
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          <button onClick={() => setViewMode('grid')}  style={btnBase(viewMode === 'grid')}>
            <FiCode /> Grid View
          </button>
          <button onClick={() => setViewMode('cloud')} style={btnBase(viewMode === 'cloud')}>
            <FiCpu /> Skill Cloud
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedCategory(cat.id)}
              style={btnBase(selectedCategory === cat.id)}
            >
              <span style={{ fontSize: 14 }}>{cat.icon}</span>
              {cat.label}
            </motion.button>
          ))}
        </div>

        {viewMode === 'grid' ? (
          <motion.div
            key={selectedCategory + 'grid'}
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}
          >
            {getVisibleSkills().map((skill, index) => {
              const rgb = skill.color.length === 7
                ? skill.color.slice(1).match(/.{2}/g).map(h => parseInt(h, 16)).join(', ')
                : '212, 175, 85'
              return (
                <Card3D key={skill.name} delay={0.05 * index} color={skill.color}>
                  <motion.div
                    variants={{
                      hidden:   { y: 20, opacity: 0, rotateX: -15 },
                      visible:  { y: 0, opacity: 1, rotateX: 0, transition: { type: 'spring', stiffness: 100 } },
                    }}
                    onHoverStart={() => setHoveredSkill(skill.name)}
                    onHoverEnd={()   => setHoveredSkill(null)}
                    style={{
                      position: 'relative',
                      borderRadius: 16,
                      padding: 24,
                      border: `1px solid ${skill.color}30`,
                      background: `linear-gradient(135deg, rgba(${rgb}, 0.08), transparent)`,
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                      <motion.img
                        src={skill.icon}
                        alt={skill.name}
                        style={{ width: 48, height: 48, objectFit: 'contain' }}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        onError={(e) => { e.target.src = `https://via.placeholder.com/48/888/fff?text=${skill.name[0]}` }}
                      />
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 600, fontSize: 15, marginBottom: 12, color: 'var(--sk-cream)' }}>
                      {skill.name}
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 8 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        style={{ height: '100%', borderRadius: 999, background: skill.color, boxShadow: `0 0 12px ${skill.color}60` }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: 'var(--sk-dim)' }}>Proficiency</span>
                      <span style={{ color: skill.color, fontWeight: 700 }}>{skill.level}%</span>
                    </div>
                    <AnimatePresence>
                      {hoveredSkill === skill.name && !isMobile && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: -8, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          style={{
                            position: 'absolute', bottom: '100%', left: '50%',
                            transform: 'translateX(-50%)', marginBottom: 8,
                            background: 'rgba(13,12,9,0.96)',
                            border: `1px solid ${skill.color}40`,
                            borderRadius: 10, padding: '8px 14px',
                            fontSize: 12, whiteSpace: 'nowrap',
                            color: 'var(--sk-cream)',
                            boxShadow: `0 8px 24px ${skill.color}30`,
                            zIndex: 20,
                          }}
                        >
                          {skill.years} yrs · {skill.projects}+ projects
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Card3D>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, padding: '32px 0', minHeight: 480 }}
          >
            {getVisibleSkills().map((skill, index) => (
              <SkillOrb3D key={skill.name} skill={skill} index={index} hoveredSkill={hoveredSkill} setHoveredSkill={setHoveredSkill} isMobile={isMobile} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 20,
            marginTop: 64,
          }}
        >
          {[
            { value: '25+',  label: 'Technologies', icon: <FiCode />,       color: '#d4af55' },
            { value: '180+', label: 'Projects',      icon: <FiTrendingUp />, color: '#2ecc9a' },
            { value: '5+',   label: 'Years',         icon: <FiAward />,      color: '#d4af55' },
            { value: '30+',  label: '3D Worlds',     icon: <FiTarget />,     color: '#2ecc9a' },
          ].map((stat, i) => (
            <Card3D key={i} delay={0.5 + i * 0.1} color={stat.color}>
              <motion.div
                whileHover={{ scale: 1.04, rotateY: 8 }}
                style={{
                  textAlign:    'center',
                  padding:      '28px 20px',
                  borderRadius: 16,
                  border:       `1px solid ${stat.color}30`,
                  background:   `linear-gradient(135deg, ${stat.color}12, transparent)`,
                }}
              >
                <div style={{ fontSize: 22, color: stat.color, marginBottom: 8 }}>{stat.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'var(--sk-display)', color: stat.color, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--sk-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </motion.div>
            </Card3D>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
