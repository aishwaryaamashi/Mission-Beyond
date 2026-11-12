import React from 'react';
import { useGame } from '../../context/GameContext';
import { ResourceHUD } from '../../components/dashboards/ResourceHUD';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Rocket, 
  ArrowLeft, 
  Wrench, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

export const MissionValidation: React.FC = () => {
  const { 
    validation, 
    startSimulation, 
    setScreen, 
    mission, 
    launchVehicle, 
    orbit,
    components,
    addComponent,
    removeComponent
  } = useGame();

  const criticalIssues = validation.issues.filter(i => i.status === 'CRITICAL');
  const warningIssues = validation.issues.filter(i => i.status === 'WARNING');
  const passCount = 12 - (criticalIssues.length + warningIssues.length);

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-space-950 select-none pb-12">
      <ResourceHUD />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('mission-configuration')}
            className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO CONFIGURATION</span>
          </button>

          {/* Launch Button with Critical Lock */}
          {validation.canLaunch ? (
            <button
              onClick={() => startSimulation()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold py-3 px-8 rounded tracking-wider uppercase flex items-center space-x-2 transition-all shadow-hud-green hover:scale-[1.02]"
            >
              <Rocket className="w-5 h-5" />
              <span>AUTHORIZE FLIGHT COUNTDOWN & LAUNCH</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-950/60 border border-red-500/50 rounded text-red-300 font-mono text-xs">
              <XCircle className="w-4 h-4" />
              <span>LAUNCH ABORT: RESOLVE {criticalIssues.length} CRITICAL DEFICIENCIES TO PROCEED</span>
            </div>
          )}
        </div>

        {/* Validation Status Banner */}
        <div
          className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            validation.overallStatus === 'PASS'
              ? 'bg-emerald-950/30 border-emerald-500/60 shadow-hud-green'
              : validation.overallStatus === 'WARNING'
              ? 'bg-amber-950/30 border-amber-500/60 shadow-hud-amber'
              : 'bg-red-950/30 border-red-500/60 shadow-hud-red'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                validation.overallStatus === 'PASS'
                  ? 'bg-emerald-950 border border-emerald-400 text-emerald-400'
                  : validation.overallStatus === 'WARNING'
                  ? 'bg-amber-950 border border-amber-400 text-amber-400'
                  : 'bg-red-950 border border-red-400 text-red-400'
              }`}
            >
              {validation.overallStatus === 'PASS' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="text-xs font-mono tracking-widest uppercase opacity-80">
                AEROSPACE READINESS REVIEW (ARR)
              </div>
              <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
                STATUS: {validation.overallStatus} // {validation.canLaunch ? 'FLIGHT CERTIFIED' : 'LAUNCH PROHIBITED'}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {validation.canLaunch
                  ? 'All mandatory mechanical, mass, electrical, delta-V, and science payloads are certified for spaceflight.'
                  : 'Critical physics or budget limits violated. Rectify highlighted subsystems before pad countdown.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs">
            <div className="text-center px-4 py-2 bg-space-950/80 rounded border border-slate-800">
              <span className="text-emerald-400 font-bold text-base block">{passCount}</span>
              <span className="text-slate-500">PASSED</span>
            </div>
            <div className="text-center px-4 py-2 bg-space-950/80 rounded border border-slate-800">
              <span className="text-amber-400 font-bold text-base block">{warningIssues.length}</span>
              <span className="text-slate-500">WARNINGS</span>
            </div>
            <div className="text-center px-4 py-2 bg-space-950/80 rounded border border-slate-800">
              <span className="text-red-400 font-bold text-base block">{criticalIssues.length}</span>
              <span className="text-slate-500">CRITICAL</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Issues List */}
        <div className="space-y-4">
          <h3 className="font-tech text-xl font-bold text-slate-100 uppercase tracking-wider">
            DETAILED SUBSYSTEM DIAGNOSTICS & ACTION MATRIX
          </h3>

          {validation.issues.length === 0 ? (
            <div className="bg-space-900 border border-emerald-500/40 p-8 rounded-xl text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider">
                100% NOMINAL FLIGHT ARCHITECTURE
              </h4>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                No engineering flaws, mass violations, power deficits, or missing science sensors detected. Proceed to launch.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {validation.issues.map((issue) => {
                const isCritical = issue.status === 'CRITICAL';
                return (
                  <div
                    key={issue.id}
                    className={`p-5 rounded-xl border space-y-3 ${
                      isCritical
                        ? 'bg-red-950/20 border-red-500/50'
                        : 'bg-amber-950/20 border-amber-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                            isCritical
                              ? 'bg-red-900/80 text-red-200 border border-red-500/60'
                              : 'bg-amber-900/80 text-amber-200 border border-amber-500/60'
                          }`}
                        >
                          {issue.status}
                        </span>
                        <span className="font-mono text-xs text-slate-400 uppercase">
                          [{issue.subsystem.toUpperCase()}]
                        </span>
                        <h4 className="font-tech text-base font-bold text-slate-100 uppercase tracking-wider">
                          {issue.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => setScreen('spacecraft-builder')}
                        className="px-3 py-1 bg-space-850 hover:bg-space-800 border border-slate-700 text-xs font-mono text-cyan-300 rounded transition-colors flex items-center space-x-1 flex-shrink-0"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>FIX IN 3D CAD</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs leading-relaxed">
                      <div>
                        <span className="font-mono text-slate-400 font-bold block mb-1">
                          1. ROOT CAUSE:
                        </span>
                        <p className="text-slate-300">{issue.explanation}</p>
                      </div>

                      <div>
                        <span className="font-mono text-slate-400 font-bold block mb-1">
                          2. FLIGHT CONSEQUENCE:
                        </span>
                        <p className="text-red-300/90">{issue.consequence}</p>
                      </div>

                      <div>
                        <span className="font-mono text-slate-400 font-bold block mb-1">
                          3. RECOMMENDED FIX:
                        </span>
                        <p className="text-cyan-300">{issue.recommendedAction}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
