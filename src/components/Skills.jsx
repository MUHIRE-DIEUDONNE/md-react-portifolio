// src/components/Skills.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { FiTarget, FiMonitor, FiZap, FiEdit3, FiSettings, FiTrendingUp, FiAward, FiCode, FiCpu } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES
───────────────────────────────────────────── */
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --sk-bg: #0c0b09;
    --sk-surface: #131210;
    --sk-card: rgba(22, 20, 16, 0.95);
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
    position: relative; overflow: hidden;
  }

  .sk-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 1;
  }

  .sk-root ::-webkit-scrollbar { width: 3px; }
  .sk-root ::-webkit-scrollbar-track { background: transparent; }
  .sk-root ::-webkit-scrollbar-thumb { background: var(--sk-border-hi); border-radius: 4px; }

  .sk-pill {
    padding: 8px 22px; border-radius: 100px; font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--sk-border); background: transparent;
    color: var(--sk-muted); font-family: var(--sk-body);
    transition: all 0.22s ease;
  }
  .sk-pill:hover { border-color: var(--sk-border-hi); color: var(--sk-cream); }
  .sk-pill.active {
    background: var(--sk-gold); border-color: var(--sk-gold);
    color: #0c0b09; font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }
`

// Theme hook for Skills component
const useTheme = () => {
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
  return isDarkMode
}

// ─── 3D Floating Elements ──────────────────────────────────────────────
const Floating3DElement = ({ delay, duration, size = 20, color = '#6366f1', style = {} }) => (
  <motion.div
    initial={{ opacity: 0, rotateY: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0.8, 1],
      rotateY: [0, 180, 360],
      scale: [0, 1, 1.2, 1],
      y: [0, -20, 0]
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear',
      delay
    }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, transparent)`,
      transform: 'translateZ(50px)',
      transformStyle: 'preserve-3d',
      boxShadow: `0 0 20px ${color}40`,
      ...style
    }}
  />
)

// ─── 3D Card Component ───────────────────────────────────────────────
const Card3D = ({ children, className = '', delay = 0, color = '#6366f1' }) => (
  <motion.div
    initial={{ opacity: 0, rotateX: -15, y: 30 }}
    animate={{ opacity: 1, rotateX: 0, y: 0 }}
    whileHover={{ rotateX: 15, scale: 1.05, translateZ: 20 }}
    transition={{
      delay,
      duration: 0.6,
      type: 'spring',
      stiffness: 100
    }}
    className={`relative ${className}`}
    style={{
      transformStyle: 'preserve-3d',
      perspective: '1000px',
      boxShadow: `0 10px 30px ${color}20`
    }}
  >
    <div style={{
      transform: 'translateZ(30px)',
      backfaceVisibility: 'hidden'
    }}>
      {children}
    </div>
  </motion.div>
)

// ─── 3D Skill Orb Component ───────────────────────────────────────────
const SkillOrb3D = ({ skill, index, hoveredSkill, setHoveredSkill, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ 
        type: 'spring',
        delay: index * 0.05,
        stiffness: 50,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.3,
        rotate: 15,
        translateZ: 30,
        transition: { type: 'spring', stiffness: 300 }
      }}
      className="relative group cursor-pointer"
      style={{
        fontSize: `${Math.max(1.2, skill.level / 12)}rem`,
        zIndex: hoveredSkill === skill.name ? 10 : 1,
        transformStyle: 'preserve-3d'
      }}
      onHoverStart={() => {
        setHoveredSkill(skill.name)
        setIsHovered(true)
      }}
      onHoverEnd={() => {
        setHoveredSkill(null)
        setIsHovered(false)
      }}
    >
      <div className="relative">
        {/* 3D Orb Background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${skill.color}40, transparent)`,
            transform: 'translateZ(-10px)',
            filter: 'blur(10px)'
          }}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0
          }}
        />
        
        {/* Main Orb */}
        <div 
          className="relative px-6 py-3 rounded-full border-2 inline-flex items-center gap-3 backdrop-blur-sm"
          style={{ 
            borderColor: skill.color,
            background: `linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))`,
            boxShadow: isHovered ? `0 0 30px ${skill.color}60, 0 0 60px ${skill.color}30` : `0 0 15px ${skill.color}40`,
            transform: 'translateZ(20px)'
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
          <span className="font-semibold">{skill.name}</span>
        </div>
        
        {/* 3D Tooltip */}
        <AnimatePresence>
          {hoveredSkill === skill.name && !isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: -10, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-dark/95 backdrop-blur-lg px-4 py-2 rounded-xl text-sm whitespace-nowrap border border-primary/30"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                transform: 'translateZ(40px)'
              }}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: skill.color }} className="font-bold">{skill.level}%</div>
                <div className={isDarkMode ? 'text-light/60' : 'text-dark/60'}>•</div>
                <div>{skill.years} years</div>
                <div className={isDarkMode ? 'text-light/60' : 'text-dark/60'}>•</div>
                <div>{skill.projects} projects</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'cloud'
  const isDarkMode = useTheme()

  const skillsData = {
    frontend: [
      { name: 'React', level: 95, color: '#61DAFB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', years: 4, projects: 25 },
      { name: 'JavaScript', level: 98, color: '#F7DF1E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', years: 5, projects: 40 },
      { name: 'TypeScript', level: 88, color: '#3178C6', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', years: 3, projects: 15 },
      { name: 'Next.js', level: 85, color: '#000000', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', years: 2, projects: 8 },
      { name: 'Vue', level: 75, color: '#4FC08D', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', years: 2, projects: 5 }
    ],
    animation: [
      { name: 'Framer Motion', level: 92, color: '#0055FF', icon: 'https://img.icons8.com/fluency/48/motion.png', years: 3, projects: 18 },
      { name: 'GSAP', level: 90, color: '#88CE02', icon: 'https://img.icons8.com/fluency/48/lightning-bolt.png', years: 3, projects: 15 },
      { name: 'Three.js', level: 88, color: '#049EF4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', years: 2, projects: 6 },
      { name: 'CSS Animations', level: 95, color: '#264DE4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', years: 5, projects: 35 }
    ],
    styling: [
      { name: 'Tailwind CSS', level: 96, color: '#06B6D4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg', years: 3, projects: 28 },
      { name: 'SCSS', level: 90, color: '#CC6699', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg', years: 4, projects: 22 },
      { name: 'Styled Components', level: 85, color: '#DB7093', icon: 'https://img.icons8.com/fluency/48/css3.png', years: 2, projects: 12 }
    ],
    backend: [
      { name: 'Node.js', level: 85, color: '#339933', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', years: 3, projects: 15 },
      { name: 'Python', level: 70, color: '#3776AB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', years: 2, projects: 8 },
      { name: 'GraphQL', level: 75, color: '#E10098', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', years: 1, projects: 4 }
    ],
    procedural: [
      { name: 'Terrain Generation', level: 85, color: '#10B981', icon: 'https://img.icons8.com/fluency/48/mountain.png', years: 3, projects: 12 },
      { name: 'Planet Rendering', level: 80, color: '#F59E0B', icon: 'https://img.icons8.com/fluency/48/globe.png', years: 2, projects: 8 },
      { name: 'Procedural Worlds', level: 88, color: '#8B5CF6', icon: 'https://img.icons8.com/fluency/48/infinity.png', years: 3, projects: 15 },
      { name: 'Noise Algorithms', level: 82, color: '#EC4899', icon: 'https://img.icons8.com/fluency/48/waves.png', years: 2, projects: 10 },
      { name: 'Voxel Systems', level: 75, color: '#EF4444', icon: 'https://img.icons8.com/fluency/48/cube.png', years: 2, projects: 6 }
    ],
    graphics: [
      { name: 'WebGL', level: 78, color: '#9333EA', icon: 'https://img.icons8.com/fluency/48/webgl.png', years: 2, projects: 7 },
      { name: 'Shader Programming', level: 72, color: '#F97316', icon: 'https://img.icons8.com/fluency/48/code.png', years: 2, projects: 5 },
      { name: '3D Modeling', level: 68, color: '#0EA5E9', icon: 'https://img.icons8.com/fluency/48/3d-modeling.png', years: 1, projects: 4 },
      { name: 'Particle Systems', level: 85, color: '#84CC16', icon: 'https://img.icons8.com/fluency/48/particles.png', years: 3, projects: 9 }
    ]
  }

  const categories = [
    { id: 'all', label: 'All Skills', icon: <FiTarget />, image: 'https://img.icons8.com/fluency/48/star.png' },
    { id: 'frontend', label: 'Frontend', icon: <FiMonitor />, image: 'https://img.icons8.com/fluency/48/code.png' },
    { id: 'animation', label: 'Animation', icon: <FiZap />, image: 'https://img.icons8.com/fluency/48/motion.png' },
    { id: 'styling', label: 'Styling', icon: <FiEdit3 />, image: 'https://img.icons8.com/fluency/48/paint-palette.png' },
    { id: 'backend', label: 'Backend', icon: <FiSettings />, image: 'https://img.icons8.com/fluency/48/server.png' },
    { id: 'procedural', label: 'Procedural', icon: <FiTrendingUp />, image: 'https://img.icons8.com/fluency/48/mountain.png' },
    { id: 'graphics', label: 'Graphics', icon: <FiAward />, image: 'https://img.icons8.com/fluency/48/webgl.png' }
  ]

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getVisibleSkills = () => {
    if (selectedCategory === 'all') {
      return Object.values(skillsData).flat()
    }
    return skillsData[selectedCategory] || []
  }

  const lightModeStyles = `
    html.light-mode .sk-root {
      --sk-bg: #ffffff;
      --sk-surface: #f8fafc;
      --sk-card: rgba(255, 255, 255, 0.95);
      --sk-border: rgba(0, 0, 0, 0.1);
      --sk-border-hi: rgba(99, 102, 241, 0.3);
      --sk-gold: #6366f1;
      --sk-gold-dim: rgba(99, 102, 241, 0.1);
      --sk-cream: #0f172a;
      --sk-muted: rgba(15, 23, 42, 0.7);
      --sk-dim: rgba(15, 23, 42, 0.5);
    }
  `

  return (
    <section id="skills" className="sk-root py-16 sm:py-20 relative overflow-hidden">
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>
      {/* 3D Floating Elements Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Floating3DElement delay={0} duration={8} size={15} color="#6366f1" style={{ top: '10%', left: '5%' }} />
        <Floating3DElement delay={1} duration={10} size={20} color="#8b5cf6" style={{ top: '20%', right: '10%' }} />
        <Floating3DElement delay={2} duration={12} size={12} color="#ec4899" style={{ bottom: '30%', left: '15%' }} />
        <Floating3DElement delay={3} duration={9} size={18} color="#10b981" style={{ top: '50%', right: '20%' }} />
        <Floating3DElement delay={4} duration={11} size={14} color="#f59e0b" style={{ bottom: '10%', right: '30%' }} />
        <Floating3DElement delay={5} duration={13} size={16} color="#ef4444" style={{ top: '70%', left: '25%' }} />
        <Floating3DElement delay={6} duration={7} size={22} color="#3b82f6" style={{ bottom: '20%', right: '15%' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-30"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <h2 className="section-title text-3xl sm:text-4xl md:text-5xl relative">
              Skills & Expertise
            </h2>
          </div>
          <p className={`mt-4 max-w-2xl mx-auto text-lg ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`}>
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        {/* 3D View Mode Toggle */}
        <div className="flex justify-center gap-6 mb-10">
          <Card3D delay={0.2}>
            <motion.button
              onClick={() => setViewMode('grid')}
              whileHover={{ scale: 1.05, rotateZ: 5 }}
              whileTap={{ scale: 0.95, rotateZ: -5 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' 
                  : isDarkMode ? 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20' : 'bg-white/50 backdrop-blur-sm text-dark/70 hover:text-dark border border-primary/20'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: viewMode === 'grid' ? '0 10px 30px rgba(99, 102, 241, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <FiCode className="w-5 h-5" style={{ transform: 'translateZ(10px)' }} />
              <span>Grid View</span>
            </motion.button>
          </Card3D>
          
          <Card3D delay={0.3}>
            <motion.button
              onClick={() => setViewMode('cloud')}
              whileHover={{ scale: 1.05, rotateZ: -5 }}
              whileTap={{ scale: 0.95, rotateZ: 5 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                viewMode === 'cloud' 
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30' 
                  : isDarkMode ? 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20' : 'bg-white/50 backdrop-blur-sm text-dark/70 hover:text-dark border border-primary/20'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: viewMode === 'cloud' ? '0 10px 30px rgba(99, 102, 241, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}
            >
              <FiCpu className="w-5 h-5" style={{ transform: 'translateZ(10px)' }} />
              <span>Skill Cloud</span>
            </motion.button>
          </Card3D>
        </div>

        {/* 3D Category Filter */}
        <div className="mb-10 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max sm:flex-wrap sm:justify-center">
            {categories.map((category, index) => (
              <Card3D key={category.id} delay={0.1 + index * 0.05} color={selectedCategory === category.id ? '#6366f1' : '#4b5563'}>
                <motion.button
                  whileHover={{ scale: 1.05, rotateX: 10, translateZ: 15 }}
                  whileTap={{ scale: 0.95, rotateX: -5 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                      : isDarkMode ? 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20' : 'bg-white/50 backdrop-blur-sm text-dark/70 hover:text-dark border border-primary/20'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    boxShadow: selectedCategory === category.id ? '0 10px 30px rgba(99, 102, 241, 0.4)' : '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  <motion.span 
                    className="text-lg"
                    style={{ transform: 'translateZ(10px)' }}
                    whileHover={{ rotateZ: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.span>
                  <span>{category.label}</span>
                </motion.button>
              </Card3D>
            ))}
          </div>
        </div>

        {/* 3D Skills Display */}
        {viewMode === 'grid' ? (
          <motion.div
            key={selectedCategory + 'grid'}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {getVisibleSkills().map((skill, index) => (
              <Card3D 
                key={skill.name} 
                delay={0.1 + index * 0.05} 
                color={skill.color}
                className="group"
              >
                <motion.div
                  variants={{
                    hidden: { y: 20, opacity: 0, rotateX: -15 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      rotateX: 0,
                      transition: { type: 'spring', stiffness: 100 }
                    }
                  }}
                  onHoverStart={() => setHoveredSkill(skill.name)}
                  onHoverEnd={() => setHoveredSkill(null)}
                  className="relative bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl p-6 border border-primary/20 hover:border-primary/50 transition-all"
                  style={{
                    background: `linear-gradient(135deg, rgba(${skill.color.slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.1), transparent)`,
                    borderColor: skill.color + '40'
                  }}
                >
                  {/* 3D Skill Icon */}
                  <div className="flex justify-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.2, rotateZ: 360 }}
                      transition={{ duration: 0.6 }}
                      className="relative"
                      style={{ transform: 'translateZ(20px)' }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full blur-xl"
                        style={{ 
                          background: `radial-gradient(circle, ${skill.color}40, transparent)`,
                          transform: 'translateZ(-10px)'
                        }}
                      />
                      <img 
                        src={skill.icon} 
                        alt={skill.name}
                        className="w-12 h-12 object-contain relative z-10"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/48/${skill.color.slice(1)}/ffffff?text=${skill.name[0]}` 
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Skill Name */}
                  <motion.h3 
                    className="text-center font-semibold mb-3 text-lg"
                    whileHover={{ scale: 1.05 }}
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    {skill.name}
                  </motion.h3>

                  {/* 3D Progress Bar */}
                  <div className={`relative h-3 rounded-full overflow-hidden mb-3 ${isDarkMode ? 'bg-dark/50' : 'bg-white/50'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ 
                        backgroundColor: skill.color,
                        boxShadow: `0 0 20px ${skill.color}60`
                      }}
                    />
                  </div>

                  {/* Level Percentage */}
                  <div className="flex justify-between text-sm">
                    <span className={isDarkMode ? 'text-light/60' : 'text-dark/60'}>Proficiency</span>
                    <motion.span 
                      style={{ color: skill.color }}
                      whileHover={{ scale: 1.2 }}
                      className="font-bold"
                    >
                      {skill.level}%
                    </motion.span>
                  </div>

                  {/* 3D Hover Details */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: -10, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className={`absolute inset-x-0 -top-20 mx-auto w-max backdrop-blur-lg px-4 py-3 rounded-xl border border-primary/30 ${isDarkMode ? 'bg-dark/95' : 'bg-white/95'}`}
                        style={{
                          boxShadow: `0 10px 30px ${skill.color}40`,
                          transform: 'translateZ(40px)'
                        }}
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <div style={{ color: skill.color }} className="font-bold">{skill.years} years</div>
                          <div className={isDarkMode ? 'text-light/60' : 'text-dark/60'}>•</div>
                          <div>{skill.projects}+ projects</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Card3D>
            ))}
          </motion.div>
        ) : (
          // 3D Skill Cloud View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-6 p-8 min-h-[500px] relative"
          >
            {getVisibleSkills().map((skill, index) => (
              <SkillOrb3D
                key={skill.name}
                skill={skill}
                index={index}
                hoveredSkill={hoveredSkill}
                setHoveredSkill={setHoveredSkill}
                isMobile={isMobile}
              />
            ))}
          </motion.div>
        )}

        {/* 3D Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { value: '25+', label: 'Technologies', icon: <FiCode />, color: '#6366f1' },
            { value: '180+', label: 'Projects', icon: <FiTrendingUp />, color: '#8b5cf6' },
            { value: '5+', label: 'Years', icon: <FiAward />, color: '#ec4899' },
            { value: '30+', label: '3D Worlds', icon: <FiTarget />, color: '#10b981' }
          ].map((stat, i) => (
            <Card3D key={i} delay={0.6 + i * 0.1} color={stat.color}>
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 10 }}
                whileTap={{ scale: 0.95 }}
                className="text-center p-6 bg-gradient-to-b from-primary/10 to-transparent rounded-xl border border-primary/20"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, transparent)`,
                  borderColor: stat.color + '40',
                  boxShadow: `0 0 30px ${stat.color}20`
                }}
              >
                <motion.div
                  className="text-3xl mb-3 mx-auto"
                  style={{ color: stat.color, transform: 'translateZ(20px)' }}
                  whileHover={{ scale: 1.2, rotateZ: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: stat.color, transform: 'translateZ(15px)' }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.div>
                <div className={`text-sm ${isDarkMode ? 'text-light/60' : 'text-dark/60'}`} style={{ transform: 'translateZ(10px)' }}>{stat.label}</div>
              </motion.div>
            </Card3D>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills;