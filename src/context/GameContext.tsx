import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Screen, 
  GameMode, 
  Difficulty, 
  MissionScenario, 
  SpacecraftComponent, 
  LaunchVehicle, 
  OrbitConfiguration, 
  MissionConfiguration, 
  ValidationResult, 
  SimulationState, 
  MissionReport, 
  PlayerProfile, 
  Achievement, 
  LeaderboardEntry,
  TeamRole
} from '../types/game';
import { MISSION_SCENARIOS, getMissionById } from '../game/database/missions';
import { COMPONENT_CATALOG } from '../game/database/components';
import { LAUNCH_VEHICLES, getLaunchVehicleById } from '../game/database/launchVehicles';
import { ORBIT_CONFIGURATIONS, getOrbitConfig } from '../game/database/orbits';
import { validateMissionConfiguration } from '../game/validation/validator';
import { initializeSimulation, advanceSimulationStep, resolveSimulationEvent } from '../game/engine/simulationEngine';
import { calculateMissionScore } from '../game/scoring/scorer';
import { StorageService } from '../services/storage';
import { MultiplayerService, MultiplayerRoom } from '../services/multiplayer';

interface GameContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  
  // Mission & Blueprints
  mission: MissionScenario;
  setMission: (mission: MissionScenario) => void;
  components: SpacecraftComponent[];
  addComponent: (component: SpacecraftComponent) => void;
  removeComponent: (componentId: string) => void;
  clearComponents: () => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  hoveredComponentId: string | null;
  setHoveredComponentId: (id: string | null) => void;

  // Mission Config
  launchVehicle: LaunchVehicle;
  setLaunchVehicle: (lv: LaunchVehicle) => void;
  orbit: OrbitConfiguration;
  setOrbit: (orbit: OrbitConfiguration) => void;
  missionConfig: MissionConfiguration;
  updateMissionConfig: (partial: Partial<MissionConfiguration>) => void;

  // Validation
  validation: ValidationResult;
  revalidate: () => void;

  // Simulation
  simulation: SimulationState | null;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  setSimulationTimeScale: (scale: number) => void;
  chooseEventOption: (choiceId: string) => void;
  abortSimulation: () => void;

  // Post Mission & Reports
  activeReport: MissionReport | null;
  setActiveReport: (report: MissionReport | null) => void;
  savedReports: MissionReport[];
  saveCurrentReport: () => void;

  // Multiplayer
  multiplayerRoom: MultiplayerRoom | null;
  createMultiplayerRoom: (name: string, mode: 'coop' | 'competitive', role: TeamRole) => void;
  leaveMultiplayerRoom: () => void;
  proposeTeamDecision: (question: string) => void;

  // Profile & Metagame
  profile: PlayerProfile;
  updateProfile: (profile: Partial<PlayerProfile>) => void;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];

  // Sandbox Custom Overrides
  sandboxOverrides: {
    customBudget: number;
    customMassLimit: number;
  };
  setSandboxOverrides: React.Dispatch<React.SetStateAction<{ customBudget: number; customMassLimit: number }>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('main-menu');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');

  // Default Mission: Lunar Explorer
  const [mission, setMissionState] = useState<MissionScenario>(MISSION_SCENARIOS[0]);

  // Default default components mounted to start with a working basic bus
  const [components, setComponents] = useState<SpacecraftComponent[]>([
    COMPONENT_CATALOG.find(c => c.id === 'struct-bus-cube-standard')!,
    COMPONENT_CATALOG.find(c => c.id === 'power-solar-single')!,
    COMPONENT_CATALOG.find(c => c.id === 'power-battery-bank')!,
    COMPONENT_CATALOG.find(c => c.id === 'comp-flight-computer')!,
    COMPONENT_CATALOG.find(c => c.id === 'comm-hga-parabolic')!,
    COMPONENT_CATALOG.find(c => c.id === 'prop-biprop-engine')!,
    COMPONENT_CATALOG.find(c => c.id === 'thermal-radiator-panel')!,
    COMPONENT_CATALOG.find(c => c.id === 'storage-ssd-256')!,
    COMPONENT_CATALOG.find(c => c.id === 'sci-camera-multispectral')!
  ].filter(Boolean));

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [hoveredComponentId, setHoveredComponentId] = useState<string | null>(null);

  // Default Launch Vehicle and Orbit
  const [launchVehicle, setLaunchVehicle] = useState<LaunchVehicle>(LAUNCH_VEHICLES[1]); // AeroFalcon-9
  const [orbit, setOrbit] = useState<OrbitConfiguration>(ORBIT_CONFIGURATIONS.lunar_polar);

  const [missionConfig, setMissionConfig] = useState<MissionConfiguration>({
    launchVehicleId: LAUNCH_VEHICLES[1].id,
    orbitType: 'lunar_polar',
    trajectoryTrimDeltaV: 120,
    commGroundNetwork: 'dsn',
    scienceSchedulingPriority: 'balanced'
  });

  // Sandbox overrides
  const [sandboxOverrides, setSandboxOverrides] = useState({
    customBudget: 150000,
    customMassLimit: 3000
  });

  // Active adjusted mission (accounting for Sandbox or Difficulty)
  const effectiveMission = useMemo(() => {
    if (gameMode === 'sandbox') {
      return {
        ...mission,
        budget: sandboxOverrides.customBudget,
        massLimit: sandboxOverrides.customMassLimit
      };
    }
    if (difficulty === 'beginner') {
      return {
        ...mission,
        budget: Math.round(mission.budget * 1.35),
        massLimit: Math.round(mission.massLimit * 1.25)
      };
    }
    if (difficulty === 'expert') {
      return {
        ...mission,
        budget: Math.round(mission.budget * 0.85),
        massLimit: Math.round(mission.massLimit * 0.9)
      };
    }
    return mission;
  }, [mission, gameMode, difficulty, sandboxOverrides]);

  // Validation
  const validation = useMemo(() => {
    return validateMissionConfiguration(components, effectiveMission, launchVehicle, orbit);
  }, [components, effectiveMission, launchVehicle, orbit]);

  const revalidate = useCallback(() => {
    // re-trigger memo
  }, []);

  // Simulation State
  const [simulation, setSimulation] = useState<SimulationState | null>(null);

  // Reports, Storage & Profiles
  const [activeReport, setActiveReport] = useState<MissionReport | null>(null);
  const [savedReports, setSavedReports] = useState<MissionReport[]>(() => StorageService.getReports());
  const [profile, setProfileState] = useState<PlayerProfile>(() => StorageService.getProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(() => StorageService.getAchievements());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => StorageService.getLeaderboard());

  // Multiplayer
  const [multiplayerRoom, setMultiplayerRoom] = useState<MultiplayerRoom | null>(null);

  // Component Management
  const addComponent = useCallback((component: SpacecraftComponent) => {
    setComponents(prev => [...prev, component]);
    setSelectedComponentId(component.id);
  }, []);

  const removeComponent = useCallback((componentId: string) => {
    setComponents(prev => prev.filter(c => c.id !== componentId));
    if (selectedComponentId === componentId) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  const clearComponents = useCallback(() => {
    setComponents([]);
    setSelectedComponentId(null);
  }, []);

  // Update Mission Scenario and adjust appropriate default orbit
  const setMission = useCallback((newMission: MissionScenario) => {
    setMissionState(newMission);
    let targetOrbit: OrbitConfiguration = ORBIT_CONFIGURATIONS.lunar_polar;
    if (newMission.target === 'Mars') targetOrbit = ORBIT_CONFIGURATIONS.mars_transfer;
    else if (newMission.target === 'Earth') targetOrbit = ORBIT_CONFIGURATIONS.polar_sso;
    else if (newMission.target === 'Asteroid') targetOrbit = ORBIT_CONFIGURATIONS.geo;
    else if (newMission.target === 'Deep Space') targetOrbit = ORBIT_CONFIGURATIONS.heliocentric;
    setOrbit(targetOrbit);
    setMissionConfig(prev => ({ ...prev, orbitType: targetOrbit.id }));
  }, []);

  const updateMissionConfig = useCallback((partial: Partial<MissionConfiguration>) => {
    setMissionConfig(prev => {
      const updated = { ...prev, ...partial };
      if (partial.launchVehicleId) {
        const lv = getLaunchVehicleById(partial.launchVehicleId);
        if (lv) setLaunchVehicle(lv);
      }
      if (partial.orbitType) {
        const orb = getOrbitConfig(partial.orbitType);
        if (orb) setOrbit(orb);
      }
      return updated;
    });
  }, []);

  // Simulation Controls
  const startSimulation = useCallback(() => {
    const initialState = initializeSimulation(effectiveMission, components, launchVehicle, orbit);
    setSimulation(initialState);
    setScreen('mission-simulation');
  }, [effectiveMission, components, launchVehicle, orbit]);

  const pauseSimulation = useCallback(() => {
    setSimulation(prev => prev ? { ...prev, isPaused: true } : null);
  }, []);

  const resumeSimulation = useCallback(() => {
    setSimulation(prev => prev ? { ...prev, isPaused: false } : null);
  }, []);

  const setSimulationTimeScale = useCallback((scale: number) => {
    setSimulation(prev => prev ? { ...prev, timeScale: scale } : null);
  }, []);

  const chooseEventOption = useCallback((choiceId: string) => {
    setSimulation(prev => {
      if (!prev || !prev.activeEvent) return prev;
      const choice = prev.activeEvent.choices.find(c => c.id === choiceId);
      if (!choice) return prev;
      return resolveSimulationEvent(prev, choice);
    });
  }, []);

  const abortSimulation = useCallback(() => {
    setSimulation(prev => prev ? { ...prev, isAborted: true, isCompleted: true, failureReason: 'Aborted by Mission Commander' } : null);
  }, []);

  // In-flight simulation heartbeat loop
  useEffect(() => {
    if (!simulation || simulation.isPaused || simulation.isCompleted || simulation.isAborted) {
      return;
    }

    const interval = setInterval(() => {
      setSimulation(prev => {
        if (!prev) return null;
        const next = advanceSimulationStep(prev, 0.5, effectiveMission, components, launchVehicle, orbit);

        // Check if finished and generate report
        if (next.isCompleted && !prev.isCompleted) {
          const score = calculateMissionScore(
            effectiveMission,
            next,
            components,
            launchVehicle,
            orbit,
            gameMode === 'coop' || gameMode === 'competitive'
          );

          const newReport: MissionReport = {
            id: 'rep-' + Date.now(),
            missionId: effectiveMission.id,
            missionName: effectiveMission.name,
            spacecraftName: 'Pathfinder-MB1',
            date: new Date().toISOString().split('T')[0],
            score,
            objectivesCompleted: next.sciencePoints >= effectiveMission.successConditions.minSciencePoints
              ? effectiveMission.scientificGoals
              : effectiveMission.scientificGoals.slice(0, 2),
            objectivesMissed: next.sciencePoints < effectiveMission.successConditions.minSciencePoints
              ? [effectiveMission.scientificGoals[effectiveMission.scientificGoals.length - 1]]
              : [],
            peakTelemetry: {
              maxDistanceKm: Math.round(next.distanceToTargetKm),
              scienceDataTransmittedGb: Math.round(next.dataTransmittedGb),
              propellantUsedKg: Math.round(next.initialPropellantKg - next.propellantRemainingKg),
              finalHealthPercent: next.equipmentHealthPercent,
              totalFlightTimeHours: Math.round(next.elapsedSeconds / 36) / 100
            },
            eventsHandledCount: next.eventHistory.length,
            engineeringLessons: [
              `Total power generation yielded ${resMetrics.powerGenW}W against ${resMetrics.powerDrawW}W continuous draw.`,
              next.propellantRemainingKg > 30 ? 'Propellant allocation was conservative; surplus mass could have carried additional sensors.' : 'Fuel margins were tight; optimal trajectory correction minimized wastage.',
              next.equipmentHealthPercent >= 90 ? 'Thermal radiative equilibrium was successfully maintained throughout cruise.' : 'Elevated solar radiation caused minor sensor scuffing.'
            ],
            spacecraftBlueprint: {
              id: 'bp-' + Date.now(),
              name: 'Pathfinder-MB1',
              components: [...components],
              createdAt: Date.now(),
              updatedAt: Date.now()
            },
            missionConfig: { ...missionConfig }
          };

          setActiveReport(newReport);
          StorageService.saveReport(newReport);
          setSavedReports(StorageService.getReports());

          // Add to leaderboard if score is good
          StorageService.addLeaderboardEntry({
            id: 'lead-' + Date.now(),
            playerName: profile.callsign,
            teamName: gameMode === 'coop' ? 'Alpha Flight Team' : undefined,
            missionId: effectiveMission.id,
            score: score.totalScore,
            grade: score.grade,
            scienceDataGb: Math.round(next.dataTransmittedGb),
            budgetEfficiencyPercent: Math.round(((effectiveMission.budget - resMetrics.totalCost) / effectiveMission.budget) * 100),
            date: new Date().toISOString().split('T')[0],
            isMultiplayer: gameMode === 'coop' || gameMode === 'competitive'
          });
          setLeaderboard(StorageService.getLeaderboard());

          // Unlock achievements
          for (const ach of score.achievementsUnlocked) {
            StorageService.unlockAchievement(ach);
          }
          setAchievements(StorageService.getAchievements());

          // Update profile stats
          const updatedProfile = {
            ...profile,
            missionsCompleted: profile.missionsCompleted + 1,
            totalScienceCollectedGb: profile.totalScienceCollectedGb + Math.round(next.dataTransmittedGb),
            highestScore: Math.max(profile.highestScore, score.totalScore)
          };
          StorageService.saveProfile(updatedProfile);
          setProfileState(updatedProfile);

          // Transition to Mission Report screen
          setTimeout(() => {
            setScreen('mission-report');
          }, 1500);
        }

        return next;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [simulation?.isPaused, simulation?.isCompleted, simulation?.isAborted, effectiveMission, components, launchVehicle, orbit, gameMode, profile, missionConfig]);

  const resMetrics = useMemo(() => {
    return validation.metrics;
  }, [validation]);

  const saveCurrentReport = useCallback(() => {
    if (activeReport) {
      StorageService.saveReport(activeReport);
      setSavedReports(StorageService.getReports());
    }
  }, [activeReport]);

  const updateProfile = useCallback((partial: Partial<PlayerProfile>) => {
    setProfileState(prev => {
      const updated = { ...prev, ...partial };
      StorageService.saveProfile(updated);
      return updated;
    });
  }, []);

  // Multiplayer
  const createMultiplayerRoom = useCallback((name: string, mode: 'coop' | 'competitive', role: TeamRole) => {
    const room = MultiplayerService.createDemoRoom(name, mode, effectiveMission.id, role);
    setMultiplayerRoom(room);
    setGameMode(mode);
    setScreen('team-command');
  }, [effectiveMission.id]);

  const leaveMultiplayerRoom = useCallback(() => {
    setMultiplayerRoom(null);
    setGameMode('solo');
    setScreen('lobby');
  }, []);

  const proposeTeamDecision = useCallback((question: string) => {
    if (multiplayerRoom) {
      const updated = MultiplayerService.proposeDecision(multiplayerRoom, question, profile.callsign);
      setMultiplayerRoom(updated);
    }
  }, [multiplayerRoom, profile.callsign]);

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        gameMode,
        setGameMode,
        difficulty,
        setDifficulty,
        mission: effectiveMission,
        setMission,
        components,
        addComponent,
        removeComponent,
        clearComponents,
        selectedComponentId,
        setSelectedComponentId,
        hoveredComponentId,
        setHoveredComponentId,
        launchVehicle,
        setLaunchVehicle,
        orbit,
        setOrbit,
        missionConfig,
        updateMissionConfig,
        validation,
        revalidate,
        simulation,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        setSimulationTimeScale,
        chooseEventOption,
        abortSimulation,
        activeReport,
        setActiveReport,
        savedReports,
        saveCurrentReport,
        multiplayerRoom,
        createMultiplayerRoom,
        leaveMultiplayerRoom,
        proposeTeamDecision,
        profile,
        updateProfile,
        achievements,
        leaderboard,
        sandboxOverrides,
        setSandboxOverrides
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
