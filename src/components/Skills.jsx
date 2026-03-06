// src/components/Skills.jsx
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'cloud'

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
    ]
  }

  const categories = [
    { id: 'all', label: 'All Skills', icon: '🎯', image: 'https://img.icons8.com/fluency/48/star.png' },
    { id: 'frontend', label: 'Frontend', icon: '💻', image: 'https://img.icons8.com/fluency/48/code.png' },
    { id: 'animation', label: 'Animation', icon: '✨', image: 'https://img.icons8.com/fluency/48/motion.png' },
    { id: 'styling', label: 'Styling', icon: '🎨', image: 'https://img.icons8.com/fluency/48/paint-palette.png' },
    { id: 'backend', label: 'Backend', icon: '⚙️', image: 'https://img.icons8.com/fluency/48/server.png' }
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

  return (
    <section id="skills" className="py-16 sm:py-20 bg-dark">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            Skills & Expertise
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              viewMode === 'grid' ? 'bg-primary text-white' : 'bg-dark/50 text-light/70'
            }`}
          >
            <img src="https://img.icons8.com/fluency/48/grid.png" alt="Grid" className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('cloud')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              viewMode === 'cloud' ? 'bg-primary text-white' : 'bg-dark/50 text-light/70'
            }`}
          >
            <img src="https://img.icons8.com/fluency/48/cloud.png" alt="Cloud" className="w-4 h-4" />
            Skill Cloud
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max sm:flex-wrap sm:justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20'
                }`}
              >
                <img src={category.image} alt={category.label} className="w-5 h-5" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Skills Display */}
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
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {getVisibleSkills().map((skill, index) => (
              <motion.div
                key={skill.name}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 100 }
                  }
                }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                className="relative group"
              >
                <div className="bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all">
                  {/* Skill Icon */}
                  <div className="flex justify-center mb-4">
                    <img 
                      src={skill.icon} 
                      alt={skill.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/48/${skill.color.slice(1)}/ffffff?text=${skill.name[0]}`
                      }}
                    />
                  </div>

                  {/* Skill Name */}
                  <h3 className="text-center font-semibold mb-3">{skill.name}</h3>

                  {/* Progress Bar */}
                  <div className="relative h-2 bg-dark rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>

                  {/* Level Percentage */}
                  <div className="flex justify-between text-xs mt-2">
                    <span className="text-light/60">Proficiency</span>
                    <span style={{ color: skill.color }}>{skill.level}%</span>
                  </div>

                  {/* Hover Details */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-0 -top-16 mx-auto w-max bg-dark/95 backdrop-blur-lg px-4 py-2 rounded-lg border border-primary/30"
                      >
                        <p className="text-sm whitespace-nowrap">
                          <span style={{ color: skill.color }}>{skill.years} years</span> • {skill.projects}+ projects
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // Skill Cloud View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap justify-center gap-4 p-8 min-h-[400px] relative"
          >
            {getVisibleSkills().map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: 'spring',
                  delay: index * 0.05,
                  stiffness: 50
                }}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 5,
                  transition: { type: 'spring', stiffness: 300 }
                }}
                className="relative group cursor-pointer"
                style={{
                  fontSize: `${Math.max(1, skill.level / 15)}rem`,
                  zIndex: hoveredSkill === skill.name ? 10 : 1
                }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                <div className="relative">
                  <span 
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-dark/80 to-dark/60 backdrop-blur-sm border-2 inline-flex items-center gap-2"
                    style={{ borderColor: skill.color }}
                  >
                    <img 
                      src={skill.icon} 
                      alt={skill.name}
                      className="w-6 h-6 object-contain"
                    />
                    {skill.name}
                  </span>
                  
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-dark/95 backdrop-blur-lg px-3 py-1 rounded-lg text-sm whitespace-nowrap border border-primary/30"
                      >
                        {skill.level}% • {skill.years} years
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            { value: '20+', label: 'Technologies', icon: 'https://img.icons8.com/fluency/48/code.png' },
            { value: '150+', label: 'Projects', icon: 'https://img.icons8.com/fluency/48/project.png' },
            { value: '5+', label: 'Years', icon: 'https://img.icons8.com/fluency/48/calendar.png' },
            { value: '30+', label: 'Clients', icon: 'https://img.icons8.com/fluency/48/customer.png' }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-gradient-to-b from-primary/10 to-transparent rounded-xl border border-primary/20">
              <img src={stat.icon} alt={stat.label} className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-xs text-light/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills