// MISSION: BEYOND - Complete Game Type Definitions

export type GameMode = 'solo' | 'coop' | 'competitive' | 'sandbox';

export type Screen = 
  | 'main-menu'
  | 'lobby'
  | 'mission-selection'
  | 'mission-briefing'
  | 'team-command'
  | 'spacecraft-builder'
  | 'mission-configuration'
  | 'mission-validation'
  | 'mission-simulation'
  | 'mission-report'
  | 'mission-archive'
  | 'learning-center'
  | 'leaderboard'
  | 'profile'
  | 'sandbox';

export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type TeamRole = 
  | 'director'      // Mission Director: Oversees mission, confirms major decisions, abort authority
  | 'engineer'      // Spacecraft Engineer: Bus structural design, mass & thermal management
  | 'scientist'     // Science Specialist: Selects scientific payload, data return priorities
  | 'systems';      // Systems Manager: Power balance, fuel & delta-V, link budget & comms

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  isReady: boolean;
  isHost: boolean;
  isSimulated?: boolean;
}

export type ComponentCategory = 
  | 'structure'
  | 'power'
  | 'propulsion'
  | 'communication'
  | 'science'
  | 'computing'
  | 'thermal'
  | 'storage';

export interface SpacecraftComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  mass: number;             // kg
  cost: number;             // in $1,000 USD (e.g. 5000 = $5.0M)
  powerGen: number;         // Watts (positive for solar/RTG)
  powerDraw: number;        // Watts (consumed when active)
  dataGen: number;          // Mbps (generated during science ops)
  dataStorage: number;      // Gigabytes (SSD buffer)
  isp?: number;             // seconds (propulsion specific impulse)
  propellantMass?: number;  // kg of fuel contained
  thermalRating: number;    // Watts dissipation capacity or insulation rating
  reliability: number;      // 0.0 to 1.0 (mean time before failure index)
  requiredLevel?: number;
  unlockedByDefault?: boolean;
  meshType: 
    | 'bus_cube' 
    | 'bus_hex' 
    | 'bus_frame'
    | 'solar_wing_1' 
    | 'solar_wing_2' 
    | 'rtg_unit' 
    | 'battery_bank'
    | 'engine_biprop' 
    | 'engine_ion' 
    | 'rcs_cluster' 
    | 'antenna_hga_dish' 
    | 'antenna_omni' 
    | 'transponder'
    | 'camera_highres' 
    | 'spectrometer' 
    | 'radar_sar' 
    | 'sensor_atmosphere' 
    | 'detector_radiation'
    | 'flight_computer' 
    | 'storage_module' 
    | 'radiator_panel' 
    | 'thermal_blanket';
  mountPosition?: [number, number, number]; // default 3D offset
}

export interface SpacecraftBlueprint {
  id: string;
  name: string;
  components: SpacecraftComponent[];
  createdAt: number;
  updatedAt: number;
}

export interface LaunchVehicle {
  id: string;
  name: string;
  manufacturer: string;
  payloadCapacityLeo: number; // kg
  payloadCapacityGto: number; // kg
  payloadCapacityEscape: number; // kg to C3 > 0
  cost: number; // $1,000 USD
  reliability: number; // 0.0 to 1.0
  fairingDiameter: number; // meters
  description: string;
}

export type OrbitType = 
  | 'leo'               // Low Earth Orbit (400 km)
  | 'polar_sso'         // Polar Sun-Synchronous (700 km)
  | 'geo'               // Geostationary Orbit (35,786 km)
  | 'lunar_polar'       // Lunar Polar Orbit (100 km)
  | 'mars_transfer'     // Hohmann Transfer to Mars
  | 'heliocentric';     // Deep Space Solar Escape

export interface OrbitConfiguration {
  id: OrbitType;
  name: string;
  altitude: string;
  deltaVRequired: number; // m/s required for insertion
  solarFluxMultiplier: number; // 1.0 at Earth, 0.43 at Mars, 0.1 at Deep Space
  commDelaySeconds: number; // one-way speed of light delay
  description: string;
  eclipsePercentage: number; // % of orbit spent in shadow
}

export interface MissionScenario {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  target: 'Moon' | 'Mars' | 'Asteroid' | 'Earth' | 'Deep Space';
  targetDistance: string;
  description: string;
  scientificGoals: string[];
  requiredInstrumentCategories: string[];
  recommendedComponents: string[];
  budget: number; // $1,000 USD
  massLimit: number; // kg
  missionDurationDays: number;
  minDeltaV: number; // m/s required from spacecraft
  minPowerWatts: number;
  minCommDataRateMbps: number;
  minStorageGb: number;
  difficulty: Difficulty;
  environmentalHazards: string[];
  successConditions: {
    minSciencePoints: number;
    requireDataTransmitted: boolean;
    requireOrbitalInsertion: boolean;
    maxDamageAllowed: number;
  };
}

export interface MissionConfiguration {
  launchVehicleId: string;
  orbitType: OrbitType;
  trajectoryTrimDeltaV: number; // extra fuel margin in m/s
  commGroundNetwork: 'dsn' | 'commercial' | 'direct_earth';
  scienceSchedulingPriority: 'balanced' | 'aggressive' | 'conservative';
}

export type ValidationStatus = 'PASS' | 'WARNING' | 'CRITICAL';

export interface ValidationIssue {
  id: string;
  status: ValidationStatus;
  subsystem: 'mass' | 'budget' | 'power' | 'propulsion' | 'communication' | 'thermal' | 'storage' | 'science' | 'vehicle';
  title: string;
  explanation: string;
  consequence: string;
  recommendedAction: string;
  affectedComponentId?: string;
}

export interface ValidationResult {
  overallStatus: ValidationStatus;
  canLaunch: boolean;
  issues: ValidationIssue[];
  metrics: {
    totalMassKg: number;
    massMarginKg: number;
    totalCost: number;
    budgetMargin: number;
    powerGenerationW: number;
    powerConsumptionW: number;
    netPowerW: number;
    batteryCapacityWh: number;
    eclipseMarginMinutes: number;
    totalDeltaVMs: number;
    deltaVMarginMs: number;
    dataGenerationMbps: number;
    storageCapacityGb: number;
    downlinkRateMbps: number;
    thermalDissipationW: number;
    spacecraftReliabilityIndex: number;
  };
}

export type SimulationStage = 
  | 'prelaunch'
  | 'launch'
  | 'deployment'
  | 'cruise'
  | 'navigation'
  | 'arrival'
  | 'science_ops'
  | 'communication'
  | 'completed'
  | 'failed';

export interface TelemetryPoint {
  timeSeconds: number;
  stage: SimulationStage;
  distanceKm: number;
  velocityKms: number;
  batteryPercent: number;
  solarPowerW: number;
  powerDrawW: number;
  propellantKg: number;
  dataStoredGb: number;
  dataTransmittedGb: number;
  hullTempCelsius: number;
  signalStrengthPercent: number;
  sciencePointsCollected: number;
}

export interface DynamicEventChoice {
  id: string;
  label: string;
  description: string;
  resourceImpact: {
    propellantDeltaKg?: number;
    batteryDeltaWh?: number;
    damageDelta?: number;
    sciencePointsDelta?: number;
    delaySeconds?: number;
    componentAffected?: string;
  };
  explanation: string;
}

export interface DynamicEvent {
  id: string;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  triggerStage: SimulationStage;
  description: string;
  systemAffected: string;
  choices: DynamicEventChoice[];
  resolvedChoiceId?: string;
  timestamp: number;
}

export interface SimulationState {
  stage: SimulationStage;
  elapsedSeconds: number;
  timeScale: number; // 1x, 2x, 5x, 10x
  isPaused: boolean;
  
  // Real-time telemetry values
  distanceToTargetKm: number;
  currentVelocityKms: number;
  batteryLevelWh: number;
  maxBatteryWh: number;
  propellantRemainingKg: number;
  initialPropellantKg: number;
  dataStoredGb: number;
  dataTransmittedGb: number;
  sciencePoints: number;
  equipmentHealthPercent: number;
  hullTempCelsius: number;
  signalLatencySeconds: number;
  signalStrength: number; // 0 - 100%
  
  activeEvent: DynamicEvent | null;
  eventHistory: { event: DynamicEvent; chosen: DynamicEventChoice; time: number }[];
  telemetryLog: TelemetryPoint[];
  missionEventsLog: { time: string; message: string; type: 'info' | 'warning' | 'alert' | 'success' }[];
  isCompleted: boolean;
  isAborted: boolean;
  failureReason?: string;
}

export interface MissionScoreBreakdown {
  missionSuccessScore: number;    // 0 - 2500
  scientificValueScore: number;   // 0 - 2500
  budgetEfficiencyScore: number;  // 0 - 1500
  massEfficiencyScore: number;    // 0 - 1000
  powerEfficiencyScore: number;   // 0 - 1000
  commPerformanceScore: number;   // 0 - 1000
  reliabilitySafetyScore: number; // 0 - 500
  totalScore: number;             // 0 - 10000
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  achievementsUnlocked: string[];
}

export interface MissionReport {
  id: string;
  missionId: string;
  missionName: string;
  spacecraftName: string;
  date: string;
  score: MissionScoreBreakdown;
  objectivesCompleted: string[];
  objectivesMissed: string[];
  peakTelemetry: {
    maxDistanceKm: number;
    scienceDataTransmittedGb: number;
    propellantUsedKg: number;
    finalHealthPercent: number;
    totalFlightTimeHours: number;
  };
  eventsHandledCount: number;
  engineeringLessons: string[];
  spacecraftBlueprint: SpacecraftBlueprint;
  missionConfig: MissionConfiguration;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'engineering' | 'science' | 'flight' | 'special';
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  teamName?: string;
  missionId: string;
  score: number;
  grade: string;
  scienceDataGb: number;
  budgetEfficiencyPercent: number;
  date: string;
  isMultiplayer: boolean;
}

export interface PlayerProfile {
  callsign: string;
  organization: string;
  missionsCompleted: number;
  totalScienceCollectedGb: number;
  highestScore: number;
  preferredDifficulty: Difficulty;
  soundEnabled: boolean;
  telemetryStreamSpeed: 'normal' | 'fast';
}
