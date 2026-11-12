import { MissionReport, SpacecraftBlueprint, Achievement, LeaderboardEntry, PlayerProfile } from '../types/game';
import { INITIAL_ACHIEVEMENTS, INITIAL_LEADERBOARD } from '../game/database/achievements';

const KEYS = {
  REPORTS: 'mission_beyond_reports',
  SAVED_DESIGNS: 'mission_beyond_designs',
  ACHIEVEMENTS: 'mission_beyond_achievements',
  LEADERBOARD: 'mission_beyond_leaderboard',
  PROFILE: 'mission_beyond_profile'
};

export const StorageService = {
  getReports(): MissionReport[] {
    try {
      const data = localStorage.getItem(KEYS.REPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveReport(report: MissionReport): void {
    const list = this.getReports();
    const updated = [report, ...list.filter(r => r.id !== report.id)];
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
  },

  getSavedBlueprints(): SpacecraftBlueprint[] {
    try {
      const data = localStorage.getItem(KEYS.SAVED_DESIGNS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveBlueprint(bp: SpacecraftBlueprint): void {
    const list = this.getSavedBlueprints();
    const updated = [bp, ...list.filter(b => b.id !== bp.id)];
    localStorage.setItem(KEYS.SAVED_DESIGNS, JSON.stringify(updated));
  },

  getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  unlockAchievement(id: string): void {
    const list = this.getAchievements();
    const updated = list.map(a => a.id === id ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a);
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(updated));
  },

  getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : INITIAL_LEADERBOARD;
    } catch {
      return INITIAL_LEADERBOARD;
    }
  },

  addLeaderboardEntry(entry: LeaderboardEntry): void {
    const list = this.getLeaderboard();
    const updated = [entry, ...list].sort((a, b) => b.score - a.score);
    localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(updated));
  },

  getProfile(): PlayerProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : {
        callsign: 'Flight Director Alpha',
        organization: 'Deep Space Exploration Agency',
        missionsCompleted: 3,
        totalScienceCollectedGb: 1240,
        highestScore: 9420,
        preferredDifficulty: 'intermediate',
        soundEnabled: true,
        telemetryStreamSpeed: 'normal'
      };
    } catch {
      return {
        callsign: 'Flight Director Alpha',
        organization: 'Deep Space Exploration Agency',
        missionsCompleted: 0,
        totalScienceCollectedGb: 0,
        highestScore: 0,
        preferredDifficulty: 'intermediate',
        soundEnabled: true,
        telemetryStreamSpeed: 'normal'
      };
    }
  },

  saveProfile(profile: PlayerProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }
};
