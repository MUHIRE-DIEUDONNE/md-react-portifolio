// src/components/Experience.jsx
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  FiBriefcase, FiMapPin, FiCalendar, FiChevronDown,
  FiArrowUpRight, FiDownload, FiCheckCircle, FiRotateCw, FiGlobe
} from 'react-icons/fi'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/* ─────────────────────────────────────────────
   INJECTED STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  :root {
    --exp-bg:        transparent;
    --exp-surface:   #131210;
    --exp-card:      rgba(22, 20, 16, 0.88);
    --exp-border:    rgba(255,245,220,0.12);
    --exp-border-hi: rgba(212,175,85,0.45);
    --exp-gold:      #d4af55;
    --exp-gold-dim:  rgba(212,175,85,0.2);
    --exp-cream:     #f5eed8;
    --exp-muted:     rgba(245,238,216,0.7);
    --exp-dim:       rgba(245,238,216,0.3);
    --exp-display:   'Playfair Display', Georgia, serif;
    --exp-body:      'Instrument Sans', system-ui, sans-serif;
  }

  .exp-root *, .exp-root *::before, .exp-root *::after {
    box-sizing: border-box;
    margin: 0; padding: 0;
  }

  .exp-root {
    font-family: var(--exp-body);
    background: #030303;
    color: var(--exp-cream);
    -webkit-font-smoothing: antialiased;
    position: relative;
    overflow: hidden;
  }

  /* Grain overlay */
  .exp-root::before {
    content: '';
    position: absolute; inset: 0; z-index: 2; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  /* Scrollbar */
  .exp-root ::-webkit-scrollbar { width: 3px; }
  .exp-root ::-webkit-scrollbar-track { background: transparent; }
  .exp-root ::-webkit-scrollbar-thumb { background: var(--exp-border-hi); border-radius: 4px; }

  /* Filter pill */
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

  /* Card hover */
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

  /* Tech badge */
  .exp-badge {
    padding: 4px 12px; border-radius: 100px; font-size: 10px;
    font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    border: 1px solid; font-family: var(--exp-body);
    transition: transform 0.15s;
    background: rgba(0,0,0,0.4);
  }
  .exp-badge:hover { transform: scale(1.05); }

  /* Index number */
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

  /* Section rule */
  .exp-rule {
    height: 1px;
    background: linear-gradient(90deg, var(--exp-gold) 0%, rgba(212,175,85,0.15) 60%, transparent 100%);
  }

  /* Expand toggle */
  .exp-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-family: var(--exp-body); font-size: 11px;
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    padding: 8px 0; transition: opacity 0.2s;
    color: var(--exp-gold);
  }
  .exp-toggle:hover { opacity: 0.7; }

  /* Stat card */
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

  /* Type badge */
  .exp-type {
    display: inline-block; padding: 3px 10px; border-radius: 100px;
    font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;
    font-family: var(--exp-body);
  }

  @media (max-width: 640px) {
    .exp-index { font-size: 80px; right: 8px; }
  }
`

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   EXPERIENCE CARD
───────────────────────────────────────────── */
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
      style={{ position: 'relative', marginBottom: index < total - 1 ? 20 : 0 }}
    >
      <div className="exp-card">
        <div className="exp-index">{String(index + 1).padStart(2, '0')}</div>

        <div style={{ padding: '28px 28px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0, paddingTop: 6 }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                background: exp.color,
                boxShadow: `0 0 16px ${exp.color}60`,
                border: '3px solid rgba(0,0,0,0.5)',
                flexShrink: 0,
              }} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{
                  fontFamily: 'var(--exp-display)', fontSize: 'clamp(18px, 3vw, 22px)',
                  fontWeight: 700, color: 'var(--exp-cream)', lineHeight: 1.2,
                }}>
                  {exp.company}
                </h3>
                <span className="exp-type" style={{
                  background: exp.typeColor.bg, color: exp.typeColor.text,
                  border: `1px solid ${exp.typeColor.border}`,
                }}>
                  {exp.type}
                </span>
              </div>

              <p style={{
                fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                color: exp.color, marginBottom: 10,
              }}>
                {exp.position}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 14 }}>
                {[
                  { icon: FiCalendar, text: exp.period },
                  { icon: FiMapPin, text: exp.location },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--exp-muted)', fontSize: 12 }}>
                    <Icon size={11} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--exp-muted)', maxWidth: 640, marginBottom: 16 }}>
                {exp.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                {exp.technologies.map(tech => (
                  <span key={tech} className="exp-badge" style={{
                    background: `${exp.color}20`,
                    color: exp.color,
                    borderColor: `${exp.color}60`,
                  }}>
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
                style={{ overflow: 'hidden' }}
              >
                <div style={{
                  marginTop: 20, paddingTop: 20,
                  borderTop: '1px solid var(--exp-border)',
                }}>
                  <p style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--exp-gold)',
                    marginBottom: 14,
                  }}>
                    Key Achievements
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {exp.achievements.map((a, i) => (
                      <motion.li key={i}
                        initial={{ x: -16, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                      >
                        <FiCheckCircle size={13} color={exp.color} style={{ flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 13, color: 'var(--exp-muted)', lineHeight: 1.65 }}>{a}</span>
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

/* ─────────────────────────────────────────────
   GLOBE BACKGROUND COMPONENT (UPDATED - FASTER ROTATION)
───────────────────────────────────────────── */
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
    
    // Scene
    const scene = new THREE.Scene()
    scene.background = null 
    sceneRef.current = scene
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3.2)
    cameraRef.current = camera
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer
    
    // Controls — UPDATED for faster rotation
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 2.5  // ← INCREASED from 0.8 to 2.5 for faster rotation
    controls.enableZoom = false
    controls.enablePan = false
    controls.rotateSpeed = 1.0
    controlsRef.current = controls
    
    // Earth textures
    const textureLoader = new THREE.TextureLoader()
    const earthMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg')
    const earthSpecularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg')
    const earthNormalMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg')
    const cloudMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_clouds_1024.png')
    
    // Earth sphere
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
    
    // Clouds layer
    const cloudGeometry = new THREE.SphereGeometry(1.015, 64, 64)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending
    })
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial)
    scene.add(clouds)
    
    // Stars background
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
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x555555)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 3, 5)
    scene.add(dirLight)
    const backLight = new THREE.PointLight(0x4466cc, 0.5)
    backLight.position.set(-4, 2, -3)
    scene.add(backLight)
    
    // Cities group
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
    
    // Animation loop
    const animate = () => {
      if (controlsRef.current) controlsRef.current.update()
      
      clouds.rotation.y += 0.0003
      earthMesh.rotation.y += 0.0001
      
      renderer.render(scene, camera)
      rafId.current = requestAnimationFrame(animate)
    }
    animate()
    
    // Handle resize
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
  
  return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />
}

/* ─────────────────────────────────────────────
   LIGHT MODE STYLES
───────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
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

  const filtered = filter === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.type === filter)

  return (
    <section id="experience" className="exp-root" style={{ position: 'relative', padding: 'clamp(60px, 8vw, 120px) 0', minHeight: '100vh' }}>
      <style>{STYLES}{lightModeStyles}</style>
      
      {/* 3D Globe Background */}
      <GlobeBackground autoRotate={autoRotate} showCities={showCities} />
      
      {/* Radial overlay to improve content contrast */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(circle at center, rgba(3,3,3,0.2) 0%, rgba(3,3,3,0.85) 85%)',
        pointerEvents: 'none',
        zIndex: 2,
      }} />
      
      {/* Foreground Content Stack */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 clamp(20px, 5vw, 48px)', position: 'relative', zIndex: 10 }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 'clamp(48px, 7vw, 80px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: 'var(--exp-gold)' }} />
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'var(--exp-gold)', fontFamily: 'var(--exp-body)',
            }}>
              Career Timeline
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--exp-display)',
            fontSize: 'clamp(38px, 7vw, 72px)',
            fontWeight: 900, lineHeight: 1.02,
            color: 'var(--exp-cream)', letterSpacing: '-0.02em',
            marginBottom: 18,
          }}>
            Professional<br />
            <em style={{ color: 'var(--exp-gold)', fontStyle: 'italic' }}>Experience</em>
          </h2>

          <p style={{ fontSize: 15, color: 'var(--exp-muted)', maxWidth: 480, lineHeight: 1.7 }}>
            Five years across agencies, startups, and independent labs — building interfaces that move and worlds that breathe.
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12, marginBottom: 'clamp(36px, 5vw, 56px)',
          }}
        >
          {STATS.map((s, i) => (
            <motion.div key={i} className="exp-stat"
              whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div style={{
                fontFamily: 'var(--exp-display)', fontSize: 'clamp(26px, 4vw, 36px)',
                fontWeight: 900, color: 'var(--exp-cream)', lineHeight: 1,
                marginBottom: 6,
              }}>
                <Counter value={s.value} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--exp-dim)' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FILTER ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', gap: 8, marginBottom: 'clamp(28px, 4vw, 44px)', flexWrap: 'wrap' }}
        >
          {FILTERS.map(f => (
            <button key={f.id} className={`exp-pill ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* ── RULE ── */}
        <div className="exp-rule" style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }} />

        {/* ── CARDS ── */}
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

        {/* ── RULE ── */}
        <div className="exp-rule" style={{ margin: 'clamp(32px, 5vw, 52px) 0' }} />

      </div>

      {/* Globe Floating Controls Dashboard */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 30,
        display: 'flex',
        gap: '12px',
        background: 'rgba(12,11,9,0.7)',
        backdropFilter: 'blur(12px)',
        padding: '8px 20px',
        borderRadius: '60px',
        border: '1px solid rgba(212,175,85,0.25)',
        fontFamily: 'var(--exp-body)',
      }}>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            background: 'transparent', border: 'none',
            color: autoRotate ? '#d4af55' : '#f5eed8',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
            padding: '6px 12px', borderRadius: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}
        >
          <FiRotateCw size={12} />
          ROTATION
        </button>
        <button
          onClick={() => setShowCities(!showCities)}
          style={{
            background: 'transparent', border: 'none',
            color: showCities ? '#d4af55' : '#f5eed8',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em',
            padding: '6px 12px', borderRadius: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}
        >
          <FiGlobe size={12} />
          MARKERS
        </button>
      </div>
    </section>
  )
}

export default Experience
