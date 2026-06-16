// src/components/ThreeHero.jsx
import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ─── Texture generation (unchanged) ─── */
function useEarthTexture() { /* ... same as before ... */ }
function useSpecularTexture() { /* ... same as before ... */ }

/* ─── Earth (unchanged) ─── */
function Earth() { /* ... same as before ... */ }

/* ─── OrbitRing (unchanged) ─── */
function OrbitRing({ radius, tiltX=0, tiltZ=0, color='#d4af55', opacity=0.55, thickness=0.007 }) {
  // same implementation
}

/* ─── TechBadge ─── */
function TechBadge({ label, color, radius, speed, phase, tiltX=0 }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase
    const x = Math.cos(t) * radius
    const z = Math.sin(t) * radius
    const y = Math.sin(t) * radius * Math.tan(tiltX) * 0.3
    if (ref.current) ref.current.position.set(x, y, z)
  })

  return (
    <group ref={ref}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#fff' : color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      <Html center distanceFactor={10} zIndexRange={[0,0]}>
        <div style={{
          padding: '5px 14px',
          borderRadius: 999,
          background: hovered ? `${color}33` : 'rgba(5,12,28,0.88)',
          border: `1.5px solid ${hovered ? color : color+'88'}`,
          color: hovered ? '#fff' : '#cde',
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'none',
          letterSpacing: '0.5px',
          transition: 'all 0.2s',
          boxShadow: hovered ? `0 0 18px ${color}88` : 'none',
          fontFamily: 'monospace',
          transform: 'translateY(-22px)',
        }}>
          {label}
        </div>
      </Html>
    </group>
  )
}

/* ─── Main Scene (now accepts props) ─── */
function Scene({ 
  mousePosition, 
  orbitSpeed = 1,        // global speed multiplier
  ringColor = '#d4af55', 
  accentColor = '#2ecc9a',
  techStack = defaultTechStack 
}) {
  const groupRef = useRef()

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current && mousePosition) {
      groupRef.current.rotation.x += (mousePosition.y * 0.00015 - groupRef.current.rotation.x) * 0.04
      groupRef.current.rotation.y += (mousePosition.x * 0.00015 - groupRef.current.rotation.y) * 0.04
    }
    camera.position.y += (Math.sin(t * 0.12 * orbitSpeed) * 0.06 - (camera.position.y - 1.0)) * 0.015
  })

  // Tech badges with individual speeds multiplied by orbitSpeed
  const adjustedTech = techStack.map(t => ({
    ...t,
    speed: t.speed * orbitSpeed,
  }))

  return (
    <group ref={groupRef}>
      {/* Lighting unchanged */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 5, 8]}  intensity={1.8} color="#ffeebb" />
      <directionalLight position={[-5,-3,-5]} intensity={0.3} color="#2244aa" />
      <pointLight position={[0, 6, 4]}  intensity={0.6} color="#4488ff" />
      <pointLight position={[4,-4, 4]}  intensity={0.4} color={ringColor} />
      <pointLight position={[-4, 2,-4]} intensity={0.3} color={accentColor} />

      <Stars radius={80} depth={60} count={2500} factor={3} saturation={0} fade speed={0.5} />
      <Earth />

      {/* Rings with customizable colors */}
      <OrbitRing radius={2.75} tiltX={0.28}  tiltZ={0.05}  color={ringColor} opacity={0.7}  thickness={0.008} />
      <OrbitRing radius={3.15} tiltX={0.18}  tiltZ={-0.08} color={ringColor} opacity={0.5}  thickness={0.006} />
      <OrbitRing radius={3.55} tiltX={0.35}  tiltZ={0.12}  color={ringColor} opacity={0.38} thickness={0.005} />
      <OrbitRing radius={2.45} tiltX={-0.22} tiltZ={0.15}  color={accentColor} opacity={0.35} thickness={0.005} />
      <OrbitRing radius={3.85} tiltX={-0.15} tiltZ={-0.1}  color={accentColor} opacity={0.22} thickness={0.004} />

      {adjustedTech.map((t, i) => (
        <TechBadge key={i} {...t} />
      ))}
    </group>
  )
}

// Default tech stack (can be overridden via props)
const defaultTechStack = [
  { label: 'React',          color: '#61dafb', radius: 3.1, speed: 0.38, phase: 0,   tiltX: 0.3 },
  { label: 'Three.js',       color: '#049EF4', radius: 3.4, speed: 0.30, phase: 1.2, tiltX: 0.2 },
  { label: 'Node.js',        color: '#68A063', radius: 3.2, speed: 0.34, phase: 2.4, tiltX: 0.4 },
  { label: 'TypeScript',     color: '#3178C6', radius: 3.5, speed: 0.28, phase: 3.6, tiltX: 0.1 },
  { label: 'JavaScript',     color: '#f7df1e', radius: 3.0, speed: 0.42, phase: 4.8, tiltX: 0.35},
  { label: 'Tailwind',       color: '#06B6D4', radius: 3.6, speed: 0.26, phase: 0.6, tiltX: 0.25},
  { label: 'MongoDB',        color: '#47A248', radius: 3.3, speed: 0.36, phase: 1.8, tiltX: 0.45},
  { label: 'GSAP',           color: '#88CE02', radius: 3.7, speed: 0.24, phase: 3.0, tiltX: 0.15},
  { label: 'GraphQL',        color: '#E10098', radius: 3.2, speed: 0.40, phase: 5.4, tiltX: 0.5 },
  { label: 'Next.js',        color: '#ffffff', radius: 3.5, speed: 0.32, phase: 6.0, tiltX: 0.28},
  { label: 'Python',         color: '#3776AB', radius: 3.8, speed: 0.22, phase: 2.2, tiltX: 0.38},
  { label: 'WebGL',          color: '#990000', radius: 3.4, speed: 0.35, phase: 4.2, tiltX: 0.22},
]

/* ─── Export component with props ─── */
const ThreeHero = ({ 
  mousePosition, 
  orbitSpeed = 1, 
  ringColor = '#d4af55', 
  accentColor = '#2ecc9a',
  techStack = defaultTechStack,
  className = '',
}) => (
  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} className={className}>
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 1.0, 6.5], fov: 55, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <fog attach="fog" args={['#0c0b09', 20, 60]} />
      <Scene 
        mousePosition={mousePosition} 
        orbitSpeed={orbitSpeed}
        ringColor={ringColor}
        accentColor={accentColor}
        techStack={techStack}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.35}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3.2}
      />
    </Canvas>
  </div>
)

export default ThreeHero
