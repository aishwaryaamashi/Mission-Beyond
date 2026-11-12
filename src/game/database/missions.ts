import { MissionScenario } from '../../types/game';

export const MISSION_SCENARIOS: MissionScenario[] = [
  {
    id: 'mission-01-lunar-explorer',
    code: 'MB-LUNAR-01',
    name: 'Lunar Explorer: Polar Reconnaissance',
    subtitle: 'Map lunar permanently shadowed craters and prospect for volatile water-ice deposits.',
    target: 'Moon',
    targetDistance: '384,400 km',
    description: 'Insert an observation spacecraft into a 100km circular polar lunar orbit. The Moon has no atmosphere, high thermal radiation swings (+120°C in sunlight to -130°C in shadow), and 45-minute communication occlusions when passing behind the lunar farside. Primary objective is multi-spectral mapping of Shackleton and Cabeus craters for future crewed Artemis base siting.',
    scientificGoals: [
      'Perform 50-meter resolution multispectral mapping of the Lunar South Pole.',
      'Identify surface hydroxide / water-ice spectral signatures in permanently shadowed regions.',
      'Record lunar surface radiation dosages and micrometeorite fluxes over 90 days.',
      'Transmit at least 150 GB of validated science data to Earth ground stations.'
    ],
    requiredInstrumentCategories: ['camera_highres', 'spectrometer'],
    recommendedComponents: ['struct-bus-cube-standard', 'power-solar-dual', 'power-battery-bank', 'prop-biprop-engine', 'comm-hga-parabolic', 'sci-camera-multispectral', 'sci-spectrometer-ir-uv'],
    budget: 35000, // $35M
    massLimit: 850, // kg
    missionDurationDays: 90,
    minDeltaV: 1450, // m/s for lunar orbital insertion and stationkeeping
    minPowerWatts: 380,
    minCommDataRateMbps: 20,
    minStorageGb: 128,
    difficulty: 'beginner',
    environmentalHazards: [
      '45-minute lunar shadow eclipses requiring robust battery reserves.',
      'Direct line-of-sight communication blackout during lunar farside transit.',
      'Sharp thermal gradients when crossing the lunar day/night terminator.'
    ],
    successConditions: {
      minSciencePoints: 1200,
      requireDataTransmitted: true,
      requireOrbitalInsertion: true,
      maxDamageAllowed: 25
    }
  },
  {
    id: 'mission-02-mars-pathfinder',
    code: 'MB-MARS-02',
    name: 'Mars Pathfinder: Atmospheric & Surface Survey',
    subtitle: 'Survey the Red Planet atmosphere, dust storm dynamics, and sedimentary river deltas.',
    target: 'Mars',
    targetDistance: '225,000,000 km',
    description: 'Launch an interplanetary probe via a 7-month heliocentric Hohmann transfer trajectory to Mars. Due to Mars being 1.52 AU from the Sun, solar irradiance drops to 43% of Earth levels. The mission requires reliable communications across an average 12-minute one-way light time delay, and must survive intense atmospheric deceleration and dust storm optical attenuation.',
    scientificGoals: [
      'Analyze atmospheric pressure, trace methane, and isotopic gas signatures in Mars upper atmosphere.',
      'High-resolution multi-angle geological imaging of Jezero Crater and Valles Marineris.',
      'Observe regional seasonal dust storms and quantify atmospheric optical depth.',
      'Transmit at least 300 GB of processed Martian science telemetry.'
    ],
    requiredInstrumentCategories: ['camera_highres', 'sensor_atmosphere'],
    recommendedComponents: ['struct-bus-hex-heavy', 'power-solar-dual', 'power-battery-bank', 'prop-biprop-engine', 'comm-hga-parabolic', 'comm-ka-transponder', 'sci-camera-multispectral', 'sci-sensor-atmosphere', 'storage-ssd-1024'],
    budget: 65000, // $65M
    massLimit: 1200, // kg
    missionDurationDays: 320,
    minDeltaV: 2200, // m/s for Mars orbital insertion & trims
    minPowerWatts: 500,
    minCommDataRateMbps: 30,
    minStorageGb: 256,
    difficulty: 'intermediate',
    environmentalHazards: [
      '57% reduction in available solar power flux at 1.52 AU.',
      'Interplanetary cosmic ray bombardment during 210-day cruise phase.',
      '12-to-20 minute round-trip communication latency requiring onboard autonomous fault handling.'
    ],
    successConditions: {
      minSciencePoints: 1800,
      requireDataTransmitted: true,
      requireOrbitalInsertion: true,
      maxDamageAllowed: 20
    }
  },
  {
    id: 'mission-03-asteroid-watch',
    code: 'MB-ASTEROID-03',
    name: 'Asteroid Watch: Near-Earth Rendezvous',
    subtitle: 'Rendezvous with a fast-tumbling carbonaceous Near-Earth Object (NEO) to assess composition and deflection.',
    target: 'Asteroid',
    targetDistance: '14,000,000 km',
    description: 'Execute high-precision orbit matching with Asteroid 2026-NX, a 450m carbonaceous primitive asteroid on an eccentric orbit. The target possesses minimal microgravity (10^-5 g), requiring delicate autonomous proximity maneuvers and synthetic aperture radar imaging through ejecta and dust clouds.',
    scientificGoals: [
      'Synthesize 3D volumetric radar topography of the asteroid surface and subsurface voids.',
      'Perform reflectance spectroscopy to quantify metal-to-silicate ratios and hydrated clays.',
      'Measure gravitational mass anomalies to determine internal rubble-pile porosity.',
      'Map hazardous boulder distribution for future sample-return targeting.'
    ],
    requiredInstrumentCategories: ['radar_sar', 'spectrometer'],
    recommendedComponents: ['struct-bus-hex-heavy', 'power-solar-dual', 'prop-ion-thruster', 'prop-rcs-quads', 'comm-hga-parabolic', 'sci-radar-sar', 'sci-spectrometer-ir-uv', 'comp-neural-processor'],
    budget: 52000, // $52M
    massLimit: 950, // kg
    missionDurationDays: 180,
    minDeltaV: 2800, // high delta-V required for rendezvous match
    minPowerWatts: 600,
    minCommDataRateMbps: 25,
    minStorageGb: 256,
    difficulty: 'intermediate',
    environmentalHazards: [
      'Micro-meteoroid dust ejecta impacting solar arrays and optics during close proximity.',
      'Zero noticeable gravity requiring high-frequency RCS thruster firing for station-keeping.',
      'Complex tumbling shadows requiring continuous solar array re-orientation.'
    ],
    successConditions: {
      minSciencePoints: 1600,
      requireDataTransmitted: true,
      requireOrbitalInsertion: true,
      maxDamageAllowed: 25
    }
  },
  {
    id: 'mission-04-earth-guardian',
    code: 'MB-EARTH-04',
    name: 'Earth Guardian: Climate & Biosphere Sentinel',
    subtitle: 'Continuous multi-spectral Earth observation in Sun-Synchronous Polar Low-Earth Orbit.',
    target: 'Earth',
    targetDistance: '700 km',
    description: 'Place an environmental monitoring satellite into a 700km sun-synchronous polar orbit (SSO). The spacecraft crosses the equator at precisely the same local solar time on each orbit, providing consistent solar illumination. Heavy daily data generation from synthetic aperture radar and multi-spectral sensors requires high-speed X-band downlinks to polar ground stations.',
    scientificGoals: [
      'Quantify global rainforest biomass depletion and Arctic sea-ice extent variations.',
      'Track atmospheric aerosol concentrations and extreme cyclonic storm developments in real time.',
      'Acquire interferometric SAR land elevation deformation maps at sub-centimeter accuracy.',
      'Downlink over 600 GB of high-bandwidth environmental telemetry.'
    ],
    requiredInstrumentCategories: ['camera_highres', 'radar_sar'],
    recommendedComponents: ['struct-bus-cube-standard', 'power-solar-dual', 'power-battery-bank', 'prop-biprop-engine', 'comm-hga-parabolic', 'sci-camera-multispectral', 'sci-radar-sar', 'storage-ssd-1024', 'thermal-radiator-panel'],
    budget: 42000, // $42M
    massLimit: 1100, // kg
    missionDurationDays: 120,
    minDeltaV: 800, // lower delta-V needed for orbit maintenance
    minPowerWatts: 720,
    minCommDataRateMbps: 50,
    minStorageGb: 512,
    difficulty: 'beginner',
    environmentalHazards: [
      'Frequent orbital eclipses (35 minutes out of every 98-minute orbit).',
      'High orbital data throughput demanding rapid ground station downlink passes.',
      'Atmospheric drag atomic oxygen erosion at low Earth orbit altitudes.'
    ],
    successConditions: {
      minSciencePoints: 1500,
      requireDataTransmitted: true,
      requireOrbitalInsertion: true,
      maxDamageAllowed: 15
    }
  },
  {
    id: 'mission-05-deep-space-explorer',
    code: 'MB-OUTER-05',
    name: 'Deep Space Explorer: Kuiper Horizon',
    subtitle: 'Venture beyond Neptune into the cold outer solar system where solar arrays are useless.',
    target: 'Deep Space',
    targetDistance: '4,500,000,000 km (30 AU)',
    description: 'Launch a flagship exploration spacecraft on an escape trajectory past the gas giants into the Kuiper Belt. Solar radiation at 30 AU drops to 1/900th of Earth value, rendering solar panels completely inoperable and making an RTG nuclear power source mandatory. Communication light-travel time exceeds 4.5 hours each way, demanding total spacecraft autonomy and vast onboard data buffers.',
    scientificGoals: [
      'Measure solar wind termination shock boundary and interstellar magnetic field interface.',
      'Spectroscopic analysis of primordial methane/nitrogen ices on Kuiper Belt planetesimals.',
      'Quantify deep galactic cosmic ray flux and interstellar dust grain masses.',
      'Ensure survival and autonomous state machine execution over multi-year deep space cruise.'
    ],
    recommendedComponents: ['struct-bus-hex-heavy', 'power-rtg-deepspace', 'power-battery-bank', 'prop-ion-thruster', 'comm-hga-parabolic', 'comm-ka-transponder', 'sci-spectrometer-ir-uv', 'sci-detector-radiation', 'comp-flight-computer', 'storage-ssd-1024', 'thermal-radiator-panel'],
    requiredInstrumentCategories: ['spectrometer', 'detector_radiation'],
    budget: 85000, // $85M
    massLimit: 1400, // kg
    missionDurationDays: 450,
    minDeltaV: 3500, // high escape energy
    minPowerWatts: 250,
    minCommDataRateMbps: 10,
    minStorageGb: 512,
    difficulty: 'expert',
    environmentalHazards: [
      'Solar energy zero-flux: Solar panels generate negligible electricity beyond Saturn.',
      'Extreme 4+ hour communication latency: Emergency ground intervention is impossible in real time.',
      'Near absolute zero space temperatures (-250°C): Requires internal radioactive waste heat to keep fuel lines liquid.'
    ],
    successConditions: {
      minSciencePoints: 2400,
      requireDataTransmitted: true,
      requireOrbitalInsertion: false, // flyby/escape trajectory
      maxDamageAllowed: 30
    }
  }
];

export function getMissionById(id: string): MissionScenario | undefined {
  return MISSION_SCENARIOS.find(m => m.id === id);
}
