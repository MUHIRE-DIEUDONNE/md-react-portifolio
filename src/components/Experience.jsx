// src/components/Experience.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Experience = () => {
  const [expandedId, setExpandedId] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)

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
      logo: 'https://img.icons8.com/fluency/48/creative-agency.png',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
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
      logo: 'https://img.icons8.com/fluency/48/startup.png',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
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
      logo: 'https://img.icons8.com/fluency/48/design.png',
      image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Experience', icon: '📋', image: 'https://img.icons8.com/fluency/48/resume.png' },
    { id: 'full-time', label: 'Full Time', icon: '💼', image: 'https://img.icons8.com/fluency/48/business.png' },
    { id: 'freelance', label: 'Freelance', icon: '🤝', image: 'https://img.icons8.com/fluency/48/handshake.png' }
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

  const filteredExperiences = selectedFilter === 'all'
    ? experiences
    : experiences.filter(exp => exp.type === selectedFilter)

  return (
    <section id="experience" className="py-16 sm:py-20 bg-dark">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            Work Experience
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto">
            My professional journey and career highlights
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          {filters.map(filter => (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'bg-dark/50 text-light/70 hover:text-light border border-primary/20'
              }`}
            >
              <img src={filter.image} alt={filter.label} className="w-5 h-5" />
              <span>{filter.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          {!isMobile && (
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-secondary to-accent" />
          )}

          {filteredExperiences.map((exp, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex flex-col ${!isMobile ? (isEven ? 'items-start' : 'items-end') : ''} mb-12 last:mb-0`}
              >
                {/* Timeline Dot */}
                {!isMobile && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary z-10">
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                    <img 
                      src={exp.logo} 
                      alt={exp.company}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-dark rounded-full p-1"
                    />
                  </div>
                )}

                {/* Content Card */}
                <div className={`w-full ${!isMobile ? 'md:w-5/12' : ''} ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-primary/20 hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  >
                    {/* Company Image */}
                    <div className="relative h-32 sm:h-40">
                      <img 
                        src={exp.image} 
                        alt={exp.company}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
                      
                      {/* Mobile Logo */}
                      {isMobile && (
                        <img 
                          src={exp.logo} 
                          alt={exp.company}
                          className="absolute bottom-2 left-4 w-10 h-10 bg-dark/80 rounded-full p-2"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: exp.color }}>
                            {exp.company}
                          </h3>
                          <p className="text-base font-semibold text-light">
                            {exp.position}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-primary/20 rounded-full text-xs whitespace-nowrap">
                          {exp.period}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-light/60 mb-3">
                        <img src="https://img.icons8.com/fluency/48/marker.png" alt="Location" className="w-4 h-4" />
                        <span>{exp.location}</span>
                      </div>

                      <p className="text-sm text-light/80 mb-3">
                        {exp.description}
                      </p>

                      {/* Tech Stack Preview */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {exp.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Expand Indicator */}
                      <div className="flex justify-end">
                        <motion.div
                          animate={{ rotate: expandedId === exp.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <img 
                            src="https://img.icons8.com/fluency/48/expand-arrow.png" 
                            alt="Expand"
                            className="w-5 h-5"
                          />
                        </motion.div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {expandedId === exp.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-primary/20 mt-4">
                              <h4 className="text-sm font-semibold mb-3">Key Achievements:</h4>
                              <ul className="space-y-2 mb-4">
                                {exp.achievements.map((ach, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm">
                                    <span className="text-primary mt-1">•</span>
                                    <span className="text-light/80">{ach}</span>
                                  </li>
                                ))}
                              </ul>
                              
                              <h4 className="text-sm font-semibold mb-3">Technologies:</h4>
                              <div className="flex flex-wrap gap-2">
                                {exp.technologies.map((tech, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-primary/20 rounded-full text-xs"
                                    style={{ borderColor: exp.color }}
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Download Resume Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold shadow-lg"
          >
            <img src="https://img.icons8.com/fluency/48/download.png" alt="Download" className="w-5 h-5" />
            Download Full Resume
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Experience