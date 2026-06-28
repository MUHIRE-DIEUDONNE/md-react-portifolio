// src/components/Experience.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FiBriefcase, FiMapPin, FiCalendar, FiChevronDown,
  FiCheckCircle, FiRotateCw, FiGlobe
} from 'react-icons/fi'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Experience = () => {
  const [filter, setFilter] = useState('all')
  const [autoRotate, setAutoRotate] = useState(true)
  const [showCities, setShowCities] = useState(true)
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

  const EXPERIENCES = [
    {
      id: 1,
      company: 'Creative Agency',
      position: 'Lead Frontend Developer',
      period: '2022 – Present',
      location: 'San Francisco, CA (Remote)',
      description: 'Leading a team of 5 developers in crafting immersive web experiences for global brands — from concept to deployment.',
      achievements: [
        'Architected a component library adopted across 10+ client projects',
        'Mentored junior developers, resulting in 3 promotions within the team',
        'Introduced Three.js for interactive 3-D product showcases',
      ],
      technologies: ['React', 'Three.js', 'GSAP', 'TypeScript'],
      type: 'full-time',
      color: '#d4af55',
      typeColor: { bg: 'rgba(212,175,85,0.2)', text: '#d4af55', border: 'rgba(212,175,85,0.4)' },
    },
    {
      id: 2,
      company: 'Tech Startup',
      position: 'Senior React Developer',
      period: '2020 – 2022',
      location: 'Austin, TX',
      description: 'Developed and maintained multiple React applications with relentless focus on performance and delightful UX.',
      achievements: [
        'Reduced bundle size by 35% through code splitting and lazy loading',
        'Implemented real-time collaborative features via WebSockets',
        'Led migration from class components to functional Hooks',
      ],
      technologies: ['React', 'Framer Motion', 'Redux', 'Node.js'],
      type: 'full-time',
      color: '#2ecc9a',
      typeColor: { bg: 'rgba(46,204,154,0.2)', text: '#2ecc9a', border: 'rgba(46,204,154,0.4)' },
    },
    {
      id: 3,
      company: 'Digital Studio',
      position: 'Frontend Developer',
      period: '2018 – 2020',
      location: 'New York, NY',
      description: 'Created responsive, high-conversion websites for diverse clients across fashion, tech, and publishing verticals.',
      achievements: [
        'Delivered 20+ client projects on time and within budget',
        'Won "Best Interactive Design" at local hackathon',
        'Developed reusable animation components adopted company-wide',
      ],
      technologies: ['JavaScript', 'CSS3', 'GSAP', 'PHP'],
      type: 'full-time',
      color: '#e07070',
      typeColor: { bg: 'rgba(224,112,112,0.2)', text: '#e07070', border: 'rgba(224,112,112,0.4)' },
    },
    {
      id: 4,
      company: 'Procedural Worlds Lab',
      position: '3D Graphics Developer',
      period: '2021 – Present',
      location: 'Remote (Global)',
      description: 'Specialising in procedural generation, terrain systems, and interactive 3-D environments for the open web.',
      achievements: [
        'Developed real-time terrain generation using Perlin noise',
        'Built interactive planet rendering with atmospheric shader effects',
        'Created a procedural world generator with biomes and ecosystems',
      ],
      technologies: ['Three.js', 'WebGL', 'GLSL Shaders', 'React'],
      type: 'freelance',
      color: '#7ec8e3',
      typeColor: { bg: 'rgba(126,200,227,0.2)', text: '#7ec8e3', border: 'rgba(126,200,227,0.4)' },
    },
    {
      id: 5,
      company: 'Game Dev Studio',
      position: 'WebGL Developer',
      period: '2020 – 2021',
      location: 'Remote',
      description: 'Pushed the browser as a game platform — real-time physics, particle systems, and multiplayer gameplay.',
      achievements: [
        'Shipped a multiplayer 3-D game with real-time physics simulation',
        'Engineered a GPU particle system for visual FX and explosions',
        'Built a voxel terrain editor with live preview rendering',
      ],
      technologies: ['WebGL', 'Three.js', 'TypeScript', 'Socket.io'],
      type: 'freelance',
      color: '#f0a060',
      typeColor: { bg: 'rgba(240,160,96,0.2)', text: '#f0a060', border: 'rgba(240,160,96,0.4)' },
    },
  ]

  const STATS = [
    { value: '5+', label: 'Years Active' },
    { value: '50+', label: 'Projects Shipped' },
    { value: '30+', label: 'Happy Clients' },
    { value: '10+', label: 'Technologies' },
  ]

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'full-time', label: 'Full-Time' },
    { id: 'freelance', label: 'Freelance' },
  ]

  const Counter = ({ value }) => {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true })
    const num = parseInt(value)
    const suffix = value.replace(/[0-9]/g, '')
    const [display, setDisplay] = useState(0)
    useEffect(() => {
      if (!inView) return
      let i = 0
      const step = 1200 / num
      const t = setInterval(() => {
        i += 1
        setDisplay(i)
        if (i >= num) clearInterval(t)
      }, step)
      return () => clearInterval(t)
    }, [inView, num])
    return <span ref={ref}>{inView ? display : 0}{suffix}</span>
  }

  const ExpCard = ({ exp, index, total }) => {
    const [expanded, setExpanded] = useState(false)
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-60px' })

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${index < total - 1 ? 'mb-5' : ''}`}
      >
        <div className="glass-card p-[clamp(20px,3vw,28px)] relative">
          <div
            className="absolute -top-2.5 right-3 text-[clamp(80px,12vw,140px)] font-black leading-none select-none pointer-events-none"
            style={{ fontFamily: "'Playfair Display', serif", color: 'transparent', WebkitTextStroke: '1px rgba(212,175,85,0.2)' }}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          <div className="flex items-start gap-4 flex-wrap relative z-10">
            <div className="flex-shrink-0 pt-1.5">
              <div
                className="w-3.5 h-3.5 rounded-full border-2 border-[#0c0b09]"
                style={{ background: exp.color, boxShadow: `0 0 16px ${exp.color}60` }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h3
                  className="text-[clamp(18px,3vw,22px)] font-bold leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif", color: '#f5eed8' }}
                >
                  {exp.company}
                </h3>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border"
                  style={{ background: exp.typeColor.bg, color: exp.typeColor.text, borderColor: exp.typeColor.border }}
                >
                  {exp.type}
                </span>
              </div>

              <p className="text-sm font-semibold tracking-[0.04em] mb-2.5" style={{ color: exp.color }}>
                {exp.position}
              </p>

              <div className="flex flex-wrap gap-4 mb-3.5">
                {[
                  { icon: FiCalendar, text: exp.period },
                  { icon: FiMapPin, text: exp.location },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(245,238,216,0.42)' }}>
                    <Icon size={11} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed max-w-[640px] mb-4" style={{ color: 'rgba(245,238,216,0.42)' }}>
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4.5">
                {exp.technologies.map(tech => (
                  <span key={tech} className="badge-gold">{tech}</span>
                ))}
              </div>

              <button
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider bg-none border-none cursor-pointer transition-opacity hover:opacity-70"
                style={{ color: exp.color }}
                onClick={() => setExpanded(e => !e)}
              >
                <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <FiChevronDown size={13} />
                </motion.span>
                {expanded ? 'Hide details' : 'View achievements'}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'rgba(255,245,220,0.07)' }}>
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase mb-3.5" style={{ color: '#d4af55' }}>
                    Key Achievements
                  </p>
                  <ul className="list-none flex flex-col gap-2.5">
                    {exp.achievements.map((a, i) => (
                      <motion.li
                        key={i}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2.5"
                      >
                        <FiCheckCircle size={13} color={exp.color} className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed" style={{ color: 'rgba(245,238,216,0.42)' }}>{a}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // ─── GLOBE BACKGROUND ───────────────────────────────
  const GlobeBackground = ({ autoRotate, showCities }) => {
    const containerRef = useRef(null)
    const controlsRef = useRef(null)
    const sceneRef = useRef(null)
    const cameraRef = useRef(null)
    const rendererRef = useRef(null)
    const citiesGroupRef = useRef(null)
    const rafId = useRef(null)

    useEffect(() => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      const scene = new THREE.Scene()
      scene.background = null
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
      camera.position.set(0, 0, 3.2)
      cameraRef.current = camera

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.autoRotate = autoRotate
      controls.autoRotateSpeed = 2.5
      controls.enableZoom = false
      controls.enablePan = false
      controls.rotateSpeed = 1.0
      controlsRef.current = controls

      const textureLoader = new THREE.TextureLoader()
      const earthMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
      const earthSpecularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg')
      const earthNormalMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg')
      const cloudMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png')

      const earthGeometry = new THREE.SphereGeometry(1, 64, 64)
      const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthMap,
        specularMap: earthSpecularMap,
        specular: new THREE.Color('#333'),
        shininess: 6,
        normalMap: earthNormalMap,
        normalScale: new THREE.Vector2(0.8, 0.8)
      })
      const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
      scene.add(earthMesh)

      const cloudGeometry = new THREE.SphereGeometry(1.015, 64, 64)
      const cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudMap,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending
      })
      const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
      scene.add(clouds)

      const starGeometry = new THREE.BufferGeometry()
      const starCount = 1500
      const starPositions = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount; i++) {
        starPositions[i*3] = (Math.random() - 0.5) * 40
        starPositions[i*3+1] = (Math.random() - 0.5) * 40
        starPositions[i*3+2] = (Math.random() - 0.5) * 40
      }
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.4 })
      const stars = new THREE.Points(starGeometry, starMaterial)
      scene.add(stars)

      const ambientLight = new THREE.AmbientLight(0x555555)
      scene.add(ambientLight)
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
      dirLight.position.set(5, 3, 5)
      scene.add(dirLight)
      const backLight = new THREE.PointLight(0x4466cc, 0.5)
      backLight.position.set(-4, 2, -3)
      scene.add(backLight)

      const citiesGroup = new THREE.Group()
      scene.add(citiesGroup)
      citiesGroupRef.current = citiesGroup

      const citiesData = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
        { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
        { name: 'Austin', lat: 30.2672, lon: -97.7431 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      ]
      function addCityMarker(lat, lon) {
        const phi = (90 - lat) * Math.PI / 180
        const theta = (lon + 180) * Math.PI / 180
        const r = 1.018
        const x = -(r * Math.sin(phi) * Math.sin(theta))
        const y = r * Math.cos(phi)
        const z = r * Math.sin(phi) * Math.cos(theta)
        const markerGeo = new THREE.SphereGeometry(0.015, 8, 8)
        const markerMat = new THREE.MeshBasicMaterial({ color: 0xd4af55 })
        const marker = new THREE.Mesh(markerGeo, markerMat)
        marker.position.set(x, y, z)
        citiesGroup.add(marker)
      }
      citiesData.forEach(city => addCityMarker(city.lat, city.lon))

      const animate = () => {
        if (controlsRef.current) controlsRef.current.update()
        clouds.rotation.y += 0.0003
        earthMesh.rotation.y += 0.0001
        renderer.render(scene, camera)
        rafId.current = requestAnimationFrame(animate)
      }
      animate()

      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
        const w = containerRef.current.clientWidth
        const h = containerRef.current.clientHeight
        cameraRef.current.aspect = w / h
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(w, h)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (rafId.current) cancelAnimationFrame(rafId.current)
        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        rendererRef.current?.dispose()
      }
    }, [])

    useEffect(() => {
      if (controlsRef.current) controlsRef.current.autoRotate = autoRotate
    }, [autoRotate])

    useEffect(() => {
      if (citiesGroupRef.current) citiesGroupRef.current.visible = showCities
    }, [showCities])

    return <div ref={containerRef} className="absolute inset-0 z-1" />
  }

  const filtered = filter === 'all' ? EXPERIENCES : EXPERIENCES.filter(e => e.type === filter)

  return (
    <section id="experience" className="py-[clamp(60px,8vw,120px)] relative overflow-hidden min-h-screen" style={{ background: '#0c0b09' }}>
      <GlobeBackground autoRotate={autoRotate} showCities={showCities} />

      <div
        className="absolute inset-0 z-2 pointer-events-none"
        style={{ background: 'radial-gradient(circle at center, rgba(12,11,9,0.2) 0%, rgba(12,11,9,0.85) 85%)' }}
      />

      <div className="container-responsive relative z-10">
        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[clamp(48px,7vw,80px)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: '#d4af55' }} />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: '#d4af55', fontFamily: "'Instrument Sans', system-ui" }}>
              Career Timeline
            </span>
          </div>
          <h2 className="section-title">
            Professional<br />
            <em style={{ color: '#d4af55', fontStyle: 'italic' }}>Experience</em>
          </h2>
          <p className="section-sub">
            Five years across agencies, startups, and independent labs — building interfaces that move and worlds that breathe.
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-[clamp(36px,5vw,56px)]"
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="glass-card p-5 text-center transition-all hover:-translate-y-1">
              <div className="text-[clamp(26px,4vw,36px)] font-black leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', serif", color: '#f5eed8' }}>
                <Counter value={s.value} />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'rgba(245,238,216,0.3)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FILTERS ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-[clamp(28px,4vw,44px)]"
        >
          {FILTERS.map(f => (
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

        {/* ── RULE ── */}
        <div className="rule-gold mb-[clamp(28px,4vw,40px)]" />

        {/* ── CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={filter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {filtered.map((exp, i) => (
              <ExpCard key={exp.id} exp={exp} index={i} total={filtered.length} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── RULE ── */}
        <div className="rule-gold mt-[clamp(32px,5vw,52px)]" />
      </div>

      {/* ── GLOBE CONTROLS ── */}
      <div
        className="absolute bottom-6 right-6 z-30 flex flex-wrap gap-3 px-5 py-2 rounded-full border border-[rgba(212,175,85,0.25)] backdrop-blur-lg"
        style={{ background: 'rgba(12,11,9,0.7)' }}
      >
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border-none transition-all"
          style={{ color: autoRotate ? '#d4af55' : '#f5eed8', fontFamily: "'Instrument Sans', system-ui" }}
        >
          <FiRotateCw size={12} />
          ROTATION
        </button>
        <button
          onClick={() => setShowCities(!showCities)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border-none transition-all"
          style={{ color: showCities ? '#d4af55' : '#f5eed8', fontFamily: "'Instrument Sans', system-ui" }}
        >
          <FiGlobe size={12} />
          MARKERS
        </button>
      </div>
    </section>
  )
}

export default Experience
