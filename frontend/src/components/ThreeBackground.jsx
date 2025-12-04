import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Floating Energy Orb - Represents unstable Frankenstein energy
 */
function EnergyOrb({ position, color, intensity }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={intensity}
      />
    </Sphere>
  );
}

/**
 * DNA Helix - Represents code structure
 */
function DNAHelix({ position }) {
  const helixRef = useRef();
  const particles = useMemo(() => {
    const temp = [];
    const radius = 2;
    const height = 8;
    const turns = 3;
    
    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * turns * Math.PI * 2;
      const y = (i / 100) * height - height / 2;
      
      // First strand
      temp.push({
        position: [
          Math.cos(t) * radius,
          y,
          Math.sin(t) * radius
        ],
        color: '#39ff14'
      });
      
      // Second strand (opposite)
      temp.push({
        position: [
          Math.cos(t + Math.PI) * radius,
          y,
          Math.sin(t + Math.PI) * radius
        ],
        color: '#8b0000'
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={helixRef} position={position}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Electric Arc - Lightning between points
 */
function ElectricArc({ start, end, active }) {
  const lineRef = useRef();
  
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 2,
        (start[2] + end[2]) / 2
      ),
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current && active) {
      lineRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 5) * 0.2;
    }
  });

  if (!active) return null;

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#39ff14"
        transparent
        opacity={0.5}
        linewidth={2}
      />
    </line>
  );
}

/**
 * Main 3D Background Scene
 * Subtle, non-intrusive, enhances the Frankenstein theme
 */
export default function ThreeBackground({ isActive = false, hasError = false }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.3, // Subtle - doesn't overpower UI
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Ambient lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#39ff14" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b0000" />

        {/* DNA Helix - Left side */}
        <DNAHelix position={[-8, 0, -5]} />

        {/* Energy Orbs */}
        <EnergyOrb 
          position={[6, 2, -3]} 
          color={hasError ? "#ff0040" : "#39ff14"} 
          intensity={isActive ? 1.5 : 0.5}
        />
        <EnergyOrb 
          position={[-6, -2, -3]} 
          color="#8b6321" 
          intensity={0.3}
        />

        {/* Electric Arcs - only when active */}
        <ElectricArc 
          start={[-8, 3, -5]} 
          end={[6, 2, -3]} 
          active={isActive}
        />
        <ElectricArc 
          start={[6, 2, -3]} 
          end={[-6, -2, -3]} 
          active={isActive && !hasError}
        />

        {/* Subtle rotation control (optional) */}
        {/* <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} /> */}
      </Canvas>
    </div>
  );
}

/**
 * Usage in App.jsx:
 * 
 * import ThreeBackground from './components/ThreeBackground';
 * 
 * // Add at the top of your return statement:
 * <ThreeBackground isActive={loading} hasError={error !== null} />
 */
