import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MissionReport } from '../../types/game';
import { 
  Box, 
  RotateCcw, 
  Trophy, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft,
  Scale,
  GitCompare
} from 'lucide-react';

export const MissionArchive: React.FC = () => {
  const { savedReports, setActiveReport, setScreen } = useGame();
  const [compareReportA, setCompareReportA] = useState<MissionReport | null>(null);
  const [compareReportB, setCompareReportB] = useState<MissionReport | null>(null);

  const handleInspect = (rep: MissionReport) => {
    setActiveReport(rep);
    setScreen('mission-report');
  };

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
        <div className="flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
          <Box className="w-4 h-4" />
          <span>PERMANENT FLIGHT RECORDER LOGS</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          MISSION ARCHIVE & COMPARISON LAB
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Inspect completed missions, review previous spacecraft component architectures, and perform side-by-side comparative analysis.
        </p>
      </div>

      {/* Comparison Drawer if two reports selected */}
      {compareReportA && compareReportB && (
        <div className="bg-space-900 border border-cyan-500/50 rounded-xl p-6 shadow-hud space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider">
                SIDE-BY-SIDE FLIGHT COMPARISON
              </h3>
            </div>
            <button
              onClick={() => {
                setCompareReportA(null);
                setCompareReportB(null);
              }}
              className="text-xs font-mono text-slate-400 hover:text-slate-200"
            >
              CLEAR COMPARISON
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs font-mono">
            {/* Run A */}
            <div className="space-y-3 bg-space-950 p-4 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">
                ATTEMPT A: {compareReportA.date}
              </span>
              <div className="text-slate-200 font-tech text-base">{compareReportA.missionName}</div>
              <div className="flex justify-between">
                <span className="text-slate-500">SCORE:</span>
                <span className="text-amber-400 font-bold">{compareReportA.score.totalScore} (GRADE {compareReportA.score.grade})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SCIENCE DOWNLINKED:</span>
                <span>{compareReportA.peakTelemetry.scienceDataTransmittedGb} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PROPELLANT BURNT:</span>
                <span>{compareReportA.peakTelemetry.propellantUsedKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">COMPONENTS MOUNTED:</span>
                <span>{compareReportA.spacecraftBlueprint.components.length}</span>
              </div>
            </div>

            {/* Run B */}
            <div className="space-y-3 bg-space-950 p-4 rounded border border-slate-800">
              <span className="text-purple-400 font-bold block mb-1">
                ATTEMPT B: {compareReportB.date}
              </span>
              <div className="text-slate-200 font-tech text-base">{compareReportB.missionName}</div>
              <div className="flex justify-between">
                <span className="text-slate-500">SCORE:</span>
                <span className="text-amber-400 font-bold">{compareReportB.score.totalScore} (GRADE {compareReportB.score.grade})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SCIENCE DOWNLINKED:</span>
                <span>{compareReportB.peakTelemetry.scienceDataTransmittedGb} GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PROPELLANT BURNT:</span>
                <span>{compareReportB.peakTelemetry.propellantUsedKg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">COMPONENTS MOUNTED:</span>
                <span>{compareReportB.spacecraftBlueprint.components.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Reports List */}
      <div className="space-y-4">
        <h3 className="font-tech text-xl font-bold text-slate-100 uppercase tracking-wider">
          COMPLETED FLIGHTS ({savedReports.length})
        </h3>

        {savedReports.length === 0 ? (
          <div className="bg-space-900 border border-slate-800 p-8 rounded-xl text-center space-y-3">
            <Box className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-mono">
              ZERO RECORDED MISSIONS IN LOCAL STORAGE ARCHIVE.
            </p>
            <button
              onClick={() => setScreen('mission-selection')}
              className="px-4 py-2 bg-cyan-600 text-white font-tech rounded uppercase text-xs"
            >
              LAUNCH FIRST MISSION
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-space-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl space-y-4 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] font-mono text-cyan-400 mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rep.date}</span>
                    </div>
                    <h4 className="font-tech text-lg font-bold text-slate-100 uppercase">
                      {rep.missionName}
                    </h4>
                  </div>

                  <span className="px-2.5 py-1 rounded border border-amber-500/50 bg-amber-950/40 text-amber-300 font-mono text-xs font-bold">
                    GRADE {rep.score.grade}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-space-950 p-2.5 rounded border border-slate-800/80 text-slate-300">
                  <div>
                    <span className="text-slate-500 block">SCORE:</span>
                    <span className="font-bold text-cyan-300">{rep.score.totalScore}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SCIENCE:</span>
                    <span>{rep.peakTelemetry.scienceDataTransmittedGb} GB</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">HEALTH:</span>
                    <span>{rep.peakTelemetry.finalHealthPercent}%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    onClick={() => handleInspect(rep)}
                    className="flex-1 py-1.5 bg-space-850 hover:bg-space-800 border border-slate-700 rounded text-xs font-tech font-bold uppercase text-slate-200 transition-colors"
                  >
                    INSPECT REPORT
                  </button>

                  <button
                    onClick={() => {
                      if (!compareReportA) setCompareReportA(rep);
                      else setCompareReportB(rep);
                    }}
                    className="px-3 py-1.5 bg-space-950 hover:bg-space-850 border border-slate-800 rounded text-xs font-mono text-purple-300 transition-colors"
                  >
                    {compareReportA?.id === rep.id ? 'COMPARE (A)' : compareReportB?.id === rep.id ? 'COMPARE (B)' : 'COMPARE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
