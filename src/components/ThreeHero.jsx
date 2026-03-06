import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Float, MeshDistortMaterial } from '@react-three/drei'

const FloatingShapes = ({ mousePosition }) => {
  const groupRef = useRef()
  const sphereRef = useRef()
  const torusRef = useRef()
  const cubeRef = useRef()

  useFrame(({ clock, viewport }) => {
    const time = clock.getElapsedTime()
    
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1
      
      // Mouse interaction
      if (mousePosition) {
        groupRef.current.rotation.x += mousePosition.y * 0.0005
        groupRef.current.rotation.y += mousePosition.x * 0.0005
      }
    }

    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(time * 2) * 0.5
    }

    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01
      torusRef.current.rotation.y += 0.02
    }

    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01
      cubeRef.current.rotation.y += 0.02
      cubeRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#6366f1"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            emissive="#6366f1"
            emissiveIntensity={0.5}
          />
        </mesh>
      </Float>

      {/* Orbiting Torus */}
      <mesh ref={torusRef} position={[2.5, 1, -1]}>
        <torusGeometry args={[0.8, 0.2, 32, 64]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.3} />
      </mesh>

      {/* Rotating Cube */}
      <mesh ref={cubeRef} position={[-2, -1, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.3} wireframe />
      </mesh>

      {/* Small Floating Cubes */}
      {[-2, 2].map((x, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <mesh position={[x, 2, -2]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

const ThreeHero = ({ isLoaded, mousePosition }) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
      
      <FloatingShapes mousePosition={mousePosition} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}

export default ThreeHero