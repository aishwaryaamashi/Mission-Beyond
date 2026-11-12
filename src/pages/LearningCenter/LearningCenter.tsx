import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { LEARNING_MODULES, LearningModule } from '../../game/database/learningModules';
import { 
  BookOpen, 
  Orbit, 
  Zap, 
  Thermometer, 
  Radio, 
  Camera, 
  Calculator, 
  ArrowLeft,
  ChevronRight,
  Info
} from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const { setScreen } = useGame();
  const [selectedModule, setSelectedModule] = useState<LearningModule>(LEARNING_MODULES[0]);

  // Interactive Mini-Calculator: Tsiolkovsky Delta-V
  const [dryMassCalc, setDryMassCalc] = useState(600);
  const [propMassCalc, setPropMassCalc] = useState(400);
  const [ispCalc, setIspCalc] = useState(318);

  const deltaVResult = Math.round(ispCalc * 9.80665 * Math.log((dryMassCalc + propMassCalc) / dryMassCalc));

  // Interactive Mini-Calculator: Solar Flux by AU
  const [distanceAu, setDistanceAu] = useState(1.0);
  const solarFluxResult = Math.round(1361 / (distanceAu * distanceAu));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none space-y-8">
      {/* Back button */}
      <button
        onClick={() => setScreen('main-menu')}
        className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO MAIN MENU</span>
      </button>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <BookOpen className="w-4 h-4" />
          <span>AEROSPACE ENGINEERING ACADEMY</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          LEARNING CENTER & INTERACTIVE HANDBOOK
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Understand the orbital physics, thermodynamic equilibria, and electrical constraints that dictate deep-space exploration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Navigation List */}
        <div className="space-y-2">
          {LEARNING_MODULES.map((mod) => {
            const isSelected = selectedModule.id === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-hud'
                    : 'bg-space-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-mono text-cyan-400 uppercase block mb-0.5">
                  {mod.category}
                </span>
                <h4 className="font-tech font-bold text-sm text-slate-100 uppercase tracking-wider">
                  {mod.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {mod.subtitle}
                </p>
              </button>
            );
          })}

          {/* Interactive Calculator Box */}
          <div className="bg-space-900 border border-slate-800 p-5 rounded-lg space-y-4 mt-6">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-2">
              <Calculator className="w-4 h-4" />
              <span>TSIOLKOVSKY DELTA-V CALCULATOR</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 flex justify-between">
                  <span>Dry Mass (m_dry):</span>
                  <span className="text-slate-200">{dryMassCalc} kg</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={dryMassCalc}
                  onChange={(e) => setDryMassCalc(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 flex justify-between">
                  <span>Propellant Mass (m_prop):</span>
                  <span className="text-slate-200">{propMassCalc} kg</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={propMassCalc}
                  onChange={(e) => setPropMassCalc(Number(e.target.value))}
                  className="w-full accent-blue-400"
                />
              </div>

              <div>
                <label className="text-slate-400 flex justify-between">
                  <span>Specific Impulse (Isp):</span>
                  <span className="text-slate-200">{ispCalc} s</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="20"
                  value={ispCalc}
                  onChange={(e) => setIspCalc(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="bg-space-950 p-3 rounded border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">DELIVERED DELTA-V:</span>
                <span className="text-cyan-300 font-bold text-sm">{deltaVResult} m/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Module Article View */}
        <div className="lg:col-span-2 bg-space-900 border border-slate-800 p-8 rounded-xl space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
              CHAPTER: {selectedModule.category}
            </span>
            <h3 className="font-tech text-3xl font-bold text-slate-100 uppercase tracking-wider">
              {selectedModule.title}
            </h3>
            <p className="text-sm text-cyan-300/90 mt-1">
              {selectedModule.subtitle}
            </p>
          </div>

          {selectedModule.formula && (
            <div className="bg-space-950 p-4 rounded-lg border border-cyan-500/30 text-center font-mono text-sm text-cyan-300 overflow-x-auto">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">GOVERNING AEROSPACE EQUATION:</span>
              <span className="font-bold tracking-wider">{selectedModule.formula}</span>
            </div>
          )}

          <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
            <p className="text-sm text-slate-200 bg-space-950 p-4 rounded border border-slate-800">
              {selectedModule.summary}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="font-tech text-sm font-bold text-slate-200 uppercase tracking-wider">
                CORE TECHNICAL PRINCIPLES
              </h4>
              {selectedModule.detailedExplanation.map((p, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="font-mono text-cyan-400 font-bold">•</span>
                  <p>{p}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-lg space-y-2 mt-4">
              <h4 className="font-tech text-xs font-bold text-amber-300 uppercase tracking-wider">
                KEY ENGINEERING TRADE-OFFS
              </h4>
              <ul className="space-y-1.5 text-slate-300">
                {selectedModule.keyTradeoffs.map((t, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-mono">-</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-space-950 p-4 rounded border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                REAL-WORLD SPACE MISSION CASE STUDY:
              </span>
              <p className="text-slate-300">{selectedModule.realWorldExample}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
