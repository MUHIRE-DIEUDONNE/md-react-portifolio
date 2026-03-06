// src/components/Projects.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredProject, setHoveredProject] = useState(null)
  const [layout, setLayout] = useState('grid')
  const [screenshotIndex, setScreenshotIndex] = useState(0)

  const projects = [
    {
      id: 1,
      title: '3D Interactive Experience',
      category: 'threejs',
      categoryLabel: 'Three.js',
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-3d-animation-of-moving-shapes-44486-large.mp4',
      description: 'Immersive 3D web experience with real-time interactions and particle systems.',
      longDescription: 'This project showcases advanced WebGL techniques with post-processing effects. Built with React Three Fiber, it features real-time shadows, custom shaders, and a dynamic particle system that responds to user input.',
      technologies: ['React', 'Three.js', 'GSAP', 'WebGL'],
      color: '#6366f1',
      duration: '3 months',
      client: 'Tech Corp',
      features: ['Real-time 3D', 'Particle System', 'Post-processing', 'Mobile Optimized'],
      screenshots: [
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
        'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
        'https://images.unsplash.com/photo-1633356122300-8d6d4c4b4b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
      ],
      github: 'https://github.com',
      live: 'https://example.com',
      logo: 'https://img.icons8.com/fluency/48/3d.png'
    },
    {
      id: 2,
      title: 'Creative Portfolio 2024',
      category: 'animation',
      categoryLabel: 'Animation',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-animated-background-with-flowing-shapes-47986-large.mp4',
      description: 'Award-winning portfolio with cutting-edge animations and smooth transitions.',
      longDescription: 'Winner of Awwwards Site of the Day. Features page transitions powered by Framer Motion, parallax scrolling, and a custom cursor with magnetic effects.',
      technologies: ['React', 'Framer Motion', 'Tailwind', 'GSAP'],
      color: '#8b5cf6',
      duration: '2 months',
      client: 'Personal',
      features: ['Page Transitions', 'Scroll Animations', 'Parallax', '3D Elements'],
      screenshots: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1769&q=80',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
      ],
      github: 'https://github.com',
      live: 'https://example.com',
      logo: 'https://img.icons8.com/fluency/48/design.png'
    },
    {
      id: 3,
      title: 'E-commerce Platform',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-shopping-cart-with-credit-card-32712-large.mp4',
      description: 'Modern e-commerce solution with advanced filtering, cart management, and smooth animations.',
      longDescription: 'Full-stack e-commerce platform with real-time inventory, payment processing, and admin dashboard. Built with MERN stack and Redux for state management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
      color: '#ec4899',
      duration: '6 months',
      client: 'Fashion Brand',
      features: ['Real-time Updates', 'Payment Integration', 'Admin Panel', 'Analytics'],
      screenshots: [
        'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
      ],
      github: 'https://github.com',
      live: 'https://example.com',
      logo: 'https://img.icons8.com/fluency/48/shopping-cart.png'
    },
    {
      id: 4,
      title: 'AI Image Generator',
      category: 'ai',
      categoryLabel: 'AI/ML',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-ai-generated-artificial-intelligence-47713-large.mp4',
      description: 'AI-powered image generation platform with real-time preview and editing capabilities.',
      longDescription: 'Leverages stable diffusion and TensorFlow.js to generate unique images from text prompts. Features real-time preview, style transfer, and image editing tools.',
      technologies: ['React', 'Python', 'TensorFlow.js', 'WebGL'],
      color: '#10b981',
      duration: '4 months',
      client: 'AI Startup',
      features: ['AI Generation', 'Real-time Preview', 'Image Editing', 'Export Options'],
      screenshots: [
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
        'https://images.unsplash.com/photo-1677442135999-0b0b7e8e8e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
      ],
      github: 'https://github.com',
      live: 'https://example.com',
      logo: 'https://img.icons8.com/fluency/48/artificial-intelligence.png'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Projects', icon: '🔮', image: 'https://img.icons8.com/fluency/48/star.png' },
    { id: 'threejs', label: 'Three.js', icon: '🎮', image: 'https://img.icons8.com/fluency/48/3d.png' },
    { id: 'animation', label: 'Animation', icon: '✨', image: 'https://img.icons8.com/fluency/48/motion.png' },
    { id: 'fullstack', label: 'Full Stack', icon: '⚡', image: 'https://img.icons8.com/fluency/48/code.png' },
    { id: 'ai', label: 'AI/ML', icon: '🤖', image: 'https://img.icons8.com/fluency/48/artificial-intelligence.png' }
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

  return (
    <section id="projects" className="py-16 sm:py-20 bg-gradient-to-b from-dark to-dark/95">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            Featured Projects
          </h2>
          <p className="text-light/60 mt-4 max-w-2xl mx-auto">
            A selection of my best work, showcasing creativity and technical expertise
          </p>
        </motion.div>

        {/* Layout Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setLayout('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              layout === 'grid' ? 'bg-primary text-white' : 'bg-dark/50 text-light/70'
            }`}
          >
            <img src="https://img.icons8.com/fluency/48/grid.png" alt="Grid" className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setLayout('horizontal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              layout === 'horizontal' ? 'bg-primary text-white' : 'bg-dark/50 text-light/70'
            }`}
          >
            <img src="https://img.icons8.com/fluency/48/horizontal-line.png" alt="Horizontal" className="w-4 h-4" />
            Horizontal Scroll
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
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-dark/50 backdrop-blur-sm text-light/70 hover:text-light border border-primary/20'
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
                    />
                  )}
                </AnimatePresence>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    className="flex items-center gap-2 px-4 py-2 bg-dark/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium border"
                    style={{ color: project.color, borderColor: project.color }}
                  >
                    <img src={project.logo} alt={project.categoryLabel} className="w-4 h-4" />
                    {project.categoryLabel}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl sm:text-2xl font-bold text-light mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-light/80 mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary/20 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* View Project Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/95 backdrop-blur-lg overflow-y-auto"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                className="relative max-w-4xl w-full bg-gradient-to-b from-dark/90 to-dark rounded-2xl overflow-hidden my-8"
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
                    />
                  </AnimatePresence>

                  {/* Carousel Controls */}
                  <button
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-dark/80 rounded-full hover:bg-primary/80 transition-colors"
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
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-dark/80 rounded-full hover:bg-primary/80 transition-colors"
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
                    className="absolute top-4 right-4 p-2 bg-dark/80 backdrop-blur-sm rounded-full hover:bg-primary/80 transition-colors z-10"
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
                          i === screenshotIndex ? 'w-6 bg-primary' : 'bg-light/50'
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
                      <h3 className="text-2xl sm:text-3xl font-bold mb-2">{selectedProject.title}</h3>
                      <span 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm"
                        style={{ color: selectedProject.color }}
                      >
                        <img src={selectedProject.logo} alt="" className="w-4 h-4" />
                        {selectedProject.categoryLabel}
                      </span>
                    </div>
                    <div className="text-sm text-light/60">
                      <p>Duration: {selectedProject.duration}</p>
                      <p>Client: {selectedProject.client}</p>
                    </div>
                  </div>

                  <p className="text-light/80 mb-6 leading-relaxed">
                    {selectedProject.longDescription}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Key Features:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedProject.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-light/80 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Technologies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-primary/10 rounded-full text-sm border border-primary/30"
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
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-lg text-center font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Live Demo
                    </motion.a>
                    <motion.a
                      href={selectedProject.github}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 px-6 py-3 bg-dark border border-primary/30 text-light rounded-lg text-center font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Source Code
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