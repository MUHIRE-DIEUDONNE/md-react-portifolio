// src/components/About.jsx
import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
const About = () => {
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('bio')
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [15, -15]), { damping: 30 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-15, 15]), { damping: 30 })

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseMove = (e) => {
    if (isMobile) return
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const stats = [
    { value: 5, label: 'Years Experience', suffix: '+', icon: '⏳', color: '#6366f1' },
    { value: 50, label: 'Projects Completed', suffix: '+', icon: '🚀', color: '#8b5cf6' },
    { value: 30, label: 'Happy Clients', suffix: '+', icon: '😊', color: '#ec4899' },
    { value: 15, label: 'Awards Won', suffix: '', icon: '🏆', color: '#10b981' }
  ]

  const timeline = [
    { year: '2023', event: 'Lead Developer at Creative Agency', icon: '💼' },
    { year: '2021', event: 'Senior Frontend Developer', icon: '📈' },
    { year: '2019', event: 'Full Stack Developer', icon: '⚡' },
    { year: '2017', event: 'Started Coding Journey', icon: '🚀' }
  ]

  const interests = [
    { emoji: '🎮', name: 'Gaming', image: 'https://img.icons8.com/fluency/48/controller.png' },
    { emoji: '📚', name: 'Reading', image: 'https://img.icons8.com/fluency/48/book.png' },
    { emoji: '🎧', name: 'Music', image: 'https://img.icons8.com/fluency/48/headphones.png' },
    { emoji: '🏋️', name: 'Fitness', image: 'https://img.icons8.com/fluency/48/gym.png' },
    { emoji: '✈️', name: 'Travel', image: 'https://img.icons8.com/fluency/48/airplane-mode-on.png' },
    { emoji: '📸', name: 'Photography', image: 'https://img.icons8.com/fluency/48/camera.png' }
  ]

  const profileImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1494790108777-2f3bdbce8c7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80'
  ]

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % profileImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-dark to-dark/95">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title text-3xl sm:text-4xl md:text-5xl">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Image with 3D tilt */}
          <motion.div
            style={{
              perspective: 1000,
              rotateX,
              rotateY
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative group"
          >
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={profileImages[currentImageIndex]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
              
              {/* Image navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {profileImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentImageIndex ? 'w-6 bg-primary' : 'bg-light/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {[
                { id: 'bio', label: 'Bio', icon: '👤' },
                { id: 'timeline', label: 'Timeline', icon: '📅' },
                { id: 'interests', label: 'Interests', icon: '🎯' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'bg-dark/50 text-light/70 hover:text-light border border-primary/20'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'bio' && (
                <motion.div
                  key="bio"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    Hi, I'm <span className="text-primary">John Doe</span>
                  </h3>
                  <p className="text-sm sm:text-base text-light/80 mb-4 leading-relaxed">
                    A passionate creative developer with 5+ years of experience in building immersive web experiences. 
                    I specialize in React, Three.js, and advanced animations to create websites that not only look 
                    stunning but also provide exceptional user experiences.
                  </p>
                  <p className="text-sm sm:text-base text-light/80 mb-6 leading-relaxed">
                    My journey in web development started with a curiosity for visual effects and has evolved into 
                    a career focused on pushing the boundaries of what's possible on the web. I believe in the power 
                    of animation to tell stories and create memorable digital experiences.
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['React', 'Three.js', 'GSAP', 'Framer', 'TypeScript', 'Node.js'].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 rounded-full text-xs text-primary border border-primary/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Download CV Button */}
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-semibold shadow-lg"
                  >
                    <img 
                      src="https://img.icons8.com/fluency/48/download.png" 
                      alt="Download"
                      className="w-5 h-5"
                    />
                    Download CV
                  </motion.a>
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-dark/30 rounded-xl border border-primary/20"
                    >
                      <div className="text-2xl">{item.icon}</div>
                      <div>
                        <div className="text-primary font-bold">{item.year}</div>
                        <div className="text-light/80 text-sm">{item.event}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'interests' && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                >
                  {interests.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="bg-dark/30 backdrop-blur-sm rounded-xl p-4 text-center border border-primary/20 hover:border-primary/50 transition-all"
                    >
                      <img src={item.image} alt={item.name} className="w-10 h-10 mx-auto mb-2" />
                      <span className="text-xs text-light/80">{item.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Section */}
            <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 bg-gradient-to-b from-dark/50 to-dark/30 backdrop-blur-sm rounded-xl border border-primary/20"
                  style={{ borderColor: stat.color }}
                >
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
                    {statsInView ? (
                      <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                    ) : (
                      `0${stat.suffix}`
                    )}
                  </div>
                  <div className="text-xs text-light/60 mt-1">{stat.label}</div>
                  <div className="text-xl mt-1">{stat.icon}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About