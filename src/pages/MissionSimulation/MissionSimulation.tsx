import React from 'react';
import { useGame } from '../../context/GameContext';
import { SpacecraftCanvas } from '../../three/SpacecraftCanvas';
import { STAGES_ORDER, formatMissionTime } from '../../game/engine/simulationEngine';
import { 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  AlertTriangle, 
  Radio, 
  Zap, 
  Fuel, 
  HardDrive, 
  Thermometer, 
  ShieldCheck, 
  Compass, 
  Activity,
  Layers,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

export const MissionSimulation: React.FC = () => {
  const { 
    simulation, 
    pauseSimulation, 
    resumeSimulation, 
    setSimulationTimeScale, 
    chooseEventOption,
    abortSimulation,
    components, 
    mission,
    orbit,
    setScreen
  } = useGame();

  if (!simulation) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-space-950 text-slate-400 font-mono text-sm">
        SIMULATION ENGINE STANDBY // NO ACTIVE FLIGHT SESSION
      </div>
    );
  }

  const currentStageIndex = STAGES_ORDER.indexOf(simulation.stage);
  const activeEvent = simulation.activeEvent;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-space-950 select-none overflow-hidden relative">
      {/* Dynamic In-Flight Crisis / Event Modal */}
      {activeEvent && !activeEvent.resolvedChoiceId && (
        <div className="absolute inset-0 z-50 bg-space-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-space-900 border border-amber-500/70 shadow-hud-amber rounded-xl max-w-2xl w-full p-6 space-y-6 animate-pulse-subtle">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-400 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  PRIORITY IN-FLIGHT ANOMALY // {activeEvent.systemAffected}
                </span>
                <h3 className="font-tech text-2xl font-bold text-slate-100 uppercase tracking-wider">
                  {activeEvent.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-space-950 p-4 rounded border border-slate-800 font-sans">
              {activeEvent.description}
            </p>

            <div className="space-y-3">
              <h4 className="font-tech text-xs font-bold text-slate-400 uppercase tracking-wider">
                EXECUTE COMMAND CONTINGENCY RESPONSE:
              </h4>

              {activeEvent.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => chooseEventOption(choice.id)}
                  className="w-full text-left p-4 rounded-lg bg-space-950/80 hover:bg-space-850 border border-slate-700/80 hover:border-cyan-400 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-tech font-bold text-sm text-cyan-300 group-hover:text-cyan-200 uppercase tracking-wider">
                      {choice.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">SELECT OPTION</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{choice.description}</p>
                  <div className="text-[11px] font-mono text-amber-300/90 flex flex-wrap gap-x-3">
                    {choice.resourceImpact.propellantDeltaKg && (
                      <span>FUEL: {choice.resourceImpact.propellantDeltaKg} kg</span>
                    )}
                    {choice.resourceImpact.batteryDeltaWh && (
                      <span>BATTERY: {choice.resourceImpact.batteryDeltaWh} Wh</span>
                    )}
                    {choice.resourceImpact.sciencePointsDelta && (
                      <span className="text-emerald-400">SCIENCE: +{choice.resourceImpact.sciencePointsDelta} pts</span>
                    )}
                    {choice.resourceImpact.damageDelta && (
                      <span className="text-red-400">DEGRADATION: -{choice.resourceImpact.damageDelta}%</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Top Telemetry & MET Header */}
      <div className="h-14 bg-space-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-slate-400">FLIGHT RECORDER ACTIVE:</span>
            <span className="text-cyan-300 font-bold tracking-wider">
              {formatMissionTime(simulation.elapsedSeconds)}
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-2 font-mono text-xs text-slate-400 border-l border-slate-800 pl-4">
            <span>TARGET:</span>
            <span className="text-slate-200">{mission.target.toUpperCase()} ({Math.round(simulation.distanceToTargetKm).toLocaleString()} KM)</span>
          </div>
        </div>

        {/* Simulation Speed Controls */}
        <div className="flex items-center space-x-2">
          {simulation.isPaused ? (
            <button
              onClick={resumeSimulation}
              className="p-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 rounded font-mono text-xs flex items-center space-x-1"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RESUME</span>
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="p-2 bg-space-950 hover:bg-space-850 border border-slate-700 text-slate-300 rounded font-mono text-xs flex items-center space-x-1"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE</span>
            </button>
          )}

          {[1, 2, 5, 10].map((spd) => (
            <button
              key={spd}
              onClick={() => setSimulationTimeScale(spd)}
              className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${
                simulation.timeScale === spd
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'bg-space-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {spd}X
            </button>
          ))}

          <button
            onClick={abortSimulation}
            className="p-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 rounded font-mono text-xs ml-2"
          >
            ABORT
          </button>
        </div>
      </div>

      {/* Flight Timeline Progress Ribbon */}
      <div className="bg-space-950 border-b border-slate-800 px-4 py-2 flex items-center space-x-2 overflow-x-auto no-scrollbar z-10 flex-shrink-0">
        {STAGES_ORDER.map((stage, idx) => {
          const isCurrent = simulation.stage === stage;
          const isPassed = currentStageIndex > idx;
          return (
            <div
              key={stage}
              className={`flex items-center space-x-2 px-3 py-1 rounded text-xs font-tech tracking-wider uppercase whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-sm'
                  : isPassed
                  ? 'bg-space-900 text-emerald-400 border border-slate-800'
                  : 'text-slate-500 border border-transparent'
              }`}
            >
              <span>0{idx + 1}. {stage.replace('_', ' ')}</span>
              {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />}
            </div>
          );
        })}
      </div>

      {/* Main Simulation Viewport & Telemetry HUD */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Telemetry Gauges Column */}
        <div className="w-full lg:w-72 bg-space-900/90 border-r border-slate-800 p-4 space-y-4 overflow-y-auto flex-shrink-0 z-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-2">
            <Activity className="w-4 h-4" />
            <span>PRIMARY BUS TELEMETRY</span>
          </div>

          {/* Battery State of Charge */}
          <div className="bg-space-950 p-3 rounded border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>BATTERY SOC:</span>
              </span>
              <span className="text-amber-300 font-bold">
                {Math.round((simulation.batteryLevelWh / Math.max(1, simulation.maxBatteryWh)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-300"
                style={{ width: `${Math.round((simulation.batteryLevelWh / Math.max(1, simulation.maxBatteryWh)) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex justify-between">
              <span>{Math.round(simulation.batteryLevelWh)} Wh</span>
              <span>Max: {simulation.maxBatteryWh} Wh</span>
            </div>
          </div>

          {/* Propellant Fuel Mass */}
          <div className="bg-space-950 p-3 rounded border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <Fuel className="w-3.5 h-3.5 text-blue-400" />
                <span>PROPELLANT:</span>
              </span>
              <span className="text-blue-300 font-bold">
                {Math.round(simulation.propellantRemainingKg)} kg
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${Math.round((simulation.propellantRemainingKg / Math.max(1, simulation.initialPropellantKg)) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Remaining</span>
              <span>Init: {simulation.initialPropellantKg} kg</span>
            </div>
          </div>

          {/* Solid-State Data Storage Buffer */}
          <div className="bg-space-950 p-3 rounded border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                <span>SSR BUFFER:</span>
              </span>
              <span className="text-purple-300 font-bold">
                {Math.round(simulation.dataStoredGb)} GB
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Downlinked:</span>
              <span className="text-emerald-400 font-bold">{Math.round(simulation.dataTransmittedGb)} GB</span>
            </div>
          </div>

          {/* Scientific Yield Points */}
          <div className="bg-space-950 p-3 rounded border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">SCIENCE DISCOVERIES:</span>
              <span className="text-cyan-400 font-bold text-sm">{simulation.sciencePoints} PTS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex justify-between">
              <span>Target:</span>
              <span>{mission.successConditions.minSciencePoints} pts</span>
            </div>
          </div>

          {/* Equipment Integrity */}
          <div className="bg-space-950 p-3 rounded border border-slate-800 space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">BUS HEALTH:</span>
              <span className="text-emerald-400 font-bold">{simulation.equipmentHealthPercent}%</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">HULL TEMP:</span>
              <span className="text-slate-300">{simulation.hullTempCelsius}°C</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">SIGNAL STRENGTH:</span>
              <span className="text-cyan-300">{simulation.signalStrength}%</span>
            </div>
          </div>
        </div>

        {/* Center: 3D Flight Viewport */}
        <div className="flex-1 h-full relative overflow-hidden bg-space-950">
          <SpacecraftCanvas
            components={components}
            selectedComponentId={null}
            onSelectComponent={() => {}}
            planetTarget={mission.target}
            isSimulating={true}
            cameraDistance={4.2}
          />

          {/* Mission Control Stage Callout Card */}
          <div className="absolute top-4 left-4 z-20 bg-space-900/90 border border-slate-800/90 p-4 rounded-lg backdrop-blur-md max-w-sm">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              CURRENT OPERATION: STAGE {currentStageIndex + 1} OF 8
            </div>
            <h3 className="font-tech text-xl font-bold text-slate-100 uppercase tracking-wider mb-1">
              {simulation.stage.replace('_', ' ')}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {simulation.stage === 'launch' && 'Atmospheric ascent and high dynamic pressure flight through upper atmosphere.'}
              {simulation.stage === 'deployment' && 'Solar wings unlatched. Star tracker attitude acquisition and telemetry lock.'}
              {simulation.stage === 'cruise' && 'Interplanetary transit across solar system. Monitoring battery charge and thermal loop.'}
              {simulation.stage === 'navigation' && 'Fine attitude alignment and Trajectory Correction Maneuver (TCM) burn.'}
              {simulation.stage === 'arrival' && 'Target celestial gravity capture. Firing main deceleration thruster.'}
              {simulation.stage === 'science_ops' && 'Acquiring high-resolution spectral and optical maps of target features.'}
              {simulation.stage === 'communication' && 'Downlinking raw compressed science telemetry to Deep Space Network.'}
              {simulation.stage === 'completed' && 'Flight objectives concluded. Ready for post-mission engineering evaluation.'}
            </p>
          </div>
        </div>

        {/* Right Event Log & Telemetry History */}
        <div className="w-full lg:w-80 bg-space-900/90 border-l border-slate-800 flex flex-col flex-shrink-0 z-10">
          <div className="p-3.5 border-b border-slate-800 bg-space-950/80 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Radio className="w-4 h-4" />
              <span>FLIGHT EVENT LOG</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
            {simulation.missionEventsLog.map((log, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded border ${
                  log.type === 'alert'
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : log.type === 'warning'
                    ? 'bg-red-950/30 border-red-500/50 text-red-200'
                    : log.type === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-space-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-500 mb-0.5">{log.time}</div>
                <div className="leading-snug">{log.message}</div>
              </div>
            ))}
          </div>

          {simulation.isCompleted && (
            <div className="p-4 border-t border-slate-800 bg-space-950">
              <button
                onClick={() => setScreen('mission-report')}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-2.5 px-4 rounded tracking-wider uppercase transition-all shadow-hud"
              >
                VIEW POST-MISSION REPORT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
