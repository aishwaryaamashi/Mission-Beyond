# MISSION: BEYOND 🚀
### Advanced Interactive Space Mission Strategy & Simulation Game

> **"Every decision takes you closer to discovery — or failure."**

---

## 🛰️ 1. Project Overview

**MISSION: BEYOND** is a professional-grade browser-based space mission strategy and simulation game. Built with React 18, TypeScript, Tailwind CSS, Three.js, and React Three Fiber, it merges authentic aerospace mission-operations engineering with deep, consequence-driven simulation gameplay.

Players take command of an aerospace exploration agency to plan, construct, configure, validate, launch, and operate complex interplanetary probes across the solar system while balancing realistic engineering trade-offs.

---

## 🌌 2. Visual Design & Art Direction

- **Aerospace Mission Control Palette**:
  - Deep midnight navy (`#040711`, `#070C18`) and console slate (`#0B1224`, `#131D2E`) surfaces
  - Restrained technical cyan (`#06B6D4`, `#22D3EE`) for active systems and telemetry lock
  - Flight amber (`#F59E0B`, `#FBBF24`) for subsystem cautions and warnings
  - Abort red (`#EF4444`) for critical limits and launch prohibitions
  - Telemetry green (`#10B981`) for nominal states and certified validation
- **Technical Typography**:
  - `Rajdhani` & `Chakra Petch` for aerospace headings and flight status
  - `JetBrains Mono` for coordinates, delta-V budgets, bitrates, and telemetry streams
- **Zero Generic AI Slop**:
  - No random floating stars or cartoon assets
  - Clean 1px technical dividers, reticles, and authentic telemetry HUDs.

---

## 📐 3. Mathematical Simulation Engine

The simulation engine is separated cleanly from the UI and operates under governing physical equations:

1. **Propulsion & Tsiolkovsky Rocket Equation**:
   $$\Delta v = I_{sp} \cdot g_0 \cdot \ln\left(\frac{m_{dry} + m_{prop}}{m_{dry}}\right)$$
   Determines whether the spacecraft has sufficient velocity change for orbital injection, mid-course correction maneuvers (TCM), and attitude desaturation.

2. **Electrical Power & Solar Inverse-Square Law**:
   $$P_{gen} = P_{solar0} \cdot \left(\frac{1\,\text{AU}}{d}\right)^2 \cdot \eta_{degrade} + P_{RTG}$$
   $$E_{battery}(t+\Delta t) = E_{battery}(t) + (P_{gen} - P_{load})\cdot \Delta t$$
   Solar flux drops precipitously as a probe heads toward Mars (43%) or the outer Kuiper Belt (<0.1%), making nuclear RTG generators mandatory for deep space.

3. **Thermal Radiative Equilibrium**:
   $$P_{rad} = \epsilon \cdot \sigma \cdot A \cdot \left(T^4 - T_{space}^4\right)$$
   Internal electronic dissipation and solar radiation are balanced against multi-layer insulation (MLI) blankets and heat-pipe radiator fins.

4. **Deep Space Telemetry Link Budget**:
   $$\text{FSPL} = \left(\frac{4\pi d}{\lambda}\right)^2 \quad \text{and} \quad \tau = \frac{d}{c}$$
   Calculates free-space path loss and speed-of-light signal latency ($d/c$).

---

## 🛠️ 4. 8 Subsystem Component Categories

1. **Structure**: AeroCubic-600 Composite Bus, HexaTitan Interplanetary Core, MLI Gold Shielding Enclosure
2. **Power**: SolWing-I Single Array, SolWing-II Articulated Tracking Arrays, GPHS-RTG Nuclear Generator, Li-Ion Accumulator Banks
3. **Propulsion**: HyperGOL-400 Bipropellant Rocket Engine, Xenon-Hall Ion Electric Thruster, Quad-Cold Gas RCS Attitude Clusters
4. **Communication**: 1.4m Parabolic High-Gain Dish (HGA), Dual Omni Low-Gain Antenna, Ka-Band Deep Space Transponder
5. **Science**: SpectraCam High-Res Framing Camera, ChemSpec UV/IR Absorption Spectrometer, SAR-P Synthetic Aperture Radar, AeroTrace Gas Mass Spectrometer, RadGuard Cosmic Ray Detector
6. **Computing**: RAD-750 Space-Hardened Flight Computer, NeuroOptic Autonomous Processor
7. **Thermal**: Al-Loop Heat Pipe Radiator Fins, Bimetallic Thermostatic Louver Arrays, MLI Blankets
8. **Storage**: AeroFlash 256GB Solid State Recorder, TeraVault 1TB Rad-Tolerant Buffer

---

## 🪐 5. 5 Playable Mission Scenarios

- **Mission 01: Lunar Explorer** — Polar reconnaissance, water-ice detection in shadowed craters.
- **Mission 02: Mars Pathfinder** — Interplanetary Hohmann transfer, atmospheric entry, and dust storm monitoring.
- **Mission 03: Asteroid Watch** — Near-Earth carbonaceous asteroid rendezvous, radar 3D topography.
- **Mission 04: Earth Guardian** — Sun-synchronous climate & biosphere monitoring with high-throughput radar.
- **Mission 05: Deep Space Explorer** — Kuiper Belt flyby past 30 AU; extreme light latency and RTG power mandatory.

---

## 🎮 6. Interactive 3D Spacecraft CAD Builder

- Real-time procedural 3D modular geometry built with Three.js and React Three Fiber
- Dynamic component mounting: adding or removing a component immediately reflects in 3D
- Orbit controls: Left-click rotate, Right-click pan, Scroll zoom
- Interactive raycasting: click any 3D component or list item to inspect engineering specifications.

---

## 🚀 7. 8-Stage Simulation Engine & Dynamic Events

1. **Launch**: Countdown, booster ignition, max-Q dynamic pressure, upper-stage separation
2. **Deployment**: Solar panel wing articulation, antenna deployment, star-tracker acquisition
3. **Cruise**: Interplanetary transit, solar flux tracking, battery charge/discharge balance
4. **Navigation**: Trajectory condition review, TCM burns, propellant consumption
5. **Arrival**: Target approach, celestial gravity capture, retrograde insertion burn
6. **Scientific Operations**: Sensor activation, optical imaging, spectrometry data collection
7. **Communication**: DSN ground station pass, Ka-band downlink, buffer clearing
8. **Completion**: Telemetry audit, mission grade (S/A/B/C/D/F), achievements unlock

**Dynamic In-Flight Events**:
- Coronal Mass Ejections (Solar Particle Storms)
- ADCS Reaction Wheel Bearing Friction Spikes
- DSN Ground Antenna Desynchronization
- Uncatalogued Orbital Debris Crossing
- Spectrometer Stirling Cryo-Cooler Thermal Oscillations

---

## 💻 8. Installation & Local Development

### Requirements
- Node.js v18+ or v20+
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```

The game runs locally in your browser at `http://127.0.0.1:5173/`.
