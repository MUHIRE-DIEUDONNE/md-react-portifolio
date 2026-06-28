// src/components/Projects.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiGithub } from 'react-icons/fi'

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
      description: 'Classic snake game with smooth controls and retro design.',
      longDescription: 'A fully functional Snake game built with JavaScript. Features smooth keyboard controls, score tracking, increasing difficulty, and a retro pixel art style.',
      technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API'],
      color: '#10b981',
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
      description: 'Endless runner jumping game built with Vue.js.',
      longDescription: 'An exciting endless runner game where you control a character jumping over obstacles. Built with Vue.js featuring smooth animations, score system, and progressively increasing difficulty.',
      technologies: ['Vue.js', 'JavaScript', 'CSS3', 'HTML5'],
      color: '#42b883',
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
      description: 'Real-time language translation tool supporting multiple languages.',
      longDescription: 'A powerful language translator that supports over 100 languages. Features real-time translation, text-to-speech, and a clean intuitive interface.',
      technologies: ['JavaScript', 'API Integration', 'HTML5', 'CSS3'],
      color: '#8b5cf6',
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
      description: 'Currency converter with real-time exchange rates.',
      longDescription: 'A real-time currency converter that fetches live exchange rates. Supports over 150 currencies with a clean, user-friendly interface and historical rate charts.',
      technologies: ['JavaScript', 'API Integration', 'Chart.js', 'Responsive Design'],
      color: '#f59e0b',
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
      description: 'Immersive 3D portfolio with interactive elements and particle systems.',
      longDescription: 'A cutting-edge 3D portfolio featuring interactive 3D models, particle systems, and smooth animations. Built with React Three Fiber and Framer Motion.',
      technologies: ['React', 'Three.js', 'Framer Motion', 'WebGL'],
      color: '#6366f1',
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

  return (
    <section id="projects" className="py-[clamp(60px,8vw,120px)] relative overflow-hidden" style={{ background: '#0c0b09' }}>
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-12%] w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,85,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[8%] right-[-10%] w-[560px] h-[560px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(46,204,154,0.05) 0%, transparent 70%)' }} />
      </div>

      <div className="container-responsive relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[clamp(48px,6vw,72px)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: '#d4af55' }} />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: '#d4af55', fontFamily: "'Instrument Sans', system-ui" }}>
              Portfolio
            </span>
          </div>
          <h2 className="section-title">
            Featured<br />
            <em style={{ color: '#d4af55', fontStyle: 'italic' }}>Projects</em>
          </h2>
          <p className="section-sub">
            A selection of my best work — where creativity meets technical excellence.
          </p>
        </motion.div>

        {/* Rule */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-[clamp(28px,4vw,44px)]"
        >
          {filters.map(f => (
            <button
              key={f.id}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider border transition-all ${
                filter === f.id
                  ? 'bg-[#d4af55] border-[#d4af55] text-[#0c0b09] font-semibold shadow-lg shadow-[#d4af55]/35'
                  : 'border-[rgba(255,245,220,0.07)] bg-transparent text-[rgba(245,238,216,0.42)] hover:border-[rgba(212,175,85,0.35)] hover:text-[#f5eed8]'
              }`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(20px,3vw,32px)]"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="glass-card cursor-pointer group"
              onClick={() => {
                setSelectedProject(project)
                setScreenshotIndex(0)
              }}
            >
              <div className="relative h-[clamp(200px,30vw,260px)] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b09] via-[#0c0b09]/50 to-transparent pointer-events-none" />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border bg-[#0c0b09]/70 backdrop-blur-sm" style={{ borderColor: 'rgba(212,175,85,0.35)', color: '#d4af55' }}>
                  <span className="text-sm">{project.logo}</span>
                  {project.categoryLabel}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[clamp(18px,2.4vw,22px)] font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#f5eed8' }}>
                    {project.title}
                  </h3>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(245,238,216,0.42)' }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[8px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full border" style={{ borderColor: 'rgba(212,175,85,0.35)', background: 'rgba(212,175,85,0.18)', color: '#d4af55' }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-[8px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full border" style={{ borderColor: 'rgba(212,175,85,0.35)', background: 'rgba(212,175,85,0.18)', color: '#d4af55' }}>
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rule */}
        <div className="rule-gold mt-[clamp(40px,5vw,64px)]" />
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-[clamp(16px,4vw,40px)] bg-[#0c0b09]/92 backdrop-blur-lg overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 30, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-[720px] w-full max-h-[90vh] overflow-hidden flex flex-col glass-card"
              style={{ background: 'rgba(22, 20, 16, 0.95)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Carousel */}
              <div className="relative h-[clamp(220px,40vw,360px)] bg-[#0c0b09] flex-shrink-0">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={screenshotIndex}
                    src={selectedProject.screenshots[screenshotIndex]}
                    alt={`Screenshot ${screenshotIndex + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'
                    }}
                  />
                </AnimatePresence>

                {selectedProject.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setScreenshotIndex(prev => prev === 0 ? selectedProject.screenshots.length - 1 : prev - 1)
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0c0b09]/70 backdrop-blur-sm border border-[rgba(255,245,220,0.07)] text-[#f5eed8] flex items-center justify-center text-lg transition-all hover:bg-[#d4af55]/30"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setScreenshotIndex(prev => prev === selectedProject.screenshots.length - 1 ? 0 : prev + 1)
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0c0b09]/70 backdrop-blur-sm border border-[rgba(255,245,220,0.07)] text-[#f5eed8] flex items-center justify-center text-lg transition-all hover:bg-[#d4af55]/30"
                    >
                      ›
                    </button>
                  </>
                )}

                {selectedProject.screenshots.length > 1 && (
                  <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {selectedProject.screenshots.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setScreenshotIndex(i) }}
                        className={`h-1.5 rounded-full transition-all ${
                          i === screenshotIndex ? 'w-6 bg-[#d4af55]' : 'w-1.5 bg-[#f5eed8]/30'
                        }`}
                      />
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-[#0c0b09]/70 backdrop-blur-sm border border-[rgba(255,245,220,0.07)] text-[#f5eed8] flex items-center justify-center text-base transition-all hover:bg-[#d4af55]/30"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-[clamp(20px,4vw,32px)] overflow-y-auto flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <h3 className="text-[clamp(22px,3vw,28px)] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#f5eed8' }}>
                    {selectedProject.title}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-3.5 py-1 rounded-full border" style={{ background: `${selectedProject.color}20`, color: selectedProject.color, borderColor: `${selectedProject.color}50` }}>
                    {selectedProject.categoryLabel}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(245,238,216,0.42)' }}>
                  {selectedProject.longDescription}
                </p>

                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#d4af55' }}>Key Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.features.map((feature, i) => (
                      <span key={i} className="text-[10px] font-medium px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(255,245,220,0.07)', background: 'rgba(212,175,85,0.08)', color: 'rgba(245,238,216,0.42)' }}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#d4af55' }}>Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((tech, i) => (
                      <span key={i} className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1 rounded-full border" style={{ borderColor: 'rgba(212,175,85,0.35)', background: 'rgba(212,175,85,0.18)', color: '#d4af55' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold text-xs py-2.5 px-6"
                  >
                    <FiExternalLink size={14} />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs py-2.5 px-6"
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
