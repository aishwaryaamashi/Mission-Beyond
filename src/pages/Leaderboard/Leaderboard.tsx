import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { 
  Trophy, 
  Award, 
  Users, 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  ArrowLeft,
  Calendar,
  Lock,
  CheckCircle2
} from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { leaderboard, achievements, setScreen } = useGame();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [filterMode, setFilterMode] = useState<'all' | 'solo' | 'multiplayer'>('all');

  const filteredLeaderboard = leaderboard.filter(e => {
    if (filterMode === 'solo') return !e.isMultiplayer;
    if (filterMode === 'multiplayer') return e.isMultiplayer;
    return true;
  });

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
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
          <Trophy className="w-4 h-4" />
          <span>HALL OF AEROSPACE DISCOVERY</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          LEADERBOARDS & FLIGHT HONORS
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Track top-performing flight directors, engineering efficiency records, and unlockable mission achievements.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-tech text-sm tracking-wider uppercase transition-all ${
            activeTab === 'leaderboard'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>GLOBAL HIGH SCORES</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-tech text-sm tracking-wider uppercase transition-all ${
            activeTab === 'achievements'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>FLIGHT ACHIEVEMENTS ({achievements.filter(a => a.isUnlocked).length}/{achievements.length})</span>
        </button>
      </div>

      {activeTab === 'leaderboard' ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            {(['all', 'solo', 'multiplayer'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1.5 rounded text-xs font-mono uppercase transition-colors ${
                  filterMode === m
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-space-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-space-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 p-3.5 bg-space-950 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <span className="col-span-1">RANK</span>
              <span className="col-span-4">COMMANDER / CREW</span>
              <span className="col-span-3">MISSION SCENARIO</span>
              <span className="col-span-2 text-right">SCIENCE RETURN</span>
              <span className="col-span-2 text-right">TOTAL SCORE</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {filteredLeaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-12 gap-2 p-4 text-xs font-mono items-center hover:bg-space-850/60 transition-colors"
                >
                  <div className="col-span-1 font-bold">
                    {idx === 0 ? (
                      <span className="text-amber-400 font-bold">#01</span>
                    ) : idx === 1 ? (
                      <span className="text-slate-300 font-bold">#02</span>
                    ) : idx === 2 ? (
                      <span className="text-amber-600 font-bold">#03</span>
                    ) : (
                      <span className="text-slate-500">#{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    )}
                  </div>

                  <div className="col-span-4">
                    <div className="font-tech font-bold text-sm text-slate-100 uppercase">
                      {entry.playerName}
                    </div>
                    {entry.teamName && (
                      <div className="text-[10px] text-blue-400 flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{entry.teamName}</span>
                      </div>
                    )}
                  </div>

                  <div className="col-span-3 text-slate-400 uppercase text-[11px] truncate">
                    {entry.missionId.replace('mission-', '').replace('-', ' ')}
                  </div>

                  <div className="col-span-2 text-right text-emerald-400">
                    {entry.scienceDataGb} GB
                  </div>

                  <div className="col-span-2 text-right">
                    <span className="text-amber-300 font-bold text-sm">{entry.score.toLocaleString()}</span>
                    <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/40 bg-amber-950/60 text-amber-300">
                      {entry.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Achievements Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                ach.isUnlocked
                  ? 'bg-space-900 border-cyan-500/50 shadow-hud'
                  : 'bg-space-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ach.isUnlocked
                        ? 'bg-cyan-950 border border-cyan-400 text-cyan-400'
                        : 'bg-space-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    {ach.isUnlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {ach.category}
                  </span>
                </div>

                <h4 className="font-tech font-bold text-base text-slate-100 uppercase tracking-wider mb-1">
                  {ach.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {ach.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] font-mono">
                {ach.isUnlocked ? (
                  <span className="text-emerald-400 font-bold">UNLOCKED</span>
                ) : (
                  <span className="text-slate-600 uppercase">LOCKED</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
