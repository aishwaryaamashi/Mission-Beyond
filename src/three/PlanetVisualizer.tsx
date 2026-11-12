import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetVisualizerProps {
  target: 'Moon' | 'Mars' | 'Asteroid' | 'Earth' | 'Deep Space';
  size?: number;
}

export const PlanetVisualizer: React.FC<PlanetVisualizerProps> = ({
  target,
  size = 1.6
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.12;
    }
  });

  if (target === 'Moon') {
    return (
      <group ref={planetRef}>
        {/* Grey Cratered Moon Body */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial
            color="#8892B0"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      </group>
    );
  }

  if (target === 'Mars') {
    return (
      <group ref={planetRef}>
        {/* Red Rust Martian Sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 48, 48]} />
          <meshStandardMaterial
            color="#C85A32"
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* White Polar Ice Cap */}
        <mesh position={[0, size * 0.95, 0]}>
          <coneGeometry args={[size * 0.35, size * 0.1, 32]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
        </mesh>
      </group>
    );
  }

  if (target === 'Earth') {
    return (
      <group ref={planetRef}>
        {/* Blue Marble Ocean & Continents */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color="#1D4ED8"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        {/* Atmospheric Cloud Layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[size * 1.02, 48, 48]} />
          <meshStandardMaterial
            color="#FFFFFF"
            transparent
            opacity={0.35}
            roughness={1}
          />
        </mesh>
      </group>
    );
  }

  if (target === 'Asteroid') {
    return (
      <group ref={planetRef}>
        {/* Irregular Carbonaceous Asteroid */}
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[size, 1]} />
          <meshStandardMaterial
            color="#475569"
            roughness={0.95}
            metalness={0.2}
            flatShading
          />
        </mesh>
      </group>
    );
  }

  // Deep Space / Kuiper Belt
  return (
    <group ref={planetRef}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[size * 0.9, 32, 32]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.95}
          metalness={0.3}
        />
      </mesh>
      {/* Distant icy dust ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[size * 1.3, size * 1.8, 32]} />
        <meshBasicMaterial color="#64748B" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>
    </group>
  );
};
