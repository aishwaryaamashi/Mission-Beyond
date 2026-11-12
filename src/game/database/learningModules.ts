export interface LearningModule {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  formula?: string;
  summary: string;
  detailedExplanation: string[];
  keyTradeoffs: string[];
  realWorldExample: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'learn-orbits',
    category: 'Orbital Mechanics',
    title: 'Orbital Trajectories & Delta-V',
    subtitle: 'Why spacecraft fall around planets rather than dropping straight down.',
    formula: 'v = \\sqrt{\\frac{GM}{r}} \\quad \\text{and} \\quad \\Delta v = I_{sp} g_0 \\ln\\left(\\frac{m_0}{m_f}\\right)',
    summary: 'An orbit is achieved when a spacecraft moves forward fast enough that as gravity pulls it down toward a celestial body, the surface curves away underneath it at the exact same rate. In Low Earth Orbit, this requires 7.8 km/s (28,000 km/h).',
    detailedExplanation: [
      'Orbits are defined by two key points: Periapsis (the lowest altitude point) and Apoapsis (the highest altitude point).',
      'Changing orbits requires applying thrust at specific nodes. To raise your highest point, you burn prograde (forward) at your lowest point.',
      'Delta-V (Δv) represents the total velocity change capability of a propulsion system. It determines where your spacecraft can go in the solar system, strictly bounded by the Tsiolkovsky Rocket Equation.'
    ],
    keyTradeoffs: [
      'Higher delta-V requires more propellant mass, which exponentially increases total launch weight.',
      'High-thrust chemical engines burn fast for short burns, while high-Isp ion engines must burn continuously over weeks or months.'
    ],
    realWorldExample: 'NASA’s Apollo missions required ~3,900 m/s delta-V to leave Earth orbit and enter translunar trajectory.'
  },
  {
    id: 'learn-power',
    category: 'Power Systems',
    title: 'Solar Panels vs. RTG Nuclear Power',
    subtitle: 'Generating electrical watts across the vast inverse-square darkness of space.',
    formula: 'P_{solar} = P_0 \\cdot \\left(\\frac{1\\text{ AU}}{d}\\right)^2',
    summary: 'Solar flux drops with the square of the distance from the Sun (the Inverse-Square Law). At Earth (1.0 AU), solar panels receive ~1361 W/m². At Mars (1.52 AU), this falls to 43%. Beyond Jupiter (5.2 AU), solar power is nearly negligible.',
    detailedExplanation: [
      'Photovoltaic solar panels use multi-junction Gallium-Arsenide (GaAs) cells to convert solar photon flux directly into electricity.',
      'Radioisotope Thermoelectric Generators (RTGs) use the natural radioactive decay heat of Plutonium-238 converted via thermocouples (Seebeck effect) into steady electricity.',
      'Secondary batteries (Lithium-Ion) are essential to buffer transient instrument peak currents and survive planetary shadow eclipses.'
    ],
    keyTradeoffs: [
      'Solar panels are cost-effective near the inner solar system, but add large aerodynamic cross-sections and fail in deep planetary shadow.',
      'RTGs are impervious to darkness and distance, but are costly, heavy, and require special launch authorization.'
    ],
    realWorldExample: 'Voyager 1 and 2 rely on RTGs and have operated continuously in interstellar space for over 45 years.'
  },
  {
    id: 'learn-thermal',
    category: 'Thermal Control',
    title: 'Vacuum Thermal Equilibrium & Heat Rejection',
    subtitle: 'Why cooling a spacecraft is often harder than keeping it warm.',
    formula: 'P_{rad} = \\epsilon \\sigma A \\left(T^4 - T_{space}^4\\right)',
    summary: 'Space is a vacuum, meaning conduction and convection do not exist. A spacecraft can only dump internal electronic waste heat into the cold void through radiative heat transfer via radiator surfaces.',
    detailedExplanation: [
      'Direct sunlight heats spacecraft skin up to +120°C, while shadow sides plunge to -150°C.',
      'Multi-Layer Insulation (MLI) blankets use dozens of embossed reflective Kapton and Germanium foils to minimize radiative thermal loss.',
      'Heat pipe radiators use pressurized ammonia to conduct heat from high-power avionics and transmitters to external white radiative fins.'
    ],
    keyTradeoffs: [
      'Large radiator fins reject more heat, but increase mass and risk micro-meteorite puncture.',
      'Thermal louvers provide active mechanical temperature regulation at the cost of moving parts and complexity.'
    ],
    realWorldExample: 'The James Webb Space Telescope uses a 5-layer tennis-court-sized sunshield to keep instruments below -233°C (40 K).'
  },
  {
    id: 'learn-comms',
    category: 'Telecommunications',
    title: 'Deep Space Link Budgets & Signal Latency',
    subtitle: 'Transmitting gigabits across millions of kilometers at the speed of light.',
    formula: '\\text{FSPL} = \\left(\\frac{4\\pi d}{\\lambda}\\right)^2 \\quad \\text{and} \\quad \\tau = \\frac{d}{c}',
    summary: 'Radio signals travel at the speed of light (300,000 km/s). Signals to Mars experience an average 12-minute delay each way, while Kuiper Belt probes take over 4 hours. High-Gain Antennas focus radio beams tightly to overcome free-space path loss.',
    detailedExplanation: [
      'Low-Gain Omnidirectional Antennas broadcast in all directions; useful for emergency tumbling recovery, but low bandwidth (kbps).',
      'High-Gain Parabolic Dishes focus the radio beam into a narrow pencil cone, requiring precise 3-axis pointing toward Earth.',
      'The Deep Space Network (DSN) uses giant 70-meter ground parabolic dishes in California, Spain, and Australia to capture faint spacecraft microwatt signals.'
    ],
    keyTradeoffs: [
      'High-Gain Dishes enable high-bandwidth science telemetry, but add structural mass and require dedicated pointing slews.',
      'High transmitter wattage burns substantial battery reserves and produces significant waste heat.'
    ],
    realWorldExample: 'NASA’s New Horizons spacecraft took 16 months to downlink its complete Pluto flyby dataset back to Earth at 2 kbps.'
  },
  {
    id: 'learn-science',
    category: 'Science Payloads',
    title: 'Instrument Trade-offs & Scientific Return',
    subtitle: 'Balancing the desire for discovery with mass, power, and storage limits.',
    formula: '\\text{Data Rate} = \\text{Resolution} \\times \\text{Framerate} \\times \\text{Bitdepth}',
    summary: 'Science instruments are the sole purpose of a scientific space mission. Cameras produce visual morphology, spectrometers determine chemical composition, and radar maps subterranean layers.',
    detailedExplanation: [
      'Framing cameras require stable pointing and clear lighting, generating vast data volumes (megabits per second).',
      'Spectrometers analyze absorption spectra lines to detect water ice, hydrocarbons, and minerals.',
      'Active synthetic aperture radar emits high-power microwave pulses that can penetrate darkness, dust, and planetary crust.'
    ],
    keyTradeoffs: [
      'Adding more instruments increases scientific discovery points, but compounds electrical demand and onboard storage needs.',
      'Radar instruments provide all-weather penetrative vision, but draw hundreds of watts of peak power.'
    ],
    realWorldExample: 'The Cassini-Huygens mission carried 12 scientific instruments to Saturn, discovering subsurface liquid oceans on Enceladus.'
  }
];
