import React from 'react';
import { useGame } from '../../context/GameContext';
import { SpacecraftCanvas } from '../../three/SpacecraftCanvas';
import { 
  Target, 
  CheckSquare, 
  AlertTriangle, 
  DollarSign, 
  Scale, 
  Rocket, 
  Clock, 
  Layers, 
  ChevronRight,
  ArrowLeft,
  Radio,
  Zap
} from 'lucide-react';

export const MissionBriefing: React.FC = () => {
  const { mission, setScreen, components } = useGame();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Back button */}
      <button
        onClick={() => setScreen('mission-selection')}
        className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>SELECT ANOTHER MISSION</span>
      </button>

      {/* Main Dossier Container */}
      <div className="bg-space-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-space-950 p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <span>OFFICIAL FLIGHT DIRECTIVE</span>
              <span>//</span>
              <span>{mission.code}</span>
            </div>
            <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
              {mission.name}
            </h2>
            <p className="text-sm text-cyan-300/80 mt-1">
              {mission.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScreen('spacecraft-builder')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-3 px-6 rounded tracking-wider uppercase flex items-center space-x-2 transition-all shadow-hud"
            >
              <Layers className="w-4 h-4" />
              <span>PROCEED TO 3D SPACECRAFT CAD</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
          {/* Left Column: Mission Description & 3D Target Globe */}
          <div className="space-y-6">
            <div className="h-52 bg-space-950 rounded-lg border border-slate-800 relative overflow-hidden">
              <SpacecraftCanvas
                components={[]}
                selectedComponentId={null}
                onSelectComponent={() => {}}
                planetTarget={mission.target}
                cameraDistance={3.8}
              />
              <div className="absolute bottom-2 left-2 bg-space-900/80 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400">
                TARGET DESTINATION: {mission.target.toUpperCase()}
              </div>
            </div>

            <div>
              <h4 className="font-tech text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                MISSION OVERVIEW
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {mission.description}
              </p>
            </div>

            {/* Environmental Challenges */}
            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-red-400 font-bold uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>ENVIRONMENTAL HAZARDS</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {mission.environmentalHazards.map((h, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-400 font-mono">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center Column: Scientific Goals Checklist */}
          <div className="space-y-6">
            <div>
              <h4 className="font-tech text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <span>MANDATORY SCIENTIFIC CONTRACT OBJECTIVES</span>
              </h4>
              <div className="space-y-3">
                {mission.scientificGoals.map((goal, idx) => (
                  <div key={idx} className="bg-space-950 p-3.5 rounded border border-slate-800/80 flex items-start space-x-3">
                    <span className="font-mono text-xs text-cyan-400 font-bold">0{idx + 1}.</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{goal}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-tech text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">
                REQUIRED SENSOR PAYLOADS
              </h4>
              <div className="flex flex-wrap gap-2">
                {mission.requiredInstrumentCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-cyan-950/50 border border-cyan-500/40 rounded text-xs font-mono text-cyan-300 uppercase"
                  >
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Mission Constraints & Parameter Matrix */}
          <div className="space-y-6">
            <h4 className="font-tech text-sm font-bold text-slate-300 uppercase tracking-wider">
              ENGINEERING CONSTRAINTS & THRESHOLDS
            </h4>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>TOTAL BUDGET CAP:</span>
                </span>
                <span className="text-emerald-300 font-bold">${(mission.budget / 1000).toFixed(1)}M USD</span>
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>MAX SPACECRAFT MASS:</span>
                </span>
                <span className="text-cyan-300 font-bold">{mission.massLimit} kg</span>
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Rocket className="w-4 h-4 text-blue-400" />
                  <span>MIN REQUIRED DELTA-V:</span>
                </span>
                <span className="text-blue-300 font-bold">{mission.minDeltaV} m/s</span>
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>BASE CONTINUOUS POWER:</span>
                </span>
                <span className="text-amber-300 font-bold">{mission.minPowerWatts} Watts</span>
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>MIN TELEMETRY DOWNLINK:</span>
                </span>
                <span className="text-purple-300 font-bold">{mission.minCommDataRateMbps} Mbps</span>
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>FLIGHT LIFETIME:</span>
                </span>
                <span className="text-slate-200 font-bold">{mission.missionDurationDays} Days</span>
              </div>
            </div>

            <div className="p-4 rounded bg-space-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed">
              <span className="text-cyan-400 font-bold">FLIGHT NOTE:</span> Make sure to equip adequate power generation and battery reserves before proceeding to launch validation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
