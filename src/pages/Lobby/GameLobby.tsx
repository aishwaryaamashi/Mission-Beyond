import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { TeamRole } from '../../types/game';
import { 
  Users, 
  User, 
  Trophy, 
  ShieldAlert, 
  CheckCircle, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Bot
} from 'lucide-react';

export const GameLobby: React.FC = () => {
  const { setScreen, setGameMode, createMultiplayerRoom } = useGame();
  const [activeTab, setActiveTab] = useState<'coop' | 'competitive'>('coop');
  const [roomName, setRoomName] = useState('Odyssey Operations Room');
  const [selectedRole, setSelectedRole] = useState<TeamRole>('director');

  const rolesList: { role: TeamRole; name: string; desc: string; responsibilities: string[] }[] = [
    {
      role: 'director',
      name: 'Mission Director',
      desc: 'Overall flight commander with final go/no-go abort authority and timeline management.',
      responsibilities: ['Authorizes launch countdown', 'Validates mission objectives', 'Confirms emergency contingency maneuvers']
    },
    {
      role: 'engineer',
      name: 'Spacecraft Engineer',
      desc: 'Structural architect managing bus structural loads, mass allowances, and delta-V margins.',
      responsibilities: ['Selects structural bus and mounting geometry', 'Maintains strict mass margin', 'Oversees engine thrust and propulsion']
    },
    {
      role: 'scientist',
      name: 'Science Specialist',
      desc: 'Payload scientist maximizing sensor yield, spectrometer filters, and observation returns.',
      responsibilities: ['Chooses camera & spectrometer instruments', 'Prioritizes science collection passes', 'Evaluates discovery returns']
    },
    {
      role: 'systems',
      name: 'Systems Manager',
      desc: 'Telecommunications and electrical manager balancing solar flux, batteries, and downlink.',
      responsibilities: ['Monitors power draw and battery depth-of-discharge', 'Calculates link budget & DSN antenna passes', 'Manages solid-state recorder buffer']
    }
  ];

  const handleLaunchCoop = () => {
    createMultiplayerRoom(roomName, 'coop', selectedRole);
  };

  const handleLaunchCompetitive = () => {
    createMultiplayerRoom(roomName, 'competitive', 'director');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Back button */}
      <button
        onClick={() => setScreen('main-menu')}
        className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO MAIN MENU</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <Users className="w-4 h-4" />
          <span>COLLABORATIVE AEROSPACE OPERATIONS</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          MULTIPLAYER CREW COMMAND CENTER
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Coordinate with up to 4 specialized flight crew roles. Real-time telemetry sync, shared voting on mission-critical maneuvers, or compete in global tournament brackets.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex space-x-2 border-b border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab('coop')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-tech text-sm tracking-wider uppercase transition-all ${
            activeTab === 'coop'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>COOPERATIVE CREW ROOM</span>
        </button>

        <button
          onClick={() => setActiveTab('competitive')}
          className={`flex items-center space-x-2 px-5 py-3 border-b-2 font-tech text-sm tracking-wider uppercase transition-all ${
            activeTab === 'competitive'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>COMPETITIVE TIME TRIAL</span>
        </button>
      </div>

      {activeTab === 'coop' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Room Settings */}
          <div className="bg-space-900 border border-slate-800 p-6 rounded-lg space-y-6">
            <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wider uppercase border-b border-slate-800 pb-3">
              CREW ROOM SETUP
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                MISSION ROOM IDENTIFIER
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="bg-space-950/60 p-4 rounded border border-slate-800 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>SIMULATION SYNC:</span>
                <span className="text-emerald-400">LOCAL PEER DEMO</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI CREW MEMBERS:</span>
                <span className="text-cyan-400">3 SYNCHRONIZED BOTS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>VOTING QUORUM:</span>
                <span className="text-amber-400">75% MAJORITY</span>
              </div>
            </div>

            <button
              onClick={handleLaunchCoop}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-3 px-4 rounded tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-hud"
            >
              <span>ESTABLISH CREW LINK</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Role Selection (4 Roles) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-tech text-lg font-bold text-slate-100 tracking-wider uppercase">
              SELECT YOUR OPERATIONAL CREW ROLE
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rolesList.map((r) => {
                const isSelected = selectedRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => setSelectedRole(r.role)}
                    className={`cursor-pointer p-5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-hud'
                        : 'bg-space-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-tech font-bold text-base text-slate-100 uppercase tracking-wider">
                        {r.name}
                      </span>
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {r.desc}
                    </p>
                    <div className="space-y-1">
                      {r.responsibilities.map((resp, idx) => (
                        <div key={idx} className="text-[11px] font-mono text-cyan-300/80 flex items-center space-x-1.5">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Competitive Tournament View */
        <div className="bg-space-900 border border-slate-800 p-8 rounded-lg max-w-3xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-amber-950/80 border border-amber-500/50 rounded-full flex items-center justify-center text-amber-400 mx-auto shadow-hud-amber">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-tech text-2xl font-bold text-slate-100 uppercase tracking-wider">
              STANDARDIZED TOURNAMENT BENCHMARK
            </h3>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              All teams receive identical mission parameters, budgets, and random seeds. Your score is graded on science return, delta-V efficiency, and surviving in-flight crises.
            </p>
          </div>

          <div className="bg-space-950 p-4 rounded border border-slate-800 max-w-md mx-auto space-y-2 text-xs font-mono text-slate-300 text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">BENCHMARK MISSION:</span>
              <span className="text-cyan-400">MB-MARS-02 PATHFINDER</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">MAXIMUM SCORE:</span>
              <span className="text-amber-400">10,000 PTS (GRADE S)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CONSTRAINTS:</span>
              <span>FIXED 1,200 KG / $65.0M</span>
            </div>
          </div>

          <button
            onClick={handleLaunchCompetitive}
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-tech font-bold py-3 px-8 rounded tracking-wider uppercase transition-all shadow-hud-amber inline-flex items-center space-x-2"
          >
            <span>ENTER TOURNAMENT TRIAL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
