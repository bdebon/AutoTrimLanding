'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [fadeIn, setFadeIn] = useState(0)

  useEffect(() => {
    // Start fade in after a small delay
    const timer = setTimeout(() => {
      setFadeIn(1)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(40, 40, 40, 40) // Much larger grid
    return geo
  }, [])

  // Custom shader for fade effect
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color('#0ea5e9') }, // Primary color
        uOpacity: { value: 0.08 },
        uFadeIn: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uFadeIn;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          // Fade out towards bottom
          float fadeY = smoothstep(-10.0, 10.0, vPosition.y);
          float finalOpacity = uOpacity * fadeY * uFadeIn;
          
          gl_FragColor = vec4(uColor, finalOpacity);
        }
      `,
      transparent: true,
      wireframe: true
    })
  }, [])

  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry) {
      const positions = meshRef.current.geometry.attributes.position
      const time = state.clock.elapsedTime

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i)
        const y = positions.getY(i)
        
        // Create wave effect with multiple frequencies
        const waveX1 = Math.sin(x * 0.2 + time * 0.4) * 0.3
        const waveY1 = Math.sin(y * 0.2 + time * 0.5) * 0.3
        const waveX2 = Math.sin(x * 0.3 + time * 0.3) * 0.15
        const waveY2 = Math.cos(y * 0.25 + time * 0.35) * 0.2
        
        positions.setZ(i, waveX1 + waveY1 + waveX2 + waveY2)
      }
      
      positions.needsUpdate = true
      
      // Autonomous rotation - more subtle
      meshRef.current.rotation.x = -Math.PI / 6 + Math.sin(time * 0.15) * 0.05
      meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.08
    }

    // Animate fade in
    if (material && material.uniforms.uFadeIn.value < fadeIn) {
      material.uniforms.uFadeIn.value += 0.02 // Smooth fade in over ~50 frames
      material.uniforms.uFadeIn.value = Math.min(material.uniforms.uFadeIn.value, 1)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -8]} geometry={geometry} material={material} />
  )
}

function FloatingParticles() {
  const points = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const [fadeIn, setFadeIn] = useState(0)

  useEffect(() => {
    // Start fade in after grid
    const timer = setTimeout(() => {
      setFadeIn(0.2)
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 15
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 5
      temp.push(x, y, z)
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
      
      // Animate particles up and down
      const positions = points.current.geometry.attributes.position
      const time = state.clock.elapsedTime
      
      for (let i = 0; i < positions.count; i++) {
        const baseY = particles[i * 3 + 1]
        positions.setY(i, baseY + Math.sin(time + i) * 0.5)
      }
      positions.needsUpdate = true
    }

    // Animate fade in
    if (materialRef.current && materialRef.current.opacity < fadeIn) {
      materialRef.current.opacity += 0.004 // Even slower fade for particles
      materialRef.current.opacity = Math.min(materialRef.current.opacity, fadeIn)
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.025}
        color="#c084fc"
        transparent
        opacity={0}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#ffffff']} />
      <WaveGrid />
      <FloatingParticles />
    </>
  )
}

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 bg-white">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ 
          antialias: false, 
          alpha: true, 
          powerPreference: "high-performance"
        }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}