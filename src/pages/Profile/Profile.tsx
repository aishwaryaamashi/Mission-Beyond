import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Difficulty } from '../../types/game';
import { 
  User, 
  Settings, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Sliders, 
  ArrowLeft,
  Save,
  Check
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { profile, updateProfile, difficulty, setDifficulty, setScreen } = useGame();
  const [callsign, setCallsign] = useState(profile.callsign);
  const [organization, setOrganization] = useState(profile.organization);
  const [soundEnabled, setSoundEnabled] = useState(profile.soundEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateProfile({
      callsign,
      organization,
      soundEnabled,
      preferredDifficulty: difficulty
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 select-none space-y-8">
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
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <Settings className="w-4 h-4" />
          <span>FLIGHT DIRECTOR PROFILE & PREFERENCES</span>
        </div>
        <h2 className="font-tech text-3xl font-bold tracking-wider text-slate-100 uppercase">
          COMMANDER PROFILE & FLIGHT SETTINGS
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure telemetry audio, mission difficulty constraints, and personnel credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="bg-space-900 border border-slate-800 p-6 rounded-xl space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-950 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-hud">
            <User className="w-10 h-10" />
          </div>

          <div>
            <h3 className="font-tech text-xl font-bold text-slate-100 uppercase tracking-wider">
              {profile.callsign}
            </h3>
            <p className="text-xs font-mono text-cyan-400/80 mt-1 uppercase">
              {profile.organization}
            </p>
          </div>

          <div className="bg-space-950 p-4 rounded border border-slate-800 space-y-2 text-xs font-mono text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">FLIGHTS LOGGED:</span>
              <span className="text-slate-200 font-bold">{profile.missionsCompleted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SCIENCE DOWNLINKED:</span>
              <span className="text-emerald-400 font-bold">{profile.totalScienceCollectedGb} GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">CAREER HIGH SCORE:</span>
              <span className="text-amber-400 font-bold">{profile.highestScore.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 bg-space-900 border border-slate-800 p-6 rounded-xl space-y-6">
          <h3 className="font-tech text-lg font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">
            MISSION PARAMETERS & ENVIRONMENT CONFIGURATION
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                COMMANDER CALLSIGN
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                AEROSPACE AGENCY / ORGANIZATION
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase mb-2">
                DEFAULT GAMEPLAY DIFFICULTY
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`py-2 px-3 rounded text-xs font-mono uppercase font-bold border transition-all ${
                      difficulty === d
                        ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-hud'
                        : 'bg-space-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded bg-space-950 border-slate-700 text-cyan-500 focus:ring-0 w-4 h-4"
                />
                <span className="text-xs font-mono text-slate-300 flex items-center space-x-2">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                  <span>ENABLE MISSION CONTROL AUDIO TELEMETRY AMBIENCE</span>
                </span>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleSave}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold py-2.5 px-6 rounded tracking-wider uppercase transition-all shadow-hud flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>PERSIST CONFIGURATION</span>
            </button>

            {savedSuccess && (
              <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>PROFILE SAVED TO LOCAL STORAGE</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
