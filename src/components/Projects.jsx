// src/components/Projects.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiMonitor, FiZap, FiCpu as FiBot, FiExternalLink, FiGithub } from 'react-icons/fi'

/* ─────────────────────────────────────────────
   PREMIUM DARK THEME STYLES
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
`

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [layout, setLayout] = useState('grid')
  const [screenshotIndex, setScreenshotIndex] = useState(0)
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
      logo: 'https://img.icons8.com/fluency/48/game-controller.png'
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
      logo: 'https://img.icons8.com/fluency/48/vue-js.png'
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
      logo: 'https://img.icons8.com/fluency/48/translate.png'
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
      logo: 'https://img.icons8.com/fluency/48/currency-exchange.png'
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
      logo: 'https://img.icons8.com/fluency/48/3d.png'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Projects', icon: <FiStar />, image: 'https://img.icons8.com/fluency/48/star.png' },
    { id: 'game', label: 'Games', icon: <FiMonitor />, image: 'https://img.icons8.com/fluency/48/game-controller.png' },
    { id: 'webapp', label: 'Web Apps', icon: <FiZap />, image: 'https://img.icons8.com/fluency/48/web.png' },
    { id: 'threejs', label: 'Three.js', icon: <FiMonitor />, image: 'https://img.icons8.com/fluency/48/3d.png' }
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
    <section id="projects" className="pj-root py-16 sm:py-20">
      <style>{PREMIUM_STYLES}{lightModeStyles}</style>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--pj-display)', color: 'var(--pj-cream)' }}>
            Featured Projects
          </h2>
          <p className={`mt-4 max-w-2xl mx-auto ${isDarkMode ? 'text-[#f5eed8]/60' : 'text-dark/60'}`}>
            A selection of my best work, showcasing creativity and technical expertise
          </p>
        </motion.div>

        {/* Layout Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setLayout('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
              layout === 'grid' 
                ? 'bg-[#d4af55] text-[#0c0b09]' 
                : isDarkMode ? 'bg-[#131210] text-[#f5eed8]/70' : 'bg-white/50 text-dark/70'
            }`}
          >
            📱 Grid View
          </button>
          <button
            onClick={() => setLayout('horizontal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
              layout === 'horizontal' 
                ? 'bg-[#d4af55] text-[#0c0b09]' 
                : isDarkMode ? 'bg-[#131210] text-[#f5eed8]/70' : 'bg-white/50 text-dark/70'
            }`}
          >
            📜 Horizontal Scroll
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max sm:flex-wrap sm:justify-center">
            {filters.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-gradient-to-r from-[#d4af55] to-[#e0be6a] text-[#0c0b09] shadow-lg'
                    : isDarkMode ? 'bg-[#131210] backdrop-blur-sm text-[#f5eed8]/70 border border-[#d4af55]/20' : 'bg-white/50 text-dark/70 border border-[#d4af55]/20'
                }`}
              >
                <img src={f.image} alt={f.label} className="w-5 h-5" />
                <span>{f.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          key={filter + layout}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className={`grid ${
            layout === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'grid-cols-1 gap-8'
          }`}
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { y: 50, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { type: 'spring', stiffness: 100 }
                }
              }}
              whileHover={!isMobile ? { y: -10 } : {}}
              className="group relative cursor-pointer"
              onClick={() => {
                setSelectedProject(project)
                setScreenshotIndex(0)
              }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className={`relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-xl overflow-hidden ${
                layout === 'horizontal' ? 'w-full max-w-4xl mx-auto' : ''
              }`}>
                {/* Image/Video */}
                <AnimatePresence mode="wait">
                  {hoveredProject === project.id && project.video ? (
                    <motion.video
                      key="video"
                      src={project.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.img
                      key="image"
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/50 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    className="flex items-center gap-2 px-4 py-2 bg-[#131210]/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border"
                    style={{ color: project.color, borderColor: project.color }}
                  >
                    <img src={project.logo} alt={project.categoryLabel} className="w-4 h-4" />
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5eed8] mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#f5eed8]/80 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#d4af55]/20 rounded-full text-xs text-[#f5eed8]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* View Project Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-[#d4af55] text-[#0c0b09] rounded-full text-sm font-semibold"
                  >
                    View Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0b09]/95 backdrop-blur-lg overflow-y-auto"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative max-w-4xl w-full bg-gradient-to-b from-[#131210] to-[#0c0b09] rounded-2xl overflow-hidden my-8 border border-[#d4af55]/20"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Screenshot Carousel */}
                <div className="relative h-[250px] sm:h-[350px] bg-black">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={screenshotIndex}
                      src={selectedProject.screenshots[screenshotIndex]}
                      alt={`Screenshot ${screenshotIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                      }}
                    />
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-[#131210]/80 rounded-full hover:bg-[#d4af55]/80 transition-colors text-[#f5eed8]"
                    onClick={(e) => {
                      e.stopPropagation()
                      setScreenshotIndex((prev) =>
                        prev === 0 ? selectedProject.screenshots.length - 1 : prev - 1
                      )
                    }}
                  >
                    ←
                  </button>
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-[#131210]/80 rounded-full hover:bg-[#d4af55]/80 transition-colors text-[#f5eed8]"
                    onClick={(e) => {
                      e.stopPropagation()
                      setScreenshotIndex((prev) =>
                        prev === selectedProject.screenshots.length - 1 ? 0 : prev + 1
                      )
                    }}
                  >
                    →
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 p-2 bg-[#131210]/80 backdrop-blur-sm rounded-full hover:bg-[#d4af55]/80 transition-colors z-10 text-[#f5eed8]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {selectedProject.screenshots.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === screenshotIndex ? 'w-6 bg-[#d4af55]' : 'bg-[#f5eed8]/50'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setScreenshotIndex(i)
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-[#f5eed8] mb-2">{selectedProject.title}</h3>
                      <span 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af55]/20 rounded-full text-sm"
                        style={{ color: selectedProject.color }}
                      >
                        <img src={selectedProject.logo} alt="" className="w-4 h-4" />
                        {selectedProject.categoryLabel}
                      </span>
                    </div>
                    <div className="text-sm text-[#f5eed8]/60">
                      <p>Duration: {selectedProject.duration}</p>
                      <p>Client: {selectedProject.client}</p>
                    </div>
                  </div>

                  <p className="text-[#f5eed8]/80 mb-6 leading-relaxed">
                    {selectedProject.longDescription}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-[#f5eed8] mb-3">Key Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#d4af55] rounded-full" />
                          <span className="text-[#f5eed8]/80 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-[#f5eed8] mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-[#d4af55]/10 rounded-full text-sm border border-[#d4af55]/30 text-[#f5eed8]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href={selectedProject.live}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-[#d4af55] text-[#0c0b09] rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink /> View Live Demo
                    </motion.a>
                    <motion.a
                      href={selectedProject.github}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-[#131210] border border-[#d4af55]/30 text-[#f5eed8] rounded-lg text-center font-semibold flex items-center justify-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGithub /> View Source Code
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Projects