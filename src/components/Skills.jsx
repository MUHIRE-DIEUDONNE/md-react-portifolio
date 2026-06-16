// src/components/Skills.jsx
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ThreeHero from './ThreeHero'

// ─── useTheme hook (inline) ────────────────────
const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      const html = document.documentElement
      setIsDarkMode(!html.classList.contains('light-mode'))
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

// ─── Styles ──────────────────────────────────────
const PREMIUM_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  .skills-globe-root {
    position: relative;
    min-height: 100vh;
    background: #0c0b09;
    color: #f5eed8;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .skills-globe-root .globe-title {
    position: absolute;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    text-align: center;
    pointer-events: none;
  }

  .skills-globe-root .globe-title h2 {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(2rem, 6vw, 4rem);
    margin-bottom: 0.25rem;
    background: linear-gradient(135deg, #d4af55, #f5eed8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 40px rgba(212,175,85,0.3);
  }

  .skills-globe-root .globe-title p {
    color: rgba(245,238,216,0.6);
    font-size: 1rem;
    letter-spacing: 0.1em;
  }

  /* Optional filter overlay (remove if not needed) */
  .skills-globe-root .filter-overlay {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    pointer-events: none;
  }

  .skills-globe-root .filter-overlay button {
    pointer-events: auto;
    padding: 0.5rem 1.25rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 500;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    border: 1px solid rgba(212,175,85,0.25);
    background: rgba(12,11,9,0.6);
    backdrop-filter: blur(8px);
    color: rgba(245,238,216,0.7);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .skills-globe-root .filter-overlay button:hover {
    border-color: #d4af55;
    color: #fff;
    background: rgba(212,175,85,0.15);
  }

  .skills-globe-root .filter-overlay button.active {
    background: #d4af55;
    border-color: #d4af55;
    color: #0c0b09;
    font-weight: 600;
  }
`

// ─── Main Component ────────────────────────────
const Skills = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [threeReady, setThreeReady] = useState(false)
  const isDarkMode = useTheme()

  // ─── Optional category filter state ──────────
  const [selectedCategory, setSelectedCategory] = useState('all')

  // ─── Custom tech stack for the globe ──────────
  const allTech = [
    { label: 'React',          color: '#61dafb', radius: 3.1, speed: 0.38, phase: 0,   tiltX: 0.3 },
    { label: 'Three.js',       color: '#049EF4', radius: 3.4, speed: 0.30, phase: 1.2, tiltX: 0.2 },
    { label: 'Node.js',        color: '#68A063', radius: 3.2, speed: 0.34, phase: 2.4, tiltX: 0.4 },
    { label: 'TypeScript',     color: '#3178C6', radius: 3.5, speed: 0.28, phase: 3.6, tiltX: 0.1 },
    { label: 'JavaScript',     color: '#f7df1e', radius: 3.0, speed: 0.42, phase: 4.8, tiltX: 0.35 },
    { label: 'Tailwind',       color: '#06B6D4', radius: 3.6, speed: 0.26, phase: 0.6, tiltX: 0.25 },
    { label: 'MongoDB',        color: '#47A248', radius: 3.3, speed: 0.36, phase: 1.8, tiltX: 0.45 },
    { label: 'GSAP',           color: '#88CE02', radius: 3.7, speed: 0.24, phase: 3.0, tiltX: 0.15 },
    { label: 'GraphQL',        color: '#E10098', radius: 3.2, speed: 0.40, phase: 5.4, tiltX: 0.5  },
    { label: 'Next.js',        color: '#ffffff', radius: 3.5, speed: 0.32, phase: 6.0, tiltX: 0.28 },
    { label: 'Python',         color: '#3776AB', radius: 3.8, speed: 0.22, phase: 2.2, tiltX: 0.38 },
    { label: 'WebGL',          color: '#990000', radius: 3.4, speed: 0.35, phase: 4.2, tiltX: 0.22 },
    { label: 'Svelte',         color: '#FF3E00', radius: 3.9, speed: 0.20, phase: 1.0, tiltX: 0.45 },
    { label: 'Docker',         color: '#2496ED', radius: 3.0, speed: 0.44, phase: 3.2, tiltX: 0.18 },
    { label: 'AWS',            color: '#FF9900', radius: 3.3, speed: 0.33, phase: 5.0, tiltX: 0.40 },
    { label: 'Figma',          color: '#F24E1E', radius: 3.6, speed: 0.27, phase: 2.8, tiltX: 0.30 },
  ]

  // ─── Category groups (for filtering) ──────────
  // If you want to filter the badges by category, you can implement a mapping here.
  // For simplicity, we keep all badges visible.
  // You can remove the filter buttons entirely if you don't need them.

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'tools', label: 'Tools' },
  ]

  // ─── Filter logic (optional) ──────────────────
  // Example: filter based on category – you'd need to tag each tech with a category.
  // For now, we keep all.
  const filteredTech = allTech // you can apply filtering here

  // Globe parameters
  const orbitSpeed = 0.8
  const ringColor = '#d4af55'
  const accentColor = '#2ecc9a'

  // ─── Mouse tracking ────────────────────────────
  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 })
    window.addEventListener('mousemove', onMove)
    const t = setTimeout(() => setThreeReady(true), 400)
    return () => {
      window.removeEventListener('mousemove', onMove)
      clearTimeout(t)
    }
  }, [])

  return (
    <section id="skills" className="skills-globe-root">
      <style>{PREMIUM_STYLES}</style>

      {/* ─── 3D Globe Background ─── */}
      {threeReady && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ThreeHero
            mousePosition={mouse}
            orbitSpeed={orbitSpeed}
            ringColor={ringColor}
            accentColor={accentColor}
            techStack={filteredTech}
          />
        </div>
      )}

      {/* ─── Overlay Content ─── */}
      <div className="globe-title">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Skills &amp; Expertise
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Technologies orbiting my universe
        </motion.p>
      </div>

      {/* ─── Optional Filter (can be removed) ─── */}
      <div className="filter-overlay">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={selectedCategory === cat.id ? 'active' : ''}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  )
}

export default Skills
