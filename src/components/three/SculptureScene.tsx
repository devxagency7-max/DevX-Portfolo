import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AbstractLattice = ({ scrollY }: { scrollY: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { x, y } = state.pointer;

    if (groupRef.current) {
      // Smooth subtle lerp towards pointer & scroll depth
      groupRef.current.rotation.y = time * 0.12 + x * 0.4;
      groupRef.current.rotation.x = time * 0.08 + y * 0.3 + (scrollY * 0.0008);
      groupRef.current.position.y = Math.sin(time * 0.6) * 0.15 - (scrollY * 0.001);
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = -time * 0.25;
      coreRef.current.rotation.z = time * 0.2;
    }

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = time * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[2.2, 0, -1]} scale={1.3}>
      {/* Primary Abstract Architectural Icosahedron */}
      <mesh>
        <icosahedronGeometry args={[1.8, 2]} />
        <meshPhysicalMaterial
          color="#4338CA"
          wireframe
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Computational Solid */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.1, 3]} />
        <meshStandardMaterial
          color="#0F0F11"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Orbital Flowing Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[2.7, 0.015, 16, 120]} />
        <meshStandardMaterial
          color="#059669"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Secondary Orbital Ring */}
      <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <torusGeometry args={[2.9, 0.012, 16, 120]} />
        <meshStandardMaterial
          color="#7C3AED"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

const AmbientParticles = () => {
  const count = 220;
  const pointsRef = useRef<THREE.Points>(null);

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4338CA"
        transparent
        opacity={0.3}
      />
    </points>
  );
};

export const SculptureScene: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2.0} />
        <pointLight position={[-5, 5, 5]} color="#4338CA" intensity={3.5} />
        <pointLight position={[5, -5, -5]} color="#059669" intensity={2.5} />
        
        <AbstractLattice scrollY={scrollY} />
        <AmbientParticles />
      </Canvas>
    </div>
  );
};
