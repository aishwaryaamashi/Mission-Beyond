import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { HeaderHUD } from './components/navigation/HeaderHUD';
import { AdvisorDrawer } from './components/advisor/AdvisorDrawer';

// Screens
import { MainMenu } from './pages/MainMenu/MainMenu';
import { GameLobby } from './pages/Lobby/GameLobby';
import { MissionSelection } from './pages/MissionSelection/MissionSelection';
import { MissionBriefing } from './pages/MissionBriefing/MissionBriefing';
import { TeamCommandCenter } from './pages/TeamCommand/TeamCommandCenter';
import { SpacecraftBuilder } from './pages/SpacecraftBuilder/SpacecraftBuilder';
import { MissionConfiguration } from './pages/MissionConfiguration/MissionConfiguration';
import { MissionValidation } from './pages/MissionValidation/MissionValidation';
import { MissionSimulation } from './pages/MissionSimulation/MissionSimulation';
import { MissionReport } from './pages/MissionReport/MissionReport';
import { MissionArchive } from './pages/MissionArchive/MissionArchive';
import { LearningCenter } from './pages/LearningCenter/LearningCenter';
import { Leaderboard } from './pages/Leaderboard/Leaderboard';
import { Profile } from './pages/Profile/Profile';
import { SandboxMode } from './pages/Sandbox/SandboxMode';

const ScreenRouter: React.FC = () => {
  const { screen } = useGame();

  switch (screen) {
    case 'main-menu':
      return <MainMenu />;
    case 'lobby':
      return <GameLobby />;
    case 'mission-selection':
      return <MissionSelection />;
    case 'mission-briefing':
      return <MissionBriefing />;
    case 'team-command':
      return <TeamCommandCenter />;
    case 'spacecraft-builder':
      return <SpacecraftBuilder />;
    case 'mission-configuration':
      return <MissionConfiguration />;
    case 'mission-validation':
      return <MissionValidation />;
    case 'mission-simulation':
      return <MissionSimulation />;
    case 'mission-report':
      return <MissionReport />;
    case 'mission-archive':
      return <MissionArchive />;
    case 'learning-center':
      return <LearningCenter />;
    case 'leaderboard':
      return <Leaderboard />;
    case 'profile':
      return <Profile />;
    case 'sandbox':
      return <SandboxMode />;
    default:
      return <MainMenu />;
  }
};

export const AppContent: React.FC = () => {
  const { screen } = useGame();

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans bg-grid-tech">
      <HeaderHUD />
      <main className="flex-1 overflow-x-hidden">
        <ScreenRouter />
      </main>
      {screen !== 'main-menu' && <AdvisorDrawer />}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
