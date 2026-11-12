import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { ResourceHUD } from '../../components/dashboards/ResourceHUD';
import { 
  Users, 
  Vote, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ChevronRight, 
  Rocket, 
  Layers, 
  MessageSquare,
  ShieldCheck,
  Bot,
  UserCheck
} from 'lucide-react';

export const TeamCommandCenter: React.FC = () => {
  const { 
    multiplayerRoom, 
    leaveMultiplayerRoom, 
    proposeTeamDecision,
    setScreen, 
    mission,
    validation
  } = useGame();

  const [proposalInput, setProposalInput] = useState('');

  if (!multiplayerRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3.5rem)] bg-space-950 text-slate-400 font-mono text-sm space-y-4">
        <div>NO ACTIVE CREW ROOM JOINED</div>
        <button
          onClick={() => setScreen('lobby')}
          className="px-4 py-2 bg-cyan-600 text-white font-tech rounded"
        >
          JOIN OR CREATE CREW ROOM
        </button>
      </div>
    );
  }

  const handlePropose = () => {
    if (!proposalInput.trim()) return;
    proposeTeamDecision(proposalInput.trim());
    setProposalInput('');
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-space-950 select-none pb-12">
      <ResourceHUD />

      <div className="max-w-6xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => leaveMultiplayerRoom()}
            className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>DISCONNECT FROM CREW ROOM</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setScreen('spacecraft-builder')}
              className="px-4 py-2 bg-space-900 hover:bg-space-850 border border-slate-700 text-xs font-tech font-bold uppercase text-slate-200 rounded flex items-center space-x-1.5 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>CREW CAD BUILDER</span>
            </button>

            <button
              onClick={() => setScreen('mission-validation')}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-tech font-bold uppercase rounded flex items-center space-x-1.5 transition-all shadow-hud"
            >
              <Rocket className="w-4 h-4" />
              <span>FLIGHT VALIDATION</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Room Header Banner */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
              <span>CREW OPS // ROOM CODE: [{multiplayerRoom.roomCode}]</span>
              <span>//</span>
              <span className="text-emerald-400">ENCRYPTED PEER LINK ACTIVE</span>
            </div>
            <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
              {multiplayerRoom.roomName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active Mission: <span className="text-slate-200 font-bold">{mission.name}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-space-950 p-3 rounded-lg border border-slate-800 font-mono text-xs">
            <span className="text-slate-400">CREW COMPLEMENT:</span>
            <span className="text-cyan-300 font-bold">{multiplayerRoom.members.length} / 4 ROLES ACTIVE</span>
          </div>
        </div>

        {/* 4 Crew Roles Roster */}
        <div>
          <h3 className="font-tech text-xl font-bold text-slate-100 uppercase tracking-wider mb-4">
            FLIGHT CREW ROSTER & WORKSPACE ASSIGNMENTS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {multiplayerRoom.members.map((member) => (
              <div
                key={member.id}
                className="bg-space-900 border border-slate-800 p-5 rounded-xl space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-0.5">
                      ROLE: {member.role.toUpperCase()}
                    </span>
                    <h4 className="font-tech font-bold text-base text-slate-100 uppercase">
                      {member.name}
                    </h4>
                  </div>
                  {member.isSimulated ? (
                    <span className="p-1.5 rounded bg-space-950 border border-slate-800 text-slate-400" title="Simulated Crew AI">
                      <Bot className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-400" title="Human Flight Commander">
                      <UserCheck className="w-4 h-4" />
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  {member.role === 'director' && 'Authorizes countdown & abort decisions.'}
                  {member.role === 'engineer' && 'Authorizes structural CAD & mass limits.'}
                  {member.role === 'scientist' && 'Authorizes sensor selection & passes.'}
                  {member.role === 'systems' && 'Authorizes link budgets & battery limits.'}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">TELEMETRY SYNC:</span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ONLINE</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crew Voting & Decision System */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Vote Console */}
          <div className="lg:col-span-2 bg-space-900 border border-slate-800 p-6 rounded-xl space-y-6">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Vote className="w-5 h-5 text-amber-400" />
              <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider">
                CREW DECISION & QUORUM VOTING CONSOLE
              </h3>
            </div>

            {multiplayerRoom.activeVote ? (
              <div className="bg-space-950 p-5 rounded-lg border border-amber-500/50 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 uppercase">
                    PROPOSED BY: {multiplayerRoom.activeVote.proposedBy}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    VOTE PASSED (3/4 MAJORITY)
                  </span>
                </div>

                <h4 className="font-tech text-xl font-bold text-slate-100 uppercase">
                  "{multiplayerRoom.activeVote.question}"
                </h4>

                <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                  {multiplayerRoom.members.map((m) => (
                    <div key={m.id} className="bg-space-900 p-2 rounded border border-slate-800 text-center">
                      <span className="text-slate-400 block text-[10px] truncate">{m.role.toUpperCase()}</span>
                      <span className="text-emerald-400 font-bold">AYE</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-space-950 p-6 rounded border border-slate-800 text-center text-xs font-mono text-slate-500">
                NO ACTIVE PROPOSALS PENDING CREW VOTE
              </div>
            )}

            {/* Propose New Decision Input */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono text-slate-400 uppercase">
                SUBMIT MAJOR FLIGHT DECISION FOR CREW VOTE:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. Authorize emergency retrograde burn or activate high-gain Ka-band transponder..."
                  value={proposalInput}
                  onChange={(e) => setProposalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePropose()}
                  className="flex-1 bg-space-950 border border-slate-700 rounded px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={handlePropose}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-tech font-bold px-4 py-2 rounded uppercase text-xs transition-colors"
                >
                  CALL VOTE
                </button>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-space-900 border border-slate-800 p-6 rounded-xl flex flex-col space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider">
                CREW ACTIVITY FEED
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs max-h-72">
              {multiplayerRoom.activityLog.map((log) => (
                <div key={log.id} className="bg-space-950 p-2.5 rounded border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="text-cyan-400 font-bold uppercase">{log.role}</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="text-slate-300 leading-snug">{log.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
