// src/components/ThreeHero.jsx
import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'

// ─── Procedural Earth Texture ────────────────────
function useEarthTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')

    const ocean = ctx.createLinearGradient(0, 0, 0, 1024)
    ocean.addColorStop(0,   '#041830')
    ocean.addColorStop(0.3, '#062040')
    ocean.addColorStop(0.7, '#051c38')
    ocean.addColorStop(1,   '#030f20')
    ctx.fillStyle = ocean
    ctx.fillRect(0, 0, 2048, 1024)

    ctx.strokeStyle = 'rgba(0,120,255,0.06)'
    ctx.lineWidth = 1
    for (let i = 0; i < 30; i++) {
      const y = Math.random() * 1024
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke()
    }

    const continents = [
      { pts: [[140,80],[260,70],[300,110],[290,180],[240,220],[200,240],[160,220],[120,180],[100,130]] },
      { pts: [[290,40],[340,30],[360,55],[340,80],[300,85],[275,65]] },
      { pts: [[200,250],[230,245],[240,270],[220,285],[200,275]] },
      { pts: [[230,280],[290,270],[310,320],[300,400],[270,440],[240,450],[210,410],[195,350],[205,300]] },
      { pts: [[470,80],[540,70],[570,100],[560,140],[520,160],[480,155],[455,120]] },
      { pts: [[490,50],[530,40],[545,70],[520,90],[490,85]] },
      { pts: [[480,200],[560,190],[600,230],[610,320],[580,420],[540,460],[490,450],[455,390],[445,300],[455,230]] },
      { pts: [[560,170],[610,160],[640,185],[630,210],[590,215],[560,195]] },
      { pts: [[580,60],[700,45],[820,55],[920,80],[970,120],[950,170],[880,185],[800,175],[720,160],[650,145],[600,120],[575,90]] },
      { pts: [[660,185],[700,180],[720,200],[710,260],[680,280],[655,255],[645,215]] },
      { pts: [[780,200],[820,195],[840,220],[820,250],[790,255],[770,235],[765,210]] },
      { pts: [[870,120],[900,115],[910,135],[895,150],[870,145],[860,130]] },
      { pts: [[790,360],[880,350],[920,380],[910,440],[860,470],[800,465],[760,430],[755,385]] },
      { pts: [[930,440],[950,435],[955,460],[935,470],[920,458]] },
      { pts: [[0,490],[2048,490],[2048,512],[0,512]] },
    ]

    continents.forEach(({ pts }) => {
      if (!pts || pts.length < 3) return
      ctx.save()
      ctx.fillStyle = 'rgba(0,20,10,0.6)'
      ctx.beginPath()
      ctx.moveTo(pts[0][0]+3, pts[0][1]+3)
      pts.forEach(([x,y]) => ctx.lineTo(x+3, y+3))
      ctx.closePath(); ctx.fill()

      const landGrad = ctx.createRadialGradient(pts[0][0], pts[0][1], 0, pts[0][0], pts[0][1], 200)
      landGrad.addColorStop(0,   '#1a6b35')
      landGrad.addColorStop(0.4, '#148030')
      landGrad.addColorStop(0.8, '#0d5522')
      landGrad.addColorStop(1,   '#093d18')
      ctx.fillStyle = landGrad
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      pts.forEach(([x,y]) => ctx.lineTo(x, y))
      ctx.closePath(); ctx.fill()

      ctx.fillStyle = 'rgba(40,200,80,0.18)'
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      pts.slice(0, Math.ceil(pts.length/2)).forEach(([x,y]) => ctx.lineTo(x-4, y-4))
      ctx.closePath(); ctx.fill()

      ctx.strokeStyle = 'rgba(30,255,100,0.25)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(pts[0][0], pts[0][1])
      pts.forEach(([x,y]) => ctx.lineTo(x, y))
      ctx.closePath(); ctx.stroke()
      ctx.restore()
    })

    ctx.strokeStyle = 'rgba(0,180,255,0.07)'
    ctx.lineWidth = 0.8
    for (let i = 0; i <= 12; i++) {
      const y = (i / 12) * 1024
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(2048, y); ctx.stroke()
    }
    for (let i = 0; i <= 24; i++) {
      const x = (i / 24) * 2048
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke()
    }

    const cities = [
      [155,145],[162,152],[170,158],[178,148],
      [495,120],[508,125],[520,118],[530,130],
      [650,148],[670,155],[695,145],[720,140],
      [800,345],[810,350],
      [238,305],[245,310],
      [560,200],[568,195],
    ]
    cities.forEach(([cx,cy]) => {
      const g = ctx.createRadialGradient(cx,cy,0,cx,cy,6)
      g.addColorStop(0,  'rgba(255,230,120,1)')
      g.addColorStop(0.4,'rgba(255,200,80,0.6)')
      g.addColorStop(1,  'rgba(255,180,50,0)')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill()
    })

    return new THREE.CanvasTexture(canvas)
  }, [])
}

function useSpecularTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512; canvas.height = 256
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#1a3a5c'
    ctx.fillRect(0, 0, 512, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
}

// ─── Earth ────────────────────────────────────────
function Earth() {
  const meshRef = useRef()
  const cloudRef = useRef()
  const earthTex = useEarthTexture()
  const specTex  = useSpecularTexture()

  useFrame((_, dt) => {
    if (meshRef.current)  meshRef.current.rotation.y  += dt * 0.055
    if (cloudRef.current) cloudRef.current.rotation.y += dt * 0.065
  })

  return (
    <group>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[2.0, 128, 128]} />
        <meshPhongMaterial map={earthTex} specularMap={specTex} specular={new THREE.Color(0x224466)} shininess={28} />
      </mesh>
      <mesh ref={cloudRef} scale={1.008}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshPhongMaterial color="#ffffff" transparent opacity={0.07} depthWrite={false} />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshPhongMaterial color="#1a7fff" transparent opacity={0.13} side={THREE.FrontSide} depthWrite={false} />
      </mesh>
      <mesh scale={1.14}>
        <sphereGeometry args={[2.0, 48, 48]} />
        <meshBasicMaterial color="#0044cc" transparent opacity={0.055} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[2.18, 0.22, 8, 120]} />
        <meshBasicMaterial color="#1a88ff" transparent opacity={0.055} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Orbit Ring ───────────────────────────────────
function OrbitRing({ radius, tiltX=0, tiltZ=0, color='#d4af55', opacity=0.55, thickness=0.007 }) {
  return (
    <group rotation={[tiltX, 0, tiltZ]}>
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[radius, thickness, 16, 200]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ─── Tech Badge ───────────────────────────────────
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

// ─── Scene ────────────────────────────────────────
function Scene({ mousePosition, orbitSpeed = 1, ringColor = '#d4af55', accentColor = '#2ecc9a', techStack = [] }) {
  const groupRef = useRef()

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime()
    if (groupRef.current && mousePosition) {
      groupRef.current.rotation.x += (mousePosition.y * 0.00015 - groupRef.current.rotation.x) * 0.04
      groupRef.current.rotation.y += (mousePosition.x * 0.00015 - groupRef.current.rotation.y) * 0.04
    }
    camera.position.y += (Math.sin(t * 0.12 * orbitSpeed) * 0.06 - (camera.position.y - 1.0)) * 0.015
  })

  const adjustedTech = techStack.map(t => ({ ...t, speed: t.speed * orbitSpeed }))

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 5, 8]}  intensity={1.8} color="#ffeebb" />
      <directionalLight position={[-5,-3,-5]} intensity={0.3} color="#2244aa" />
      <pointLight position={[0, 6, 4]}  intensity={0.6} color="#4488ff" />
      <pointLight position={[4,-4, 4]}  intensity={0.4} color={ringColor} />
      <pointLight position={[-4, 2,-4]} intensity={0.3} color={accentColor} />

      <Stars radius={80} depth={60} count={2500} factor={3} saturation={0} fade speed={0.5} />
      <Earth />

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

// ─── ThreeHero Component ─────────────────────────
const ThreeHero = ({ mousePosition, orbitSpeed = 1, ringColor = '#d4af55', accentColor = '#2ecc9a', techStack = [] }) => (
  <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
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
