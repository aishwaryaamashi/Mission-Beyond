import React from 'react';
import { useGame } from '../../context/GameContext';
import { LAUNCH_VEHICLES } from '../../game/database/launchVehicles';
import { ORBIT_CONFIGURATIONS } from '../../game/database/orbits';
import { OrbitType } from '../../types/game';
import { ResourceHUD } from '../../components/dashboards/ResourceHUD';
import { 
  Rocket, 
  Orbit, 
  Radio, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowLeft,
  DollarSign,
  Scale,
  CheckCircle2,
  Sliders
} from 'lucide-react';

export const MissionConfiguration: React.FC = () => {
  const { 
    launchVehicle, 
    setLaunchVehicle, 
    orbit, 
    setOrbit, 
    missionConfig, 
    updateMissionConfig,
    setScreen,
    mission,
    validation
  } = useGame();

  const orbitOptions = Object.values(ORBIT_CONFIGURATIONS);

  const timelineStages = [
    { name: 'Launch & Ascend', desc: 'Booster ignition, max-Q aerodynamic load, fairing separation' },
    { name: 'Bus Deployment', desc: 'Upper stage separation, solar array unfolding, antenna lock' },
    { name: 'Cruise Transit', desc: 'Interplanetary transit, solar flux tracking, passive thermal control' },
    { name: 'Trajectory Correction (TCM)', desc: 'Engine trim burns to correct orbital inclination and entry corridor' },
    { name: 'Target Orbital Capture', desc: 'Retrograde deceleration burn into stable science orbit' },
    { name: 'Science Operations', desc: 'Sensor payload activation, multi-spectral mapping, surface imaging' },
    { name: 'Deep Space Telemetry Downlink', desc: 'High-gain dish pointing, Deep Space Network carrier lock' },
    { name: 'Mission Evaluation', desc: 'Objective validation, discovery analysis, flight recorder debrief' }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-space-950 select-none pb-12">
      <ResourceHUD />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setScreen('spacecraft-builder')}
            className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO 3D BUILDER</span>
          </button>

          <button
            onClick={() => setScreen('mission-validation')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-2 px-6 rounded tracking-wider uppercase flex items-center space-x-2 transition-all shadow-hud"
          >
            <span>PROCEED TO ENGINEERING VALIDATION</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Sliders className="w-4 h-4" />
            <span>FLIGHT DYNAMICS ARCHITECTURE</span>
          </div>
          <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
            MISSION TRAJECTORY & VEHICLE CONFIGURATION
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Allocate your booster rocket, define orbital geometry, configure ground communication arrays, and review the mission flight sequence.
          </p>
        </div>

        {/* 1. Launch Vehicle Selector */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-cyan-400" />
              <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wider uppercase">
                LAUNCH VEHICLE MANIFEST
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              PAYLOAD CAPACITY MUST EXCEED {validation.metrics.totalMassKg} KG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LAUNCH_VEHICLES.map((lv) => {
              const isSelected = launchVehicle.id === lv.id;
              let capacity = lv.payloadCapacityLeo;
              if (orbit.id === 'lunar_polar' || orbit.id === 'geo') capacity = lv.payloadCapacityGto;
              else if (orbit.id === 'mars_transfer' || orbit.id === 'heliocentric') capacity = lv.payloadCapacityEscape;

              const isCapacityShort = validation.metrics.totalMassKg > capacity;

              return (
                <div
                  key={lv.id}
                  onClick={() => updateMissionConfig({ launchVehicleId: lv.id })}
                  className={`p-4 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-hud'
                      : isCapacityShort
                      ? 'bg-space-950/60 border-red-900/50 opacity-75'
                      : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-tech font-bold text-sm text-slate-100 uppercase tracking-wider">
                        {lv.name}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">
                      {lv.manufacturer}
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {lv.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">BOOSTER COST:</span>
                      <span className="text-emerald-400">${(lv.cost / 1000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">TARGET CAPACITY:</span>
                      <span className={isCapacityShort ? 'text-red-400 font-bold' : 'text-cyan-300'}>
                        {capacity} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">RELIABILITY:</span>
                      <span>{Math.round(lv.reliability * 100)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Target Orbit / Trajectory Selection */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Orbit className="w-5 h-5 text-blue-400" />
            <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wider uppercase">
              ORBITAL INSERTION PROFILE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orbitOptions.map((orb) => {
              const isSelected = orbit.id === orb.id;
              return (
                <div
                  key={orb.id}
                  onClick={() => updateMissionConfig({ orbitType: orb.id })}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-400 shadow-hud'
                      : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-tech font-bold text-sm text-slate-100 uppercase tracking-wider">
                      {orb.name}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </div>
                  <span className="text-[11px] font-mono text-blue-400/80 block mb-2">
                    {orb.altitude}
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {orb.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-300">
                    <div>ΔV REQ: {orb.deltaVRequired} m/s</div>
                    <div>SOLAR FLUX: {Math.round(orb.solarFluxMultiplier * 100)}%</div>
                    <div>COMM DELAY: {orb.commDelaySeconds}s</div>
                    <div>ECLIPSE: {orb.eclipsePercentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Communication Network & Science Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Radio className="w-5 h-5 text-purple-400" />
              <h3 className="font-tech text-base font-bold text-slate-100 tracking-wider uppercase">
                GROUND TELEMETRY LINK NETWORK
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { id: 'dsn', name: 'NASA Deep Space Network (DSN)', desc: '70-meter parabolic dishes in Goldstone, Madrid, and Canberra. Extreme sensitivity.' },
                { id: 'commercial', name: 'Commercial Ground Station Network', desc: 'High orbital pass frequency for polar and low-Earth orbits.' },
                { id: 'direct_earth', name: 'Direct Earth Relays', desc: 'Direct-to-ground downlinks with line-of-sight tracking.' }
              ].map((net) => (
                <label
                  key={net.id}
                  className={`flex items-start space-x-3 p-3 rounded border cursor-pointer transition-all ${
                    missionConfig.commGroundNetwork === net.id
                      ? 'bg-purple-950/40 border-purple-400'
                      : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="commNetwork"
                    checked={missionConfig.commGroundNetwork === net.id}
                    onChange={() => updateMissionConfig({ commGroundNetwork: net.id as any })}
                    className="mt-1 text-purple-500 focus:ring-0"
                  />
                  <div>
                    <div className="font-tech font-bold text-xs text-slate-200 uppercase">{net.name}</div>
                    <div className="text-[11px] text-slate-400">{net.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="font-tech text-base font-bold text-slate-100 tracking-wider uppercase">
                SCIENCE SCHEDULING PRIORITY
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { id: 'conservative', name: 'Conservative (High Power Margin)', desc: 'Power down sensors during shadow; preserve battery depth of discharge below 25%.' },
                { id: 'balanced', name: 'Balanced Flight Protocol', desc: 'Optimal scientific output balancing link budget, solar recharge, and thermal loops.' },
                { id: 'aggressive', name: 'Aggressive Discovery (High Yield)', desc: 'Run framing cameras and radar continuously during prime passes. Heavy battery draw.' }
              ].map((pri) => (
                <label
                  key={pri.id}
                  className={`flex items-start space-x-3 p-3 rounded border cursor-pointer transition-all ${
                    missionConfig.scienceSchedulingPriority === pri.id
                      ? 'bg-amber-950/40 border-amber-400'
                      : 'bg-space-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="sciencePriority"
                    checked={missionConfig.scienceSchedulingPriority === pri.id}
                    onChange={() => updateMissionConfig({ scienceSchedulingPriority: pri.id as any })}
                    className="mt-1 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <div className="font-tech font-bold text-xs text-slate-200 uppercase">{pri.name}</div>
                    <div className="text-[11px] text-slate-400">{pri.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Flight Sequence Preview */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-tech text-base font-bold text-slate-100 tracking-wider uppercase">
              8-STAGE SIMULATION TIMELINE SEQUENCE
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {timelineStages.map((stage, idx) => (
              <div key={idx} className="bg-space-950 p-3 rounded border border-slate-800/80">
                <span className="font-mono text-cyan-400 text-xs font-bold block mb-1">
                  STAGE 0{idx + 1}
                </span>
                <h4 className="font-tech font-bold text-xs text-slate-200 uppercase mb-1">
                  {stage.name}
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
