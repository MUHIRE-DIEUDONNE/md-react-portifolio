// src/components/Experience.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FiBriefcase, FiMapPin, FiCalendar, FiChevronDown,
  FiCheckCircle, FiRotateCw, FiGlobe
} from 'react-icons/fi'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --exp-bg: transparent;
    --exp-surface: #131210;
    --exp-card: rgba(22, 20, 16, 0.88);
    --exp-border: rgba(255,245,220,0.12);
    --exp-border-hi: rgba(212,175,85,0.45);
    --exp-gold: #d4af55;
    --exp-gold-dim: rgba(212,175,85,0.2);
    --exp-cream: #f5eed8;
    --exp-muted: rgba(245,238,216,0.7);
    --exp-dim: rgba(245,238,216,0.3);
    --exp-display: 'Playfair Display', Georgia, serif;
    --exp-body: 'Instrument Sans', system-ui, sans-serif;
  }

  .exp-root *, .exp-root *::before, .exp-root *::after {
    box-sizing: border-box; margin: 0; padding: 0;
  }

  .exp-root {
    font-family: var(--exp-body);
    background: #030303;
    color: var(--exp-cream);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }

  .exp-root::before {
    content: '';
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .exp-root ::-webkit-scrollbar { width: 3px; }
  .exp-root ::-webkit-scrollbar-track { background: transparent; }
  .exp-root ::-webkit-scrollbar-thumb { background: var(--exp-border-hi); border-radius: 4px; }

  .exp-pill {
    padding: 8px 22px; border-radius: 100px; font-size: 12px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer;
    border: 1px solid var(--exp-border);
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(4px);
    color: var(--exp-muted); font-family: var(--exp-body);
    transition: all 0.22s ease;
  }
  .exp-pill:hover { border-color: var(--exp-border-hi); color: var(--exp-cream); background: rgba(0,0,0,0.7); }
  .exp-pill.active {
    background: var(--exp-gold); border-color: var(--exp-gold);
    color: #0c0b09; font-weight: 600;
    box-shadow: 0 4px 20px rgba(212,175,85,0.35);
  }

  .exp-card {
    border: 1px solid var(--exp-border);
    background: var(--exp-card);
    backdrop-filter: blur(2px);
    border-radius: 20px;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    will-change: transform;
    position: relative; overflow: hidden;
  }
  .exp-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--exp-gold-dim), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .exp-card:hover {
    border-color: var(--exp-border-hi);
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }
  .exp-card:hover::before { opacity: 1; }

  .exp-badge {
    padding: 4px 12px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid; font-family: var(--exp-body);
    transition: transform 0.15s;
    background: rgba(0,0,0,0.4);
  }
  .exp-badge:hover { transform: scale(1.05); }

  .exp-index {
    font-family: var(--exp-display);
    font-size: clamp(80px, 12vw, 140px);
    font-weight: 900; line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(212,175,85,0.2);
    user-select: none; pointer-events: none;
    position: absolute; top: -10px; right: 12px;
    transition: -webkit-text-stroke-color 0.3s;
  }
  .exp-card:hover .exp-index { -webkit-text-stroke-color: rgba(212,175,85,0.35); }

  .exp-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--exp-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  .exp-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-family: var(--exp-body); font-size: 11px;
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 8px 0; transition: opacity 0.2s;
    color: var(--exp-gold);
  }
  .exp-toggle:hover { opacity: 0.7; }

  .exp-stat {
    border: 1px solid var(--exp-border);
    border-radius: 16px; padding: 20px 16px;
    text-align: center;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(6px);
    transition: border-color 0.25s, background 0.25s;
    position: relative; overflow: hidden;
  }
  .exp-stat:hover {
    border-color: var(--exp-border-hi);
    background: rgba(212,175,85,0.12);
  }

  .exp-type {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    font-family: var(--exp-body);
  }

  @media (max-width: 640px) {
    .exp-index { font-size: 80px; right: 8px; }
  }
`

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
    let start = 0
    const end = num
    const dur = 1200
    const step = dur / end
    const timer = setInterval(() => {
      start += 1
      setDisplay(start)
      if (start >= end) clearInterval(timer)
    }, step)
    return () => clearInterval(timer)
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
      <div className="exp-card">
        <div className="exp-index">{String(index + 1).padStart(2, '0')}</div>

        <div className="p-[clamp(20px,3vw,28px)] relative z-10">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-shrink-0 pt-1.5">
              <div className="w-3.5 h-3.5 rounded-full border-[3px] border-black/50" style={{ background: exp.color, boxShadow: `0 0 16px ${exp.color}60` }} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h3 className="text-[clamp(18px,3vw,22px)] font-bold leading-tight" style={{ fontFamily: 'var(--exp-display)', color: 'var(--exp-cream)' }}>
                  {exp.company}
                </h3>
                <span className="exp-type" style={{ background: exp.typeColor.bg, color: exp.typeColor.text, border: `1px solid ${exp.typeColor.border}` }}>
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
                  <div key={text} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--exp-muted)' }}>
                    <Icon size={11} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm leading-relaxed max-w-[640px] mb-4" style={{ color: 'var(--exp-muted)' }}>
                {exp.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4.5">
                {exp.technologies.map(tech => (
                  <span key={tech} className="exp-badge" style={{ background: `${exp.color}20`, color: exp.color, borderColor: `${exp.color}60` }}>
                    {tech}
                  </span>
                ))}
              </div>

              <button className="exp-toggle" style={{ color: exp.color }} onClick={() => setExpanded(e => !e)}>
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
                <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--exp-border)' }}>
                  <p className="text-[9px] font-bold tracking-[0.14em] uppercase mb-3.5" style={{ color: 'var(--exp-gold)' }}>
                    Key Achievements
                  </p>
                  <ul className="list-none flex flex-col gap-2.5">
                    {exp.achievements.map((a, i) => (
                      <motion.li key={i}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="flex items-start gap-2.5"
                      >
                        <FiCheckCircle size={13} color={exp.color} className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed" style={{ color: 'var(--exp-muted)' }}>{a}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

const GlobeBackground = ({ autoRotate, showCities }) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
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

const lightModeStyles = `
  html.light-mode .exp-root {
    --exp-bg: #ffffff;
    --exp-surface: #f8fafc;
    --exp-card: rgba(255, 255, 255, 0.95);
    --exp-border: rgba(0, 0, 0, 0.1);
    --exp-border-hi: rgba(99, 102, 241, 0.3);
    --exp-gold: #6366f1;
    --exp-gold-dim: rgba(99, 102, 241, 0.1);
    --exp-cream: #0f172a;
    --exp-muted: rgba(15, 23, 42, 0.7);
    --exp-dim: rgba(15, 23, 42, 0.5);
  }
  html.light-mode .exp-root::before {
    opacity: 0.1;
  }
`

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

  const filtered = filter === 'all' ? EXPERIENCES : EXPERIENCES.filter(e => e.type === filter)

  return (
    <section id="experience" className="exp-root relative min-h-screen py-[clamp(60px,8vw,120px)]">
      <style>{STYLES}{lightModeStyles}</style>
      
      <GlobeBackground autoRotate={autoRotate} showCities={showCities} />
      
      <div className="absolute inset-0 z-2 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(3,3,3,0.2) 0%, rgba(3,3,3,0.85) 85%)' }} />
      
      <div className="container-responsive relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[clamp(48px,7vw,80px)]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-px" style={{ background: 'var(--exp-gold)' }} />
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: 'var(--exp-gold)', fontFamily: 'var(--exp-body)' }}>
              Career Timeline
            </span>
          </div>
          <h2 className="section-title">
            Professional<br />
            <em style={{ color: 'var(--exp-gold)', fontStyle: 'italic' }}>Experience</em>
          </h2>
          <p className="section-sub">
            Five years across agencies, startups, and independent labs — building interfaces that move and worlds that breathe.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-[clamp(36px,5vw,56px)]"
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="exp-stat" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div className="text-[clamp(26px,4vw,36px)] font-black leading-none mb-1.5" style={{ fontFamily: 'var(--exp-display)', color: 'var(--exp-cream)' }}>
                <Counter value={s.value} />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--exp-dim)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-[clamp(28px,4vw,44px)]"
        >
          {FILTERS.map(f => (
            <button key={f.id} className={`exp-pill ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Rule */}
        <div className="exp-rule mb-[clamp(28px,4vw,40px)]" />

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div key={filter}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {filtered.map((exp, i) => (
              <ExpCard key={exp.id} exp={exp} index={i} total={filtered.length} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Rule */}
        <div className="exp-rule mt-[clamp(32px,5vw,52px)]" />
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex gap-3 px-5 py-2 rounded-full border border-[rgba(212,175,85,0.25)] backdrop-blur-lg" style={{ background: 'rgba(12,11,9,0.7)' }}>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border-none transition-all"
          style={{ color: autoRotate ? '#d4af55' : '#f5eed8', fontFamily: 'var(--exp-body)' }}
        >
          <FiRotateCw size={12} />
          ROTATION
        </button>
        <button
          onClick={() => setShowCities(!showCities)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide border-none transition-all"
          style={{ color: showCities ? '#d4af55' : '#f5eed8', fontFamily: 'var(--exp-body)' }}
        >
          <FiGlobe size={12} />
          MARKERS
        </button>
      </div>
    </section>
  )
}

export default Experience
