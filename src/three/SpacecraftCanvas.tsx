import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { SpacecraftComponent } from '../types/game';
import { SpacecraftModel } from './SpacecraftModel';
import { PlanetVisualizer } from './PlanetVisualizer';

interface SpacecraftCanvasProps {
  components: SpacecraftComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (componentId: string) => void;
  hoveredComponentId?: string | null;
  onHoverComponent?: (componentId: string | null) => void;
  planetTarget?: 'Moon' | 'Mars' | 'Asteroid' | 'Earth' | 'Deep Space';
  isSimulating?: boolean;
  cameraDistance?: number;
}

export const SpacecraftCanvas: React.FC<SpacecraftCanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  hoveredComponentId,
  onHoverComponent,
  planetTarget,
  isSimulating = false,
  cameraDistance = 4.5
}) => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [cameraDistance * 0.8, cameraDistance * 0.5, cameraDistance], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Aerospace Lighting Environment */}
          <ambientLight intensity={0.4} />
          {/* Primary Directional Solar Beam */}
          <directionalLight
            position={[10, 8, 12]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          {/* Subtle Deep Space Bounce Lighting */}
          <directionalLight position={[-8, -5, -8]} intensity={0.25} color="#38BDF8" />
          <pointLight position={[0, -4, 0]} intensity={0.15} color="#94A3B8" />

          {/* Starfield Background */}
          <Stars
            radius={80}
            depth={50}
            count={2500}
            factor={3}
            saturation={0}
            fade
            speed={0.4}
          />

          {/* If planetTarget is present (e.g. in simulation or briefing) */}
          {planetTarget && (
            <group position={[isSimulating ? 5.5 : 0, isSimulating ? -1.5 : 0, isSimulating ? -8 : 0]}>
              <PlanetVisualizer target={planetTarget} size={isSimulating ? 3.5 : 1.8} />
            </group>
          )}

          {/* 3D Modular Spacecraft */}
          {(!planetTarget || isSimulating) && (
            <SpacecraftModel
              components={components}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              hoveredComponentId={hoveredComponentId}
              onHoverComponent={onHoverComponent}
              isSimulating={isSimulating}
            />
          )}

          {/* Controls: Rotate, Zoom, Pan */}
          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            minDistance={1.8}
            maxDistance={14}
            maxPolarAngle={Math.PI / 1.05}
          />
        </Suspense>
      </Canvas>

      {/* Reticle / HUD Watermark */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center space-x-2 text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
        <span>R3F VIEWPORT // 3D TELEMETRY ACTIVE</span>
      </div>

      <div className="absolute bottom-3 right-3 pointer-events-none text-[10px] font-mono text-slate-400/50">
        L-DRAG: ROTATE | R-DRAG: PAN | SCROLL: ZOOM
      </div>
    </div>
  );
};
