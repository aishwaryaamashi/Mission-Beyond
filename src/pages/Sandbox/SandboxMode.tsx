import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Sliders, 
  ArrowLeft, 
  Layers, 
  Activity, 
  DollarSign, 
  Scale, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const SandboxMode: React.FC = () => {
  const { 
    sandboxOverrides, 
    setSandboxOverrides, 
    setScreen, 
    components, 
    validation,
    startSimulation
  } = useGame();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none space-y-8">
      {/* Back button */}
      <button
        onClick={() => setScreen('main-menu')}
        className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO MAIN MENU</span>
      </button>

      {/* Header */}
      <div className="bg-space-900 border border-amber-500/50 p-6 rounded-xl space-y-3 shadow-hud-amber">
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest">
          <Sliders className="w-4 h-4" />
          <span>EXPERIMENTAL LABORATORY // UNCONSTRAINED MODE</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          SANDBOX PROTOTYPING CHAMBER
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Zero funding limits, unlimited mass envelopes, and configurable physical thresholds. Test radical multi-engine architectures, nuclear deep space cruisers, and stress-test subsystem limits.
        </p>
        <div className="text-[11px] font-mono text-amber-300/80 bg-space-950 p-2.5 rounded border border-amber-500/30">
          NOTE: Flights conducted in Sandbox Mode are flagged as experimental prototypes and do not submit records to the competitive leaderboards.
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-6">
        <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
          ADJUSTABLE LABORATORY CONSTRAINTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Budget Slider */}
          <div className="bg-space-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>AUTHORIZED BUDGET:</span>
              </span>
              <span className="text-emerald-300 font-bold text-base">
                ${(sandboxOverrides.customBudget / 1000).toFixed(0)}M USD
              </span>
            </div>
            <input
              type="range"
              min="20000"
              max="500000"
              step="10000"
              value={sandboxOverrides.customBudget}
              onChange={(e) => setSandboxOverrides(prev => ({ ...prev, customBudget: Number(e.target.value) }))}
              className="w-full accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>$20M</span>
              <span>$500M (FLAGSHIP UNLIMITED)</span>
            </div>
          </div>

          {/* Custom Mass Limit Slider */}
          <div className="bg-space-950 p-4 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>LAUNCH MASS ENVELOPE:</span>
              </span>
              <span className="text-cyan-300 font-bold text-base">
                {sandboxOverrides.customMassLimit.toLocaleString()} kg
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="15000"
              step="250"
              value={sandboxOverrides.customMassLimit}
              onChange={(e) => setSandboxOverrides(prev => ({ ...prev, customMassLimit: Number(e.target.value) }))}
              className="w-full accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>500 kg</span>
              <span>15,000 kg (SUPER-HEAVY)</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setScreen('spacecraft-builder')}
            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-3 px-6 rounded uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-hud"
          >
            <Layers className="w-4 h-4" />
            <span>OPEN 3D SPACECRAFT BUILDER</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => startSimulation()}
            className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-tech font-bold py-3 px-6 rounded uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-hud-amber"
          >
            <Activity className="w-4 h-4" />
            <span>LAUNCH EXPERIMENTAL RUN</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
