import React from 'react';
import { useGame } from '../../context/GameContext';
import { SpacecraftCanvas } from '../../three/SpacecraftCanvas';
import { 
  Rocket, 
  Users, 
  Box, 
  BookOpen, 
  Trophy, 
  Sliders, 
  Play, 
  Compass, 
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const MainMenu: React.FC = () => {
  const { setScreen, setGameMode, components, mission } = useGame();

  const handleStartSolo = () => {
    setGameMode('solo');
    setScreen('mission-selection');
  };

  const handleMultiplayer = () => {
    setScreen('lobby');
  };

  const handleSandbox = () => {
    setGameMode('sandbox');
    setScreen('spacecraft-builder');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 flex flex-col justify-between select-none">
      {/* 3D Background Space Scene */}
      <div className="absolute inset-0 z-0">
        <SpacecraftCanvas
          components={components}
          selectedComponentId={null}
          onSelectComponent={() => {}}
          planetTarget="Earth"
          cameraDistance={5.5}
        />
        {/* Subtle vignette gradient overlay */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      </div>

      {/* Top Aerospace Telemetry Bar */}
      <header className="relative z-10 px-8 py-6 flex items-center justify-between border-b border-slate-800/40 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-cyan-950/70 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-hud">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-tech text-2xl font-bold tracking-widest text-slate-100 flex items-center space-x-2">
              <span>MISSION: BEYOND</span>
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                v2.4 AEROSPACE EDITION
              </span>
            </h1>
            <p className="text-xs font-mono text-slate-400 tracking-wider">
              ADVANCED INTERACTIVE SPACE MISSION STRATEGY & SIMULATION ENGINE
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500">PROPULSION:</span> <span className="text-emerald-400">NOMINAL</span>
          </div>
          <div>
            <span className="text-slate-500">DSN COMM:</span> <span className="text-cyan-400">ACQUIRED</span>
          </div>
          <div>
            <span className="text-slate-500">SIMULATION ENGINE:</span> <span className="text-amber-400">READY</span>
          </div>
        </div>
      </header>

      {/* Center Hero Tagline & Mission Action Grid */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-4 w-full flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-space-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AEROSPACE HARDWARE SPECIFICATIONS VERIFIED</span>
        </div>

        <h2 className="font-tech text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-wider max-w-3xl uppercase leading-tight mb-3">
          Every decision takes you closer to <span className="text-cyan-400 glow-cyan">discovery</span> — or <span className="text-red-400">failure</span>.
        </h2>

        <p className="font-sans text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed mb-8">
          Design real interplanetary probes, optimize electrical link budgets, select launch trajectories, and experience the physical consequences of your engineering trade-offs in live 3D simulation.
        </p>

        {/* Primary Launch Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
          <button
            onClick={handleStartSolo}
            className="group relative bg-cyan-600/20 hover:bg-cyan-500/30 border border-cyan-500/60 hover:border-cyan-400 p-5 rounded-lg text-left transition-all hover:scale-[1.02] shadow-hud"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-900">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded">PRIMARY</span>
            </div>
            <h3 className="font-tech font-bold text-base text-slate-100 group-hover:text-cyan-300 tracking-wider">
              START NEW MISSION
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Launch into 5 scenario dossiers: Lunar, Mars, Asteroid, Earth & Deep Space.
            </p>
          </button>

          <button
            onClick={handleMultiplayer}
            className="group relative bg-space-900/80 hover:bg-space-850 border border-slate-700 hover:border-blue-500/60 p-5 rounded-lg text-left transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-blue-950 border border-blue-400/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-900">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded">CO-OP / VERSUS</span>
            </div>
            <h3 className="font-tech font-bold text-base text-slate-100 group-hover:text-blue-300 tracking-wider">
              CREW MULTIPLAYER
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Collaborate in 4 specialized roles: Director, Engineer, Scientist, and Systems.
            </p>
          </button>

          <button
            onClick={handleSandbox}
            className="group relative bg-space-900/80 hover:bg-space-850 border border-slate-700 hover:border-amber-500/60 p-5 rounded-lg text-left transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded bg-amber-950 border border-amber-400/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-900">
                <Sliders className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded">UNCONSTRAINED</span>
            </div>
            <h3 className="font-tech font-bold text-base text-slate-100 group-hover:text-amber-300 tracking-wider">
              SANDBOX MODE
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
              Unrestricted budget & mass limits. Prototype experimental deep-space flagships.
            </p>
          </button>
        </div>

        {/* Secondary Hub Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setScreen('learning-center')}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-space-900/90 hover:bg-space-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEARNING CENTER</span>
          </button>

          <button
            onClick={() => setScreen('leaderboard')}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-space-900/90 hover:bg-space-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>LEADERBOARDS</span>
          </button>

          <button
            onClick={() => setScreen('mission-archive')}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-space-900/90 hover:bg-space-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-purple-400" />
            <span>MISSION ARCHIVE</span>
          </button>

          <button
            onClick={() => setScreen('profile')}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-space-900/90 hover:bg-space-800 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>PROFILE & SETTINGS</span>
          </button>
        </div>
      </main>

      {/* Footer Aerospace Coordinates */}
      <footer className="relative z-10 px-8 py-4 border-t border-slate-800/40 bg-space-950/60 backdrop-blur-sm flex items-center justify-between text-[11px] font-mono text-slate-500">
        <div>
          COORDINATES: LAT +28.5721° N, LON -80.6480° W // CAPE CANAVERAL SLC-39A
        </div>
        <div>
          MISSION: BEYOND // DEEP SPACE EXPLORATION HARNESS
        </div>
      </footer>
    </div>
  );
};
