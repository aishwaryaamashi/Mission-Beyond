import React, { useState, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { generateAdvisorAnalysis, answerAdvisorQuery } from '../../game/advisor/missionAdvisor';
import { 
  Bot, 
  Send, 
  AlertCircle, 
  Sparkles, 
  ChevronRight, 
  X, 
  Wrench, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const AdvisorDrawer: React.FC = () => {
  const { components, mission, validation, launchVehicle, orbit } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'advisor'; text: string; time: string }[]>([
    {
      sender: 'advisor',
      text: `Greetings, Commander. I am your Flight Systems Advisor. I monitor real-time CAD bus configurations, mass balance, link budgets, and orbital mechanics. How can I assist your mission design?`,
      time: 'ONLINE'
    }
  ]);

  const recommendations = useMemo(() => {
    return generateAdvisorAnalysis(components, mission, validation, launchVehicle, orbit);
  }, [components, mission, validation, launchVehicle, orbit]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || query;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const replyText = answerAdvisorQuery(q, components, mission, validation, launchVehicle, orbit);
    const advisorMsg = {
      sender: 'advisor' as const,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, advisorMsg]);
    setQuery('');
  };

  const sampleQuestions = [
    'Why is my spacecraft running out of power?',
    'How can I improve my Delta-V budget?',
    'What launch vehicle is best for this mission?',
    'Explain the current validation warnings'
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-space-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 p-3 rounded-full shadow-hud flex items-center space-x-2 transition-all hover:scale-105 group"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-cyan-400" />
            {validation.issues.some(i => i.status === 'CRITICAL') && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <span className="font-tech text-xs tracking-wider pr-1 hidden sm:inline">AI ADVISOR</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-space-900/95 border-l border-slate-800 shadow-2xl backdrop-blur-xl z-50 flex flex-col select-none">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-space-950/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-tech font-bold text-sm text-slate-100 tracking-wider">AI MISSION ADVISOR</h3>
                <p className="text-[10px] font-mono text-cyan-400/80">SYSTEM STATUS: ANALYZING LIVE TELEMETRY</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Recommendations Section */}
          <div className="p-3 border-b border-slate-800 bg-space-950/40 max-h-48 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between text-[11px] font-tech text-slate-400 tracking-wider">
              <span className="flex items-center space-x-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>ACTIVE DIAGNOSTIC DIRECTIVES</span>
              </span>
              <span className="font-mono text-[10px]">{recommendations.length} items</span>
            </div>

            {recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-xs border ${
                  rec.type === 'urgent'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : rec.type === 'optimization'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] opacity-80 mb-0.5">
                  <span>[{rec.subsystem}]</span>
                  <span className="uppercase">{rec.type}</span>
                </div>
                <div className="font-semibold text-[11px] mb-0.5">{rec.title}</div>
                <div className="text-[10px] text-slate-300 opacity-90 line-clamp-2">{rec.message}</div>
                {rec.suggestedAction && (
                  <div className="mt-1 text-[10px] font-mono text-cyan-300 flex items-center space-x-1">
                    <ChevronRight className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{rec.suggestedAction}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[9px] font-mono text-slate-500 mb-0.5">
                  {m.sender === 'user' ? 'YOU' : 'AI ADVISOR'} • {m.time}
                </div>
                <div
                  className={`p-2.5 rounded-lg max-w-[90%] whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-100'
                      : 'bg-space-850 border border-slate-700/60 text-slate-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Preset Prompts */}
          <div className="px-3 py-1.5 border-t border-slate-800 bg-space-950/60 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-mono transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-800 bg-space-950 flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about power, mass, Delta-V..."
              className="flex-1 bg-space-850 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              onClick={() => handleSend()}
              className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
