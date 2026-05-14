// src/components/Experience.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiBriefcase, FiUsers, FiAward, FiCalendar, FiMapPin, 
  FiExternalLink, FiCode, FiTrendingUp, FiStar, FiTarget,
  FiCheckCircle, FiClock, FiGlobe, FiSmile
} from 'react-icons/fi'

const Experience = () => {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [hoveredExp, setHoveredExp] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const experiences = [
    {
      id: 1,
      company: 'Creative Agency',
      position: 'Lead Frontend Developer',
      period: '2022 - Present',
      location: 'San Francisco, CA (Remote)',
      description: 'Leading a team of 5 developers in creating immersive web experiences for global brands.',
      achievements: [
        'Architected and deployed a component library used across 10+ projects',
        'Mentored junior developers, resulting in 3 promotions',
        'Introduced Three.js for interactive 3D product showcases'
      ],
      technologies: ['React', 'Three.js', 'GSAP', 'TypeScript'],
      type: 'full-time',
      color: '#6366f1',
      gradient: 'from-indigo-500 to-purple-500',
      icon: 'https://img.icons8.com/fluency/48/creative-agency.png'
    },
    {
      id: 2,
      company: 'Tech Startup',
      position: 'Senior React Developer',
      period: '2020 - 2022',
      location: 'Austin, TX',
      description: 'Developed and maintained multiple React applications with focus on performance and UX.',
      achievements: [
        'Reduced bundle size by 35% through code splitting and lazy loading',
        'Implemented real-time collaborative features using WebSockets',
        'Led the migration from class components to functional with hooks'
      ],
      technologies: ['React', 'Framer Motion', 'Redux', 'Node.js'],
      type: 'full-time',
      color: '#8b5cf6',
      gradient: 'from-purple-500 to-pink-500',
      icon: 'https://img.icons8.com/fluency/48/startup.png'
    },
    {
      id: 3,
      company: 'Digital Studio',
      position: 'Frontend Developer',
      period: '2018 - 2020',
      location: 'New York, NY',
      description: 'Created responsive and interactive websites for various clients.',
      achievements: [
        'Delivered 20+ client projects on time and within budget',
        'Won "Best Interactive Design" award at local hackathon',
        'Developed reusable animation components used company-wide'
      ],
      technologies: ['JavaScript', 'CSS3', 'GSAP', 'PHP'],
      type: 'full-time',
      color: '#ec4899',
      gradient: 'from-pink-500 to-rose-500',
      icon: 'https://img.icons8.com/fluency/48/design.png'
    },
    {
      id: 4,
      company: 'Procedural Worlds Lab',
      position: '3D Graphics Developer',
      period: '2021 - Present',
      location: 'Remote (Global)',
      description: 'Specializing in procedural generation, terrain systems, and interactive 3D worlds.',
      achievements: [
        'Developed real-time terrain generation system using Perlin noise',
        'Created interactive planet rendering with atmospheric effects',
        'Built procedural world generator with biomes and ecosystems'
      ],
      technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'React'],
      type: 'freelance',
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-500',
      icon: 'https://img.icons8.com/fluency/48/globe.png'
    },
    {
      id: 5,
      company: 'Game Dev Studio',
      position: 'WebGL Developer',
      period: '2020 - 2021',
      location: 'Remote',
      description: 'Created browser-based 3D games and interactive experiences using WebGL.',
      achievements: [
        'Built multiplayer 3D game with real-time physics simulation',
        'Developed particle system for visual effects and explosions',
        'Created voxel-based terrain editor with live preview'
      ],
      technologies: ['WebGL', 'Three.js', 'TypeScript', 'Socket.io'],
      type: 'freelance',
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-500',
      icon: 'https://img.icons8.com/fluency/48/3d-modeling.png'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Experience', icon: FiBriefcase, image: 'https://img.icons8.com/fluency/48/resume.png' },
    { id: 'full-time', label: 'Full Time', icon: FiTrendingUp, image: 'https://img.icons8.com/fluency/48/business.png' },
    { id: 'freelance', label: 'Freelance', icon: FiUsers, image: 'https://img.icons8.com/fluency/48/handshake.png' }
  ]

  const stats = [
    { value: '5+', label: 'Years Experience', icon: FiStar, color: '#6366f1' },
    { value: '25+', label: 'Projects Completed', icon: FiCode, color: '#8b5cf6' },
    { value: '15+', label: 'Happy Clients', icon: FiSmile, color: '#10b981' },
    { value: '10+', label: 'Technologies', icon: FiTarget, color: '#f59e0b' }
  ]

  const filteredExperiences = selectedFilter === 'all'
    ? experiences
    : experiences.filter(exp => exp.type === selectedFilter)

  return (
    <section id="experience" className="py-16 sm:py-20 bg-gradient-to-b from-dark via-dark/95 to-dark relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4"
          >
            <FiBriefcase className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Career Journey</span>
          </motion.div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Professional Experience
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto text-lg">
            Journey through my career in web development, 3D graphics, and interactive experiences
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl p-4 text-center border border-primary/20"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-light/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Buttons */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max sm:flex-wrap sm:justify-center">
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20'
                }`}
              >
                <img src={filter.image} alt={filter.label} className="w-5 h-5" />
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {filteredExperiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredExp(exp.id)}
              onHoverEnd={() => setHoveredExp(null)}
              className="relative mb-8"
            >
              {/* Timeline connector */}
              {index !== filteredExperiences.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent hidden md:block" />
              )}

              <div className={`relative bg-gradient-to-br from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                hoveredExp === exp.id ? 'border-primary/50 shadow-xl scale-[1.02]' : 'border-primary/20'
              }`}>
                <div className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Company Icon & Info */}
                    <div className="lg:w-1/3">
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${exp.gradient} p-3 shadow-lg flex-shrink-0`}
                        >
                          <img src={exp.icon} alt={exp.company} className="w-full h-full object-contain" />
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-light">{exp.company}</h3>
                          <p className="text-primary font-medium">{exp.position}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-light/60">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      
                      {/* Technologies */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <motion.span
                            key={tech}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1 text-xs rounded-full border"
                            style={{
                              borderColor: exp.color + '40',
                              color: exp.color,
                              backgroundColor: exp.color + '10'
                            }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Description & Achievements */}
                    <div className="lg:w-2/3">
                      <p className="text-light/80 mb-4 leading-relaxed">
                        {exp.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-light mb-3 flex items-center gap-2">
                          <FiAward style={{ color: exp.color }} />
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, i) => (
                            <motion.li
                              key={i}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-start gap-2 text-sm text-light/70"
                            >
                              <FiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: exp.color }} />
                              <span>{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Expand/Collapse Button */}
                      <motion.button
                        onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: exp.color }}
                      >
                        <FiExternalLink className="w-4 h-4" />
                        {expandedId === exp.id ? 'Show Less' : 'Show More Details'}
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-primary/20"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <h5 className="font-semibold text-light mb-2 flex items-center gap-2">
                              <FiGlobe className="w-4 h-4 text-primary" />
                              Project Highlights
                            </h5>
                            <p className="text-sm text-light/60 leading-relaxed">
                              During my tenure at {exp.company}, I successfully delivered multiple high-impact projects 
                              that significantly improved user engagement and business metrics. My role involved 
                              collaborating with cross-functional teams, implementing best practices, and mentoring 
                              junior developers.
                            </p>
                          </div>
                          <div className={`bg-gradient-to-r ${exp.gradient} rounded-xl p-4 text-center`}>
                            <div className="text-2xl font-bold text-white mb-1">{exp.achievements.length}</div>
                            <div className="text-xs text-white/80">Key Achievements</div>
                            <FiClock className="w-6 h-6 mx-auto mt-2 text-white/60" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Download Resume Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg shadow-primary/30 hover:shadow-xl transition-all"
          >
            <FiCode className="w-5 h-5" />
            <span>Download Full Resume</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FiExternalLink className="w-4 h-4" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience