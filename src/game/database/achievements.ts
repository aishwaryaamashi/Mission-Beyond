import { Achievement, LeaderboardEntry } from '../../types/game';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-launch',
    title: 'First Orbital Insertion',
    category: 'flight',
    description: 'Successfully complete Stage 1 (Launch) and achieve initial orbital separation.',
    icon: 'Rocket',
    isUnlocked: false
  },
  {
    id: 'ach-zero-critical',
    title: 'Zero Critical Errors',
    category: 'engineering',
    description: 'Pass engineering flight validation with 100% green PASS status across all subsystems.',
    icon: 'ShieldCheck',
    isUnlocked: false
  },
  {
    id: 'ach-cost-optimizer',
    title: 'Fiscal Discipline',
    category: 'engineering',
    description: 'Complete a mission with more than 25% of the starting budget remaining in reserves.',
    icon: 'Coins',
    isUnlocked: false
  },
  {
    id: 'ach-scientific-breakthrough',
    title: 'Planetary Discovery',
    category: 'science',
    description: 'Downlink more than 150% of the target scientific objectives during science operations.',
    icon: 'Sparkles',
    isUnlocked: false
  },
  {
    id: 'ach-crisis-navigator',
    title: 'Crisis Master',
    category: 'flight',
    description: 'Successfully resolve 2 or more dynamic in-flight space emergencies without mission abort.',
    icon: 'AlertTriangle',
    isUnlocked: false
  },
  {
    id: 'ach-pristine-engineering',
    title: 'Flawless Hardware',
    category: 'engineering',
    description: 'Conclude a complete interplanetary flight with 95% or higher equipment health preserved.',
    icon: 'Wrench',
    isUnlocked: false
  },
  {
    id: 'ach-crew-excellence',
    title: 'Crew Synergy',
    category: 'special',
    description: 'Complete a cooperative multiplayer mission with all 4 crew roles synchronized.',
    icon: 'Users',
    isUnlocked: false
  },
  {
    id: 'ach-deep-space-pioneer',
    title: 'Kuiper Voyager',
    category: 'flight',
    description: 'Successfully complete the Deep Space Explorer mission past 30 AU.',
    icon: 'Compass',
    isUnlocked: false
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    playerName: 'Cmdr. Vance Rivera',
    teamName: 'AeroDynamics Prime',
    missionId: 'mission-05-deep-space-explorer',
    score: 9780,
    grade: 'S',
    scienceDataGb: 480,
    budgetEfficiencyPercent: 28,
    date: '2026-11-08',
    isMultiplayer: true
  },
  {
    id: 'lead-2',
    playerName: 'Dr. Sarah Lin',
    missionId: 'mission-02-mars-pathfinder',
    score: 9420,
    grade: 'S',
    scienceDataGb: 350,
    budgetEfficiencyPercent: 22,
    date: '2026-11-10',
    isMultiplayer: false
  },
  {
    id: 'lead-3',
    playerName: 'Elena Rostova',
    teamName: 'Lunar Cartographers',
    missionId: 'mission-01-lunar-explorer',
    score: 8950,
    grade: 'A',
    scienceDataGb: 220,
    budgetEfficiencyPercent: 34,
    date: '2026-11-11',
    isMultiplayer: true
  },
  {
    id: 'lead-4',
    playerName: 'Alex Mercer',
    missionId: 'mission-03-asteroid-watch',
    score: 8350,
    grade: 'A',
    scienceDataGb: 195,
    budgetEfficiencyPercent: 15,
    date: '2026-11-09',
    isMultiplayer: false
  },
  {
    id: 'lead-5',
    playerName: 'Cmdr. Kenji Sato',
    missionId: 'mission-04-earth-guardian',
    score: 7920,
    grade: 'A',
    scienceDataGb: 640,
    budgetEfficiencyPercent: 18,
    date: '2026-11-12',
    isMultiplayer: false
  }
];
