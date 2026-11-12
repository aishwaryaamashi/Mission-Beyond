import React from 'react';
import { useGame } from '../../context/GameContext';
import { Screen } from '../../types/game';
import { 
  Rocket, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Activity, 
  FileText, 
  BookOpen, 
  Trophy, 
  User, 
  Box, 
  Users,
  AlertTriangle
} from 'lucide-react';

export const HeaderHUD: React.FC = () => {
  const { 
    screen, 
    setScreen, 
    gameMode, 
    difficulty, 
    mission, 
    validation,
    profile
  } = useGame();

  const navItems: { id: Screen; label: string; icon: React.ReactNode; requiresMission?: boolean }[] = [
    { id: 'mission-selection', label: 'Missions', icon: <Rocket className="w-4 h-4" /> },
    { id: 'mission-briefing', label: 'Briefing', icon: <FileText className="w-4 h-4" />, requiresMission: true },
    { id: 'spacecraft-builder', label: '3D Builder', icon: <Layers className="w-4 h-4" /> },
    { id: 'mission-configuration', label: 'Trajectory', icon: <Sliders className="w-4 h-4" /> },
    { id: 'mission-validation', label: 'Validation', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'mission-simulation', label: 'Simulation', icon: <Activity className="w-4 h-4" /> },
    { id: 'learning-center', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { id: 'mission-archive', label: 'Archive', icon: <Box className="w-4 h-4" /> }
  ];

  if (screen === 'main-menu') {
    return null;
  }

  return (
    <header className="h-14 bg-space-900/90 border-b border-slate-800/80 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0 select-none">
      {/* Brand & Mission Status */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setScreen('main-menu')}
          className="flex items-center space-x-2 text-left group transition-all"
        >
          <div className="w-7 h-7 bg-cyan-950/60 border border-cyan-500/40 rounded flex items-center justify-center text-cyan-400 group-hover:border-cyan-400">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <div className="font-tech text-xs tracking-wider text-slate-100 font-bold group-hover:text-cyan-300">
              MISSION: BEYOND
            </div>
            <div className="text-[10px] font-mono text-cyan-400/70 uppercase">
              {mission.code} // {gameMode.toUpperCase()}
            </div>
          </div>
        </button>

        {/* Validation Badge Indicator */}
        <button
          onClick={() => setScreen('mission-validation')}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium border transition-colors ${
            validation.overallStatus === 'PASS'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/30'
              : validation.overallStatus === 'WARNING'
              ? 'bg-amber-950/40 text-amber-300 border-amber-500/40 hover:bg-amber-900/30'
              : 'bg-red-950/40 text-red-300 border-red-500/40 hover:bg-red-900/30 animate-pulse'
          }`}
        >
          {validation.overallStatus === 'PASS' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5" />
          )}
          <span>{validation.overallStatus} ({validation.issues.length} {validation.issues.length === 1 ? 'item' : 'items'})</span>
        </button>
      </div>

      {/* Screen Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navItems.map((item) => {
          const isActive = screen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-medium font-tech tracking-wider uppercase transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right User & Meta Controls */}
      <div className="flex items-center space-x-3">
        {gameMode === 'coop' && (
          <button
            onClick={() => setScreen('team-command')}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono bg-blue-950/60 text-blue-300 border border-blue-500/40 hover:bg-blue-900/40"
          >
            <Users className="w-3.5 h-3.5" />
            <span>CREW ROOM</span>
          </button>
        )}

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-400 bg-space-950/80 px-2.5 py-1 rounded border border-slate-800">
          <span className="text-slate-500">DIFF:</span>
          <span className="text-amber-400 uppercase">{difficulty}</span>
        </div>

        <button
          onClick={() => setScreen('profile')}
          className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-space-850 hover:bg-space-800 border border-slate-700/60 px-2.5 py-1 rounded transition-colors"
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span className="max-w-[120px] truncate">{profile.callsign}</span>
        </button>
      </div>
    </header>
  );
};
