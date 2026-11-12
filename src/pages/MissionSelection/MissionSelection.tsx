import React from 'react';
import { useGame } from '../../context/GameContext';
import { MISSION_SCENARIOS } from '../../game/database/missions';
import { MissionScenario, Difficulty } from '../../types/game';
import { SpacecraftCanvas } from '../../three/SpacecraftCanvas';
import { 
  Rocket, 
  Target, 
  Scale, 
  DollarSign, 
  Clock, 
  Radio, 
  Zap, 
  ChevronRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const MissionSelection: React.FC = () => {
  const { 
    mission: currentMission, 
    setMission, 
    setScreen, 
    difficulty, 
    setDifficulty 
  } = useGame();

  const handleSelectAndBrief = (m: MissionScenario) => {
    setMission(m);
    setScreen('mission-briefing');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 select-none">
      {/* Top Header & Difficulty Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Target className="w-4 h-4" />
            <span>FLIGHT PROGRAM DOSSIERS</span>
          </div>
          <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
            SELECT MISSION SCENARIO
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review primary science requirements, target distances, environmental hazards, and launch budgets.
          </p>
        </div>

        {/* Difficulty Controls */}
        <div className="bg-space-900 border border-slate-800 p-1.5 rounded-lg flex items-center space-x-1">
          <span className="text-xs font-mono text-slate-500 px-2 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>DIFFICULTY:</span>
          </span>
          {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded text-xs font-mono uppercase font-semibold transition-all ${
                difficulty === d
                  ? d === 'beginner'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : d === 'intermediate'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 5 Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MISSION_SCENARIOS.map((m) => {
          const isSelected = currentMission.id === m.id;
          return (
            <div
              key={m.id}
              className={`group bg-space-900/90 border rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                isSelected
                  ? 'border-cyan-400 shadow-hud'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Mission 3D Globe / Visual Header */}
              <div className="h-44 bg-space-950 relative overflow-hidden border-b border-slate-800/80">
                <SpacecraftCanvas
                  components={[]}
                  selectedComponentId={null}
                  onSelectComponent={() => {}}
                  planetTarget={m.target}
                  cameraDistance={4.0}
                />
                <div className="absolute top-3 left-3 bg-space-950/80 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-400">
                  {m.code}
                </div>
                <div className="absolute top-3 right-3 bg-space-950/80 border border-slate-800 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                  {m.targetDistance}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                      TARGET: {m.target}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                        m.difficulty === 'beginner'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                          : m.difficulty === 'intermediate'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                          : 'bg-red-950/60 text-red-300 border-red-500/40'
                      }`}
                    >
                      {m.difficulty}
                    </span>
                  </div>

                  <h3 className="font-tech text-xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors uppercase tracking-wider mb-2">
                    {m.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {m.description}
                  </p>

                  {/* Resource constraints summary pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-space-950/80 p-3 rounded border border-slate-800/80 mb-4">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>${(m.budget / 1000).toFixed(0)}M BUDGET</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Scale className="w-3.5 h-3.5 text-cyan-400" />
                      <span>MAX {m.massLimit} KG</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Rocket className="w-3.5 h-3.5 text-blue-400" />
                      <span>{m.minDeltaV} M/S ΔV</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{m.missionDurationDays} DAYS</span>
                    </div>
                  </div>
                </div>

                {/* Select button */}
                <button
                  onClick={() => handleSelectAndBrief(m)}
                  className={`w-full py-2.5 px-4 rounded font-tech font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                    isSelected
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-hud'
                      : 'bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <span>REVIEW MISSION BRIEFING</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
