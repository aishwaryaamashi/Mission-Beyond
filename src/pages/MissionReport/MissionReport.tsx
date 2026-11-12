import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Wrench, 
  Layers, 
  FileText, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Fuel, 
  HardDrive,
  Download,
  Box
} from 'lucide-react';

export const MissionReport: React.FC = () => {
  const { activeReport, setScreen, saveCurrentReport } = useGame();

  if (!activeReport) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] bg-space-950 text-slate-400 font-mono text-sm space-y-4">
        <div>NO RECENT MISSION REPORT RECORDED</div>
        <button
          onClick={() => setScreen('mission-selection')}
          className="px-4 py-2 bg-cyan-600 text-white font-tech rounded"
        >
          START NEW MISSION
        </button>
      </div>
    );
  }

  const score = activeReport.score;
  const gradeColor = 
    score.grade === 'S' ? 'text-amber-300 border-amber-400 bg-amber-950/40 shadow-hud-amber' :
    score.grade === 'A' ? 'text-emerald-300 border-emerald-400 bg-emerald-950/40 shadow-hud-green' :
    score.grade === 'B' ? 'text-cyan-300 border-cyan-400 bg-cyan-950/40' :
    score.grade === 'C' ? 'text-blue-300 border-blue-400 bg-blue-950/40' :
    'text-red-300 border-red-400 bg-red-950/40 shadow-hud-red';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none space-y-8">
      {/* Top Banner with Grade and Total Score */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center space-x-6">
          {/* Grade Badge */}
          <div className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center ${gradeColor}`}>
            <span className="font-tech text-4xl font-extrabold leading-none">{score.grade}</span>
            <span className="text-[9px] font-mono uppercase tracking-widest mt-1">GRADE</span>
          </div>

          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              MISSION TELEMETRY DEBRIEF // {activeReport.date}
            </div>
            <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
              {activeReport.missionName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Spacecraft Callout: <span className="text-slate-200 font-mono">{activeReport.spacecraftName}</span> ({activeReport.spacecraftBlueprint.components.length} components mounted)
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">TOTAL FLIGHT SCORE</div>
          <div className="font-tech text-4xl font-extrabold text-cyan-300 tracking-wider">
            {score.totalScore.toLocaleString()} <span className="text-base font-normal text-slate-400">/ 10,000</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-space-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setScreen('spacecraft-builder')}
            className="flex items-center space-x-2 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/40 text-cyan-300 hover:text-white rounded text-xs font-tech font-bold uppercase tracking-wider transition-all"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>MODIFY SPACECRAFT</span>
          </button>

          <button
            onClick={() => setScreen('mission-simulation')}
            className="flex items-center space-x-2 px-4 py-2 bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-300 rounded text-xs font-tech font-bold uppercase tracking-wider transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REPLAY SIMULATION</span>
          </button>

          <button
            onClick={() => {
              saveCurrentReport();
              alert('Mission report saved to permanent archive.');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-300 rounded text-xs font-tech font-bold uppercase tracking-wider transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SAVE TO ARCHIVE</span>
          </button>
        </div>

        <button
          onClick={() => setScreen('mission-archive')}
          className="flex items-center space-x-2 px-4 py-2 bg-space-900 hover:bg-space-850 border border-slate-700 text-purple-300 rounded text-xs font-tech font-bold uppercase tracking-wider transition-all"
        >
          <Box className="w-3.5 h-3.5" />
          <span>VIEW SAVED ARCHIVE</span>
        </button>
      </div>

      {/* Grid: Score Breakdown vs Flight Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transparent Score Breakdown */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>FLIGHT AUDIT SCORE BREAKDOWN</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">1. Mission Objective Success:</span>
              <span className="text-cyan-300 font-bold">{score.missionSuccessScore} / 2,500</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">2. Scientific Discovery Yield:</span>
              <span className="text-cyan-300 font-bold">{score.scientificValueScore} / 2,500</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">3. Fiscal Budget Efficiency:</span>
              <span className="text-emerald-300 font-bold">{score.budgetEfficiencyScore} / 1,500</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">4. Structural Mass Margin:</span>
              <span className="text-blue-300 font-bold">{score.massEfficiencyScore} / 1,000</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">5. Electrical Power Balance:</span>
              <span className="text-amber-300 font-bold">{score.powerEfficiencyScore} / 1,000</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">6. Deep Space Telemetry Link:</span>
              <span className="text-purple-300 font-bold">{score.commPerformanceScore} / 1,000</span>
            </div>
            <div className="flex justify-between items-center bg-space-950 p-2.5 rounded border border-slate-800/80">
              <span className="text-slate-400">7. Equipment Health Preservation:</span>
              <span className="text-emerald-400 font-bold">{score.reliabilitySafetyScore} / 500</span>
            </div>
          </div>
        </div>

        {/* Flight Checklist Results */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>MANDATORY CONTRACT EVALUATION</span>
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-mono text-emerald-400 block mb-2 font-bold">
                ACCOMPLISHED OBJECTIVES:
              </span>
              <div className="space-y-2">
                {activeReport.objectivesCompleted.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-200 bg-space-950 p-2.5 rounded border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {activeReport.objectivesMissed.length > 0 && (
              <div>
                <span className="text-xs font-mono text-red-400 block mb-2 font-bold">
                  MISSED OBJECTIVES:
                </span>
                <div className="space-y-2">
                  {activeReport.objectivesMissed.map((obj, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-400 bg-space-950 p-2.5 rounded border border-slate-800/80">
                      <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engineering Lessons & Peak Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-3">
          <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wider">
            PEAK TELEMETRY AUDIT
          </h4>
          <div className="space-y-2 font-mono text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">SCIENCE DOWNLINKED:</span>
              <span className="text-emerald-400 font-bold">{activeReport.peakTelemetry.scienceDataTransmittedGb} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">PROPELLANT CONSUMED:</span>
              <span>{activeReport.peakTelemetry.propellantUsedKg} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">FINAL HARDWARE INTEGRITY:</span>
              <span className="text-cyan-400 font-bold">{activeReport.peakTelemetry.finalHealthPercent}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CRISIS EVENTS RESOLVED:</span>
              <span>{activeReport.eventsHandledCount}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-space-900 border border-slate-800 p-6 rounded-xl space-y-3">
          <h4 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wider">
            ENGINEERING LESSONS & OPTIMIZATION INSIGHTS
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            {activeReport.engineeringLessons.map((lesson, idx) => (
              <div key={idx} className="bg-space-950 p-2.5 rounded border border-slate-800/80 flex items-start space-x-2">
                <span className="font-mono text-cyan-400 font-bold">•</span>
                <p className="leading-relaxed">{lesson}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
