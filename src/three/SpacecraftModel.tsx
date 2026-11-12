import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpacecraftComponent } from '../types/game';

interface SpacecraftModelProps {
  components: SpacecraftComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string) => void;
  hoveredComponentId?: string | null;
  onHoverComponent?: (componentId: string | null) => void;
  isSimulating?: boolean;
}

export const SpacecraftModel: React.FC<SpacecraftModelProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  hoveredComponentId,
  onHoverComponent,
  isSimulating = false
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Subtle realistic attitude drift / thruster stabilization in simulation mode
  useFrame((state, delta) => {
    if (groupRef.current) {
      if (isSimulating) {
        groupRef.current.rotation.y += delta * 0.15;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      } else {
        // Slow gentle turntable rotation when idle
        groupRef.current.rotation.y += delta * 0.05;
      }
    }
  });

  // Aerospace materials
  const materials = useMemo(() => {
    return {
      // Golden Multi-Layer Insulation (MLI) foil
      goldMli: new THREE.MeshStandardMaterial({
        color: '#D4AF37',
        roughness: 0.25,
        metalness: 0.85,
        bumpScale: 0.05
      }),
      // Carbon-fiber composite structural frame
      carbonComposite: new THREE.MeshStandardMaterial({
        color: '#1B2232',
        roughness: 0.5,
        metalness: 0.4
      }),
      // Titanium engine alloy
      titanium: new THREE.MeshStandardMaterial({
        color: '#64748B',
        roughness: 0.35,
        metalness: 0.8
      }),
      // Photovoltaic solar cells (deep metallic blue)
      solarCell: new THREE.MeshStandardMaterial({
        color: '#0A2540',
        roughness: 0.15,
        metalness: 0.9,
        emissive: '#031726',
        emissiveIntensity: 0.2
      }),
      // Solar panel gold foil back
      solarBack: new THREE.MeshStandardMaterial({
        color: '#B48A14',
        roughness: 0.4,
        metalness: 0.7
      }),
      // Thermal radiator white high-emissivity coating
      thermalWhite: new THREE.MeshStandardMaterial({
        color: '#F1F5F9',
        roughness: 0.1,
        metalness: 0.1
      }),
      // Parabolic antenna dish reflector (anodized white/silver)
      dishReflector: new THREE.MeshStandardMaterial({
        color: '#E2E8F0',
        roughness: 0.2,
        metalness: 0.6
      }),
      // Optical sensor glass / aperture
      opticalAperture: new THREE.MeshStandardMaterial({
        color: '#0284C7',
        roughness: 0.05,
        metalness: 0.95,
        emissive: '#0369A1',
        emissiveIntensity: 0.4
      }),
      // RTG radioactive fin casing
      rtgCasing: new THREE.MeshStandardMaterial({
        color: '#334155',
        roughness: 0.7,
        metalness: 0.5
      }),
      // Highlight outline material
      selectedGlow: new THREE.MeshBasicMaterial({
        color: '#06B6D4',
        wireframe: true
      }),
      hoverGlow: new THREE.MeshBasicMaterial({
        color: '#F59E0B',
        wireframe: true
      })
    };
  }, []);

  return (
    <group ref={groupRef}>
      {components.map((comp) => {
        const isSelected = selectedComponentId === comp.id;
        const isHovered = hoveredComponentId === comp.id;
        const pos = comp.mountPosition || [0, 0, 0];

        return (
          <group
            key={comp.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent(comp.id);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHoverComponent?.(comp.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              onHoverComponent?.(null);
            }}
          >
            {renderComponentGeometry(comp, materials)}

            {/* Selection / Hover Indicator */}
            {(isSelected || isHovered) && (
              <mesh>
                <boxGeometry args={[1.2, 1.2, 1.2]} />
                <primitive object={isSelected ? materials.selectedGlow : materials.hoverGlow} attach="material" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

function renderComponentGeometry(
  comp: SpacecraftComponent,
  mat: Record<string, THREE.Material>
) {
  switch (comp.meshType) {
    case 'bus_cube':
      return (
        <group>
          {/* Main Gold MLI Bus Core */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.0, 1.2, 1.0]} />
            <primitive object={mat.goldMli} attach="material" />
          </mesh>
          {/* Carbon Frame Structural Edges */}
          <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[1.04, 0.04, 1.04]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <boxGeometry args={[1.04, 0.04, 1.04]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
          {/* Equipment Mounting Rails */}
          <mesh position={[0.51, 0, 0]}>
            <boxGeometry args={[0.02, 1.1, 0.9]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
        </group>
      );

    case 'bus_hex':
      return (
        <group>
          {/* Hexagonal Prism Titanium Bus */}
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 6, 0]}>
            <cylinderGeometry args={[0.7, 0.7, 1.4, 6]} />
            <primitive object={mat.goldMli} attach="material" />
          </mesh>
          {/* Top Bulkhead Collar */}
          <mesh position={[0, 0.71, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 0.06, 6]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
          <mesh position={[0, -0.71, 0]}>
            <cylinderGeometry args={[0.72, 0.72, 0.06, 6]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
        </group>
      );

    case 'solar_wing_1':
      return (
        <group position={[-0.6, 0, 0]}>
          {/* Deployment Gimbal Mount */}
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Solar Panel Wing */}
          <mesh position={[-0.9, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.7, 0.03]} />
            <primitive object={mat.solarCell} attach="material" />
          </mesh>
          {/* Frame border */}
          <mesh position={[-0.9, 0, -0.018]}>
            <boxGeometry args={[1.52, 0.72, 0.01]} />
            <primitive object={mat.solarBack} attach="material" />
          </mesh>
        </group>
      );

    case 'solar_wing_2':
      return (
        <group>
          {/* Left Wing */}
          <group position={[-0.6, 0, 0]}>
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
              <primitive object={mat.titanium} attach="material" />
            </mesh>
            <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.0, 0.8, 0.03]} />
              <primitive object={mat.solarCell} attach="material" />
            </mesh>
          </group>
          {/* Right Wing */}
          <group position={[0.6, 0, 0]}>
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
              <primitive object={mat.titanium} attach="material" />
            </mesh>
            <mesh position={[1.2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[2.0, 0.8, 0.03]} />
              <primitive object={mat.solarCell} attach="material" />
            </mesh>
          </group>
        </group>
      );

    case 'rtg_unit':
      return (
        <group position={[0, 0, -0.65]}>
          {/* Central Radioactive Core */}
          <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.6, 16]} />
            <primitive object={mat.rtgCasing} attach="material" />
          </mesh>
          {/* Radiative Cooling Fins */}
          {[0, 45, 90, 135].map((deg) => (
            <mesh key={deg} rotation={[0, 0, (deg * Math.PI) / 180]}>
              <boxGeometry args={[0.55, 0.02, 0.55]} />
              <primitive object={mat.carbonComposite} attach="material" />
            </mesh>
          ))}
        </group>
      );

    case 'battery_bank':
      return (
        <group position={[0, -0.4, 0.52]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.25, 0.15]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Status LEDs */}
          <mesh position={[0.15, 0.08, 0.08]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      );

    case 'engine_biprop':
      return (
        <group position={[0, -0.6, 0]}>
          {/* Combustion Chamber */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.25, 16]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Expansion Rocket Bell Nozzle */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <coneGeometry args={[0.3, 0.45, 24, 1, true]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Gimbal Mount Ring */}
          <mesh position={[0, -0.02, 0]}>
            <torusGeometry args={[0.16, 0.02, 8, 24]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
        </group>
      );

    case 'engine_ion':
      return (
        <group position={[0, -0.6, 0]}>
          <mesh position={[0, -0.2, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.3, 0.35, 24]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Electrostatic Grid Blue Glow */}
          <mesh position={[0, -0.38, 0]}>
            <circleGeometry args={[0.28, 24]} />
            <meshBasicMaterial color="#22D3EE" />
          </mesh>
        </group>
      );

    case 'rcs_cluster':
      return (
        <group position={[0.55, 0.55, 0.55]}>
          <mesh>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* 4 Tiny Thruster Nozzles */}
          <mesh position={[0.06, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.025, 0.06, 8]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <coneGeometry args={[0.025, 0.06, 8]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.025, 0.06, 8]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
        </group>
      );

    case 'antenna_hga_dish':
      return (
        <group position={[0, 0.6, 0]} rotation={[0.4, 0.3, 0]}>
          {/* Feed Horn Strut */}
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Parabolic Dish Dish */}
          <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <primitive object={mat.dishReflector} attach="material" />
          </mesh>
          {/* Subreflector Feed */}
          <mesh position={[0, 0.58, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
        </group>
      );

    case 'antenna_omni':
      return (
        <group position={[0.45, 0.6, -0.3]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          <mesh position={[0, 0.52, 0]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <primitive object={mat.dishReflector} attach="material" />
          </mesh>
        </group>
      );

    case 'camera_highres':
      return (
        <group position={[0, -0.2, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          {/* Camera Lens Barrel */}
          <mesh castShadow>
            <cylinderGeometry args={[0.14, 0.16, 0.45, 24]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
          {/* Front Optical Lens Aperture */}
          <mesh position={[0, 0.23, 0]}>
            <circleGeometry args={[0.13, 24]} />
            <primitive object={mat.opticalAperture} attach="material" />
          </mesh>
          {/* Baffle Ring */}
          <mesh position={[0, 0.24, 0]}>
            <torusGeometry args={[0.14, 0.015, 8, 24]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
        </group>
      );

    case 'spectrometer':
      return (
        <group position={[0.35, -0.2, 0.52]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 0.25, 0.35]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
          {/* Dual Slit Window */}
          <mesh position={[0, 0, 0.18]}>
            <boxGeometry args={[0.12, 0.04, 0.02]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
        </group>
      );

    case 'radar_sar':
      return (
        <group position={[-0.55, 0.1, 0.45]} rotation={[0, -0.3, 0]}>
          {/* Flat SAR Array Mesh */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.8, 0.5, 0.04]} />
            <primitive object={mat.dishReflector} attach="material" />
          </mesh>
          {/* Trusses */}
          <mesh position={[-0.2, 0, -0.05]}>
            <boxGeometry args={[0.03, 0.45, 0.06]} />
            <primitive object={mat.carbonComposite} attach="material" />
          </mesh>
        </group>
      );

    case 'radiator_panel':
      return (
        <group position={[0, 0, -0.52]}>
          {/* White High-Emissivity Fin */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.85, 0.95, 0.02]} />
            <primitive object={mat.thermalWhite} attach="material" />
          </mesh>
          {/* Ammonia Loop Pipes */}
          <mesh position={[0, 0, 0.015]}>
            <boxGeometry args={[0.02, 0.9, 0.01]} />
            <primitive object={mat.titanium} attach="material" />
          </mesh>
        </group>
      );

    case 'thermal_blanket':
      return (
        <group position={[0, 0, 0]}>
          {/* Gold Wrapped Shell */}
          <mesh>
            <boxGeometry args={[1.05, 1.25, 1.05]} />
            <primitive object={mat.goldMli} attach="material" />
          </mesh>
        </group>
      );

    default:
      // Generic component box
      return (
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <primitive object={mat.titanium} attach="material" />
        </mesh>
      );
  }
}
