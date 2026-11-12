import React from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Scale, 
  DollarSign, 
  Zap, 
  Fuel, 
  HardDrive, 
  Radio, 
  Thermometer, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ResourceHUD: React.FC = () => {
  const { validation, mission, launchVehicle } = useGame();
  const m = validation.metrics;

  const massPercent = Math.min(100, Math.round((m.totalMassKg / mission.massLimit) * 100));
  const budgetPercent = Math.min(100, Math.round((m.totalCost / mission.budget) * 100));
  const isOverMass = m.totalMassKg > mission.massLimit;
  const isOverBudget = m.totalCost > mission.budget;
  const isPowerDeficit = m.netPowerW < 0;

  return (
    <div className="bg-space-900/95 border-b border-slate-800/80 px-4 py-2 text-xs font-mono select-none">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Mass */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>MASS</span>
            </span>
            <span className={isOverMass ? 'text-red-400 font-bold' : 'text-slate-300'}>
              {m.totalMassKg} / {mission.massLimit} kg
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isOverMass ? 'bg-red-500' : massPercent > 85 ? 'bg-amber-400' : 'bg-cyan-500'}`}
              style={{ width: `${massPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Budget */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>BUDGET</span>
            </span>
            <span className={isOverBudget ? 'text-red-400 font-bold' : 'text-slate-300'}>
              ${(m.totalCost / 1000).toFixed(1)}M / ${(mission.budget / 1000).toFixed(1)}M
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : budgetPercent > 85 ? 'bg-amber-400' : 'bg-emerald-500'}`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Electrical Power Balance */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>POWER</span>
            </span>
            <span className={isPowerDeficit ? 'text-red-400 font-bold' : 'text-amber-300'}>
              {m.powerGenerationW}W / {m.powerConsumptionW}W
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Net:</span>
            <span className={isPowerDeficit ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {m.netPowerW >= 0 ? `+${m.netPowerW}W` : `${m.netPowerW}W`}
            </span>
          </div>
        </div>

        {/* 4. Delta-V & Fuel */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Fuel className="w-3.5 h-3.5 text-blue-400" />
              <span>DELTA-V</span>
            </span>
            <span className={m.totalDeltaVMs < mission.minDeltaV ? 'text-red-400 font-bold' : 'text-blue-300'}>
              {m.totalDeltaVMs} m/s
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Req:</span>
            <span>{mission.minDeltaV} m/s</span>
          </div>
        </div>

        {/* 5. Storage Buffer */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span>STORAGE</span>
            </span>
            <span className="text-purple-300">{m.storageCapacityGb} GB</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Gen Rate:</span>
            <span>{m.dataGenerationMbps} Mbps</span>
          </div>
        </div>

        {/* 6. Downlink Bandwidth */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>DOWNLINK</span>
            </span>
            <span className="text-cyan-300">{m.downlinkRateMbps} Mbps</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Target:</span>
            <span>{mission.target}</span>
          </div>
        </div>

        {/* 7. Battery Shadow Endurance */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>ECLIPSE</span>
            </span>
            <span className="text-rose-300">{m.eclipseMarginMinutes} min</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Battery:</span>
            <span>{m.batteryCapacityWh} Wh</span>
          </div>
        </div>

        {/* 8. Reliability */}
        <div className="bg-space-950/70 p-2 rounded border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>RELIABILITY</span>
            </span>
            <span className="text-emerald-300">{Math.round(m.spacecraftReliabilityIndex * 100)}%</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Booster:</span>
            <span className="truncate max-w-[80px]">{launchVehicle.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
