import { SpacecraftComponent } from '../../types/game';

export const COMPONENT_CATALOG: SpacecraftComponent[] = [
  // ================= STRUCTURE =================
  {
    id: 'struct-bus-cube-standard',
    name: 'AeroCubic-600 Structural Bus',
    category: 'structure',
    description: 'Rigid aerospace-grade honeycomb carbon-composite central bus frame. Provides primary mounting hardpoints and structural load distribution.',
    mass: 120,
    cost: 1500, // $1.5M
    powerGen: 0,
    powerDraw: 15,
    dataGen: 0,
    dataStorage: 16,
    thermalRating: 150,
    reliability: 0.98,
    unlockedByDefault: true,
    meshType: 'bus_cube',
    mountPosition: [0, 0, 0]
  },
  {
    id: 'struct-bus-hex-heavy',
    name: 'HexaTitan Deep-Space Core',
    category: 'structure',
    description: 'Heavy hexagonal titanium-alloy structural chassis engineered for interplanetary stress, high delta-V vibration damping, and radiation protection.',
    mass: 220,
    cost: 3200, // $3.2M
    powerGen: 0,
    powerDraw: 25,
    dataGen: 0,
    dataStorage: 32,
    thermalRating: 300,
    reliability: 0.99,
    meshType: 'bus_hex',
    mountPosition: [0, 0, 0]
  },
  {
    id: 'struct-protective-housing',
    name: 'MLI Gold Radiation Shielding Enclosure',
    category: 'structure',
    description: 'Kapton and Germanium multi-layer insulation (MLI) housing to deflect solar cosmic rays and reduce thermal gradients.',
    mass: 35,
    cost: 850,
    powerGen: 0,
    powerDraw: 0,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 180,
    reliability: 0.99,
    meshType: 'thermal_blanket',
    mountPosition: [0, 0.45, 0]
  },

  // ================= POWER SYSTEMS =================
  {
    id: 'power-solar-single',
    name: 'SolWing-I Compact Solar Array',
    category: 'power',
    description: 'Single deployable gallium-arsenide (GaAs) photovoltaic panel wing. Generates up to 350W at 1.0 AU with 30% solar cell efficiency.',
    mass: 28,
    cost: 950,
    powerGen: 350,
    powerDraw: 5,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 30,
    reliability: 0.96,
    unlockedByDefault: true,
    meshType: 'solar_wing_1',
    mountPosition: [-1.4, 0, 0]
  },
  {
    id: 'power-solar-dual',
    name: 'SolWing-II Dual Articulated Solar Arrays',
    category: 'power',
    description: 'Dual deployable articulated tracking solar wings. Produces 850W at 1.0 AU with sun-tracking gimbal drives.',
    mass: 58,
    cost: 2100,
    powerGen: 850,
    powerDraw: 12,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 60,
    reliability: 0.95,
    meshType: 'solar_wing_2',
    mountPosition: [0, 0, 0]
  },
  {
    id: 'power-rtg-deepspace',
    name: 'GPHS-RTG Radioisotope Generator',
    category: 'power',
    description: 'Plutonium-238 general-purpose heat source generator. Delivers reliable, uninterrupted 250W power independent of distance from the Sun or shadow eclipses.',
    mass: 62,
    cost: 7500, // $7.5M
    powerGen: 260,
    powerDraw: 0,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 250,
    reliability: 0.999,
    meshType: 'rtg_unit',
    mountPosition: [0, 0, -1.0]
  },
  {
    id: 'power-battery-bank',
    name: 'Li-Ion Aerospace Battery Reserve (1.2 kWh)',
    category: 'power',
    description: 'High-density space-qualified lithium-ion accumulator bank for power buffering during orbital shadow and peak instrument draw.',
    mass: 32,
    cost: 720,
    powerGen: 0,
    powerDraw: 4,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 40,
    reliability: 0.97,
    unlockedByDefault: true,
    meshType: 'battery_bank',
    mountPosition: [0, -0.4, 0.4]
  },

  // ================= PROPULSION =================
  {
    id: 'prop-biprop-engine',
    name: 'HyperGOL-400 Bipropellant Rocket Engine',
    category: 'propulsion',
    description: 'Hydrazine and Nitrogen Tetroxide (NTO) high-thrust pressure-fed orbital insertion engine. 450N thrust, 318s Isp.',
    mass: 45,
    cost: 2800,
    powerGen: 0,
    powerDraw: 35,
    dataGen: 0,
    dataStorage: 0,
    isp: 318,
    propellantMass: 250,
    thermalRating: 100,
    reliability: 0.96,
    unlockedByDefault: true,
    meshType: 'engine_biprop',
    mountPosition: [0, -1.1, 0]
  },
  {
    id: 'prop-ion-thruster',
    name: 'Xenon-Hall High-Isp Ion Electric Engine',
    category: 'propulsion',
    description: 'Electrostatic xenon ion engine. Extremely high fuel efficiency (3100s Isp) with continuous low thrust, ideal for deep space cruise.',
    mass: 55,
    cost: 4600,
    powerGen: 0,
    powerDraw: 420, // high electrical consumption
    dataGen: 0,
    dataStorage: 0,
    isp: 3100,
    propellantMass: 90,
    thermalRating: 140,
    reliability: 0.97,
    meshType: 'engine_ion',
    mountPosition: [0, -1.1, 0]
  },
  {
    id: 'prop-rcs-quads',
    name: 'Quad-Cold Gas RCS Attitude Thruster Pods',
    category: 'propulsion',
    description: 'Four 3-axis cold gas reaction control thruster pods for 3-axis precision orientation, reaction wheel desaturation, and dockings.',
    mass: 18,
    cost: 650,
    powerGen: 0,
    powerDraw: 8,
    dataGen: 0,
    dataStorage: 0,
    isp: 190,
    propellantMass: 40,
    thermalRating: 20,
    reliability: 0.98,
    unlockedByDefault: true,
    meshType: 'rcs_cluster',
    mountPosition: [0.65, 0.65, 0.65]
  },

  // ================= COMMUNICATION =================
  {
    id: 'comm-hga-parabolic',
    name: 'High-Gain Parabolic Reflector Dish (1.4m)',
    category: 'communication',
    description: 'High-gain X/Ka-band directional parabolic dish antenna. Provides high-throughput telemetry downlink across multi-million kilometer distances.',
    mass: 24,
    cost: 1600,
    powerGen: 0,
    powerDraw: 45,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 25,
    reliability: 0.97,
    unlockedByDefault: true,
    meshType: 'antenna_hga_dish',
    mountPosition: [0, 0.9, 0]
  },
  {
    id: 'comm-omni-lowgain',
    name: 'Dual Low-Gain Omni Antenna Mast',
    category: 'communication',
    description: 'Omnidirectional low-gain S-band antenna array. Provides failsafe tumbling attitude telemetry and safe-mode ground link.',
    mass: 8,
    cost: 380,
    powerGen: 0,
    powerDraw: 12,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 10,
    reliability: 0.995,
    unlockedByDefault: true,
    meshType: 'antenna_omni',
    mountPosition: [0.55, 0.95, -0.4]
  },
  {
    id: 'comm-ka-transponder',
    name: 'Ka-Band Deep Space Power Transponder',
    category: 'communication',
    description: 'High-frequency 32GHz solid-state power amplifier with turbo-convolutional encoding for high-speed deep space data return.',
    mass: 15,
    cost: 2200,
    powerGen: 0,
    powerDraw: 85,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 80,
    reliability: 0.98,
    meshType: 'transponder',
    mountPosition: [0.4, 0, 0.5]
  },

  // ================= SCIENTIFIC INSTRUMENTS =================
  {
    id: 'sci-camera-multispectral',
    name: 'SpectraCam High-Resolution Framing Camera',
    category: 'science',
    description: 'Multi-filter 50-megapixel optical and near-IR camera. Captures geological features, surface morphology, and visual terrain maps.',
    mass: 18,
    cost: 2900,
    powerGen: 0,
    powerDraw: 32,
    dataGen: 45, // 45 Mbps
    dataStorage: 0,
    thermalRating: 25,
    reliability: 0.96,
    unlockedByDefault: true,
    meshType: 'camera_highres',
    mountPosition: [0, -0.3, 0.8]
  },
  {
    id: 'sci-spectrometer-ir-uv',
    name: 'ChemSpec UV/Infrared Absorption Spectrometer',
    category: 'science',
    description: 'Precision spectrometer analyzing reflected electromagnetic signatures to identify surface mineralogy, water ice, and volatile organics.',
    mass: 22,
    cost: 3400,
    powerGen: 0,
    powerDraw: 48,
    dataGen: 28, // 28 Mbps
    dataStorage: 0,
    thermalRating: 35,
    reliability: 0.95,
    meshType: 'spectrometer',
    mountPosition: [0.4, -0.3, 0.7]
  },
  {
    id: 'sci-radar-sar',
    name: 'SAR-P Synthetic Aperture Radar Array',
    category: 'science',
    description: 'Penetrating microwave radar to image subterranean ice deposits, sub-canopy geography, and obscured asteroid topography.',
    mass: 48,
    cost: 4800,
    powerGen: 0,
    powerDraw: 140, // high radar pulse draw
    dataGen: 80, // 80 Mbps
    dataStorage: 0,
    thermalRating: 110,
    reliability: 0.94,
    meshType: 'radar_sar',
    mountPosition: [-0.6, 0.2, 0.8]
  },
  {
    id: 'sci-sensor-atmosphere',
    name: 'AeroTrace Atmospheric Gas Mass Spectrometer',
    category: 'science',
    description: 'Quadrupole mass spectrometer analyzing trace atmospheric constituents, isotope ratios, and chemical equilibrium in planetary exospheres.',
    mass: 14,
    cost: 2100,
    powerGen: 0,
    powerDraw: 26,
    dataGen: 12,
    dataStorage: 0,
    thermalRating: 20,
    reliability: 0.97,
    meshType: 'sensor_atmosphere',
    mountPosition: [0, 0.7, 0.5]
  },
  {
    id: 'sci-detector-radiation',
    name: 'RadGuard Cosmic Ray & Magnetosphere Sensor',
    category: 'science',
    description: 'Solid-state silicon detector measuring solar energetic particles, van Allen radiation belts, and interplanetary magnetic field fluxes.',
    mass: 9,
    cost: 1400,
    powerGen: 0,
    powerDraw: 14,
    dataGen: 8,
    dataStorage: 0,
    thermalRating: 15,
    reliability: 0.985,
    meshType: 'detector_radiation',
    mountPosition: [-0.4, 0.6, -0.4]
  },

  // ================= COMPUTING =================
  {
    id: 'comp-flight-computer',
    name: 'RAD-750 Space-Hardened Flight Computer',
    category: 'computing',
    description: 'Triple-modular redundant radiation-tolerant flight processor. Executes guidance, navigation, autonomy, and fault recovery algorithms.',
    mass: 16,
    cost: 1850,
    powerGen: 0,
    powerDraw: 24,
    dataGen: 0,
    dataStorage: 64, // 64 GB boot/telemetry memory
    thermalRating: 30,
    reliability: 0.999,
    unlockedByDefault: true,
    meshType: 'flight_computer',
    mountPosition: [0.3, 0.2, 0]
  },
  {
    id: 'comp-neural-processor',
    name: 'NeuroOptic Autonomous Science Processor',
    category: 'computing',
    description: 'Hardware neural accelerator capable of realtime automated feature detection, image compression, and adaptive targeting.',
    mass: 12,
    cost: 2600,
    powerGen: 0,
    powerDraw: 38,
    dataGen: 0,
    dataStorage: 128,
    thermalRating: 45,
    reliability: 0.98,
    meshType: 'flight_computer',
    mountPosition: [-0.3, 0.2, 0]
  },

  // ================= THERMAL MANAGEMENT =================
  {
    id: 'thermal-radiator-panel',
    name: 'Al-Loop Heat Pipe Radiator Fin',
    category: 'thermal',
    description: 'High-emissivity optical solar reflector surface with embedded ammonia loop heat pipes. Radiates up to 350W excess thermal energy into deep space.',
    mass: 19,
    cost: 920,
    powerGen: 0,
    powerDraw: 6,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 350,
    reliability: 0.985,
    unlockedByDefault: true,
    meshType: 'radiator_panel',
    mountPosition: [0, 0, -0.85]
  },
  {
    id: 'thermal-active-louvers',
    name: 'Bimetallic Thermostatic Louver Array',
    category: 'thermal',
    description: 'Mechanically autonomous louvers that open and close based on internal temperature to maintain optimal electronics temperature.',
    mass: 14,
    cost: 1250,
    powerGen: 0,
    powerDraw: 4,
    dataGen: 0,
    dataStorage: 0,
    thermalRating: 220,
    reliability: 0.98,
    meshType: 'radiator_panel',
    mountPosition: [-0.85, 0, 0]
  },

  // ================= DATA STORAGE =================
  {
    id: 'storage-ssd-256',
    name: 'AeroFlash 256GB Solid State Recorder',
    category: 'storage',
    description: 'Single-event-upset (SEU) protected flash storage buffer to store raw scientific observations during ground station blackouts.',
    mass: 6,
    cost: 800,
    powerGen: 0,
    powerDraw: 10,
    dataGen: 0,
    dataStorage: 256,
    thermalRating: 15,
    reliability: 0.99,
    unlockedByDefault: true,
    meshType: 'storage_module',
    mountPosition: [0, -0.2, -0.4]
  },
  {
    id: 'storage-ssd-1024',
    name: 'TeraVault 1TB Rad-Tolerant High-Density Buffer',
    category: 'storage',
    description: 'High-capacity 1024GB non-volatile science archive buffer capable of recording multi-gigabyte continuous radar and multispectral scans.',
    mass: 11,
    cost: 2100,
    powerGen: 0,
    powerDraw: 18,
    dataGen: 0,
    dataStorage: 1024,
    thermalRating: 25,
    reliability: 0.985,
    meshType: 'storage_module',
    mountPosition: [0, 0.2, -0.4]
  }
];

export function getComponentById(id: string): SpacecraftComponent | undefined {
  return COMPONENT_CATALOG.find(c => c.id === id);
}

export function getComponentsByCategory(category: SpacecraftComponent['category']): SpacecraftComponent[] {
  return COMPONENT_CATALOG.filter(c => c.category === category);
}
