import { 
  SpacecraftComponent, 
  LaunchVehicle, 
  OrbitConfiguration, 
  MissionScenario, 
  ValidationResult, 
  ValidationIssue, 
  ValidationStatus 
} from '../../types/game';
import { calculateSpacecraftResources } from '../calculations/resources';

export function validateMissionConfiguration(
  components: SpacecraftComponent[],
  mission: MissionScenario,
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const resources = calculateSpacecraftResources(components, launchVehicle, orbit);

  const massMarginKg = mission.massLimit - resources.totalMassKg;
  const budgetMargin = mission.budget - resources.totalCost;
  const deltaVMarginMs = resources.totalDeltaVMs - mission.minDeltaV;

  // 1. Structure Check (Critical)
  const hasBus = components.some(c => c.category === 'structure' && (c.meshType === 'bus_cube' || c.meshType === 'bus_hex'));
  if (!hasBus) {
    issues.push({
      id: 'crit-no-bus',
      status: 'CRITICAL',
      subsystem: 'mass',
      title: 'Missing Primary Structural Bus',
      explanation: 'The spacecraft lacks a primary load-bearing central bus chassis to mount equipment and distribute launch vibrations.',
      consequence: 'Spacecraft cannot withstand launch aerodynamic max-Q dynamic pressure and structural acoustic loads.',
      recommendedAction: 'Add a structural bus from the Structure catalog (AeroCubic-600 or HexaTitan).'
    });
  }

  // 2. Flight Computer Check (Critical)
  const hasComputer = components.some(c => c.category === 'computing');
  if (!hasComputer) {
    issues.push({
      id: 'crit-no-computer',
      status: 'CRITICAL',
      subsystem: 'science',
      title: 'Missing Flight Avionics & Computer',
      explanation: 'No radiation-hardened command and data handling (C&DH) computer is installed on the bus.',
      consequence: 'The spacecraft has no autonomous guidance, attitude determination, or instrument sequencing capability.',
      recommendedAction: 'Add the RAD-750 Space-Hardened Flight Computer or NeuroOptic Processor from Computing.'
    });
  }

  // 3. Mass Limit Validation
  if (resources.totalMassKg > mission.massLimit) {
    issues.push({
      id: 'crit-mass-exceeded',
      status: 'CRITICAL',
      subsystem: 'mass',
      title: `Maximum Launch Mass Exceeded (${resources.totalMassKg} kg > ${mission.massLimit} kg)`,
      explanation: `Total spacecraft mass exceeds the scenario launch allowance by ${Math.abs(massMarginKg)} kg.`,
      consequence: 'The designated launch manifest cannot insert the overweight payload into the required mission trajectory.',
      recommendedAction: 'Remove non-essential heavy instruments, switch to a lighter bus, or optimize propellant load.'
    });
  } else if (massMarginKg < 40) {
    issues.push({
      id: 'warn-tight-mass-margin',
      status: 'WARNING',
      subsystem: 'mass',
      title: 'Very Tight Mass Margin (<40 kg)',
      explanation: `Spacecraft mass is near the threshold with only ${massMarginKg} kg reserve margin remaining.`,
      consequence: 'Any minor trajectory dispersion or additional thermal blanket weight could trigger launch abort.',
      recommendedAction: 'Consider shedding secondary hardware to preserve at least a 10% mass margin.'
    });
  }

  // 4. Launch Vehicle Compatibility & Capacity Check
  if (!launchVehicle) {
    issues.push({
      id: 'crit-no-launch-vehicle',
      status: 'CRITICAL',
      subsystem: 'vehicle',
      title: 'No Launch Vehicle Selected',
      explanation: 'A rocket launcher has not been designated to boost the spacecraft into space.',
      consequence: 'Mission cannot proceed to countdown without an allocated rocket.',
      recommendedAction: 'Navigate to Mission Configuration and select an appropriate launch vehicle.'
    });
  } else {
    // Check specific payload capacity for target orbit
    let capacity = launchVehicle.payloadCapacityLeo;
    if (orbit) {
      if (orbit.id === 'geo' || orbit.id === 'lunar_polar') {
        capacity = launchVehicle.payloadCapacityGto;
      } else if (orbit.id === 'mars_transfer' || orbit.id === 'heliocentric') {
        capacity = launchVehicle.payloadCapacityEscape;
      }
    }

    if (resources.totalMassKg > capacity) {
      issues.push({
        id: 'crit-lv-capacity',
        status: 'CRITICAL',
        subsystem: 'vehicle',
        title: `Vehicle Payload Capacity Insufficient (${resources.totalMassKg} kg vs ${capacity} kg capacity)`,
        explanation: `${launchVehicle.name} can only deliver ${capacity} kg to the target orbital profile, but your spacecraft weighs ${resources.totalMassKg} kg.`,
        consequence: 'The rocket upper stage will exhaust propellant prior to achieving target orbital insertion velocity.',
        recommendedAction: 'Select a heavier launch vehicle (e.g. Titan-Centaur Heavy or Prometheus) or reduce spacecraft mass.'
      });
    }
  }

  // 5. Budget Validation
  if (resources.totalCost > mission.budget) {
    const overrun = resources.totalCost - mission.budget;
    issues.push({
      id: 'crit-budget-exceeded',
      status: 'CRITICAL',
      subsystem: 'budget',
      title: `Fiscal Budget Exceeded by $${(overrun / 1000).toFixed(2)}M`,
      explanation: `Total procurement and launch costs ($${(resources.totalCost / 1000).toFixed(2)}M) exceed the authorized mission cap of $${(mission.budget / 1000).toFixed(2)}M.`,
      consequence: 'The mission cannot receive financial appropriation from the aerospace oversight board.',
      recommendedAction: 'Select lower-cost components, choose a more economical launch vehicle, or reduce expensive duplicate sensors.'
    });
  } else if (budgetMargin < mission.budget * 0.05) {
    issues.push({
      id: 'warn-tight-budget',
      status: 'WARNING',
      subsystem: 'budget',
      title: 'Minimal Financial Reserve (<5% Budget Contingency)',
      explanation: `Only $${(budgetMargin / 1000).toFixed(2)}M remains in reserve contingency funds.`,
      consequence: 'In-flight anomaly resolution or software re-programmings may face funding constraints.',
      recommendedAction: 'Maintain an 8-10% financial buffer for flight margin.'
    });
  }

  // 6. Power Generation vs Consumption & Solar Flux Check
  if (resources.netPowerW < 0) {
    issues.push({
      id: 'crit-power-deficit',
      status: 'CRITICAL',
      subsystem: 'power',
      title: `Negative Power Balance (Deficit: ${Math.abs(resources.netPowerW)} W)`,
      explanation: `Spacecraft electrical systems consume ${resources.powerDrawW} W, while generators only produce ${resources.powerGenW} W under current solar flux conditions.`,
      consequence: 'Spacecraft will experience battery brownout during cruise and transition into an unrecoverable dead-bus tumble.',
      recommendedAction: 'Install higher capacity solar arrays (SolWing-II), add an RTG unit, or disable high-draw radar sensors.'
    });
  } else if (resources.netPowerW < 30) {
    issues.push({
      id: 'warn-low-power-margin',
      status: 'WARNING',
      subsystem: 'power',
      title: `Low Power Margin (+${resources.netPowerW} W reserve)`,
      explanation: 'Power generation barely exceeds baseline equipment load, leaving little headroom for battery recharge.',
      consequence: 'Recharging batteries after shadow eclipses will be sluggish, risking successive brownouts.',
      recommendedAction: 'Add supplementary solar surface area or optimize active instrument cycles.'
    });
  }

  // Deep Space Special Solar Flux Warning
  if (mission.target === 'Deep Space' && !components.some(c => c.meshType === 'rtg_unit')) {
    issues.push({
      id: 'crit-deep-space-rtg',
      status: 'CRITICAL',
      subsystem: 'power',
      title: 'Solar Panels Ineffective in Deep Space (RTG Mandatory)',
      explanation: 'Solar irradiance drops by 99.9% in the Kuiper Belt (30 AU). Photovoltaic panels will generate less than 2 Watts.',
      consequence: 'Spacecraft will freeze and completely lose electrical power within months after passing Jupiter.',
      recommendedAction: 'Mount the GPHS-RTG Radioisotope Thermoelectric Generator from the Power catalog.'
    });
  }

  // 7. Battery Reserve during Shadow Eclipses
  const eclipseDurationMins = orbit ? (orbit.eclipsePercentage / 100) * 95 : 35;
  if (resources.batteryReserveMinutes < eclipseDurationMins) {
    issues.push({
      id: 'crit-battery-eclipse',
      status: 'CRITICAL',
      subsystem: 'power',
      title: `Insufficient Battery Endurance for Shadow Phase (${resources.batteryReserveMinutes} mins < ${Math.round(eclipseDurationMins)} mins required)`,
      explanation: `Orbital mechanics subject the spacecraft to ${Math.round(eclipseDurationMins)} minutes of complete solar eclipse, but batteries deplete in ${resources.batteryReserveMinutes} minutes.`,
      consequence: 'Total bus blackout during eclipse will reset the flight computer and deactivate thermal heaters.',
      recommendedAction: 'Add Li-Ion Aerospace Battery Reserve banks or reduce idle power consumption.'
    });
  }

  // 8. Propulsion & Delta-V Budget
  if (resources.totalDeltaVMs < mission.minDeltaV) {
    const deficit = mission.minDeltaV - resources.totalDeltaVMs;
    issues.push({
      id: 'crit-delta-v-deficit',
      status: 'CRITICAL',
      subsystem: 'propulsion',
      title: `Delta-V Budget Insufficient (${resources.totalDeltaVMs} m/s vs ${mission.minDeltaV} m/s required)`,
      explanation: `The propulsion system lacks ${deficit} m/s delta-V to complete orbital injection burns and trajectory trims.`,
      consequence: 'Spacecraft will miss orbit insertion, flying past the target celestial body into useless solar orbit.',
      recommendedAction: 'Mount a higher-Isp engine (HyperGOL or Xenon-Hall Ion), add propellant mass, or reduce dry mass.'
    });
  }

  // 9. Mandatory Scientific Instruments Check
  for (const reqCategory of mission.requiredInstrumentCategories) {
    const hasCategory = components.some(c => c.meshType === reqCategory);
    if (!hasCategory) {
      issues.push({
        id: `crit-missing-instrument-${reqCategory}`,
        status: 'CRITICAL',
        subsystem: 'science',
        title: `Mandatory Scientific Sensor Missing (${reqCategory.replace('_', ' ').toUpperCase()})`,
        explanation: `Mission primary objective requires an active ${reqCategory.replace('_', ' ')} to collect mandated discovery data.`,
        consequence: 'Mission will be unable to fulfill its primary science contract, resulting in mission failure.',
        recommendedAction: `Add the corresponding instrument (e.g. SpectraCam, ChemSpec, or SAR Radar) from the Science catalog.`
      });
    }
  }

  // 10. Communication Antenna Check
  const hasAntenna = components.some(c => c.category === 'communication');
  if (!hasAntenna) {
    issues.push({
      id: 'crit-no-antenna',
      status: 'CRITICAL',
      subsystem: 'communication',
      title: 'No Communication Antenna Installed',
      explanation: 'No high-gain dish or omni antenna was mounted on the spacecraft.',
      consequence: 'Mission Control cannot send uplink commands, and zero scientific data or telemetry can be returned to Earth.',
      recommendedAction: 'Add the High-Gain Parabolic Dish or Low-Gain Omni Antenna from Communications.'
    });
  } else if ((mission.target === 'Mars' || mission.target === 'Deep Space') && !components.some(c => c.meshType === 'antenna_hga_dish')) {
    issues.push({
      id: 'warn-deep-space-hga',
      status: 'WARNING',
      subsystem: 'communication',
      title: 'Low-Gain Antenna Inadequate for Interplanetary Distances',
      explanation: 'Omni antenna signal attenuation across tens of millions of kilometers yields less than 2 kbps bitrate.',
      consequence: 'Downlinking high-resolution science images will take months, bottlenecking scientific output.',
      recommendedAction: 'Equip the 1.4m High-Gain Parabolic Dish Antenna for high-speed directional link.'
    });
  }

  // 11. Data Storage vs Science Generation Rate
  if (resources.dataGenMbps > 0 && resources.storageCapacityGb < mission.minStorageGb) {
    issues.push({
      id: 'warn-insufficient-storage',
      status: 'WARNING',
      subsystem: 'storage',
      title: `Onboard Storage Buffer Constrained (${resources.storageCapacityGb} GB vs ${mission.minStorageGb} GB recommended)`,
      explanation: 'Science sensors generate data faster than the storage buffer can absorb during ground station passes.',
      consequence: 'High-density observation passes over prime targets will saturate the buffer, forcing data loss.',
      recommendedAction: 'Upgrade to the TeraVault 1TB or AeroFlash 256GB Solid State Recorder from Storage.'
    });
  }

  // 12. Thermal Management Check
  if (resources.thermalBalanceTempC > 65) {
    issues.push({
      id: 'crit-thermal-overheating',
      status: 'CRITICAL',
      subsystem: 'thermal',
      title: `Critical Overheating Forecast (${resources.thermalBalanceTempC}°C > 65°C max operating temp)`,
      explanation: `Internal electronics generate more waste heat than the structural surface can radiate into space.`,
      consequence: 'Computer processor and camera sensors will suffer permanent thermal latch-up and electronic failure.',
      recommendedAction: 'Mount heat-pipe radiator panels or active bimetallic thermal louvers from Thermal Management.'
    });
  } else if (resources.thermalBalanceTempC < -40 && !components.some(c => c.meshType === 'thermal_blanket' || c.meshType === 'rtg_unit')) {
    issues.push({
      id: 'warn-thermal-cold',
      status: 'WARNING',
      subsystem: 'thermal',
      title: `Extreme Deep Cold Forecast (${resources.thermalBalanceTempC}°C)`,
      explanation: 'Spacecraft lacks sufficient thermal shielding or radioactive decay heat to prevent freezing.',
      consequence: 'Hydrazine propellant in fuel lines will freeze, disabling attitude thrusters.',
      recommendedAction: 'Add MLI Gold Radiation Shielding or active electric heater blankets.'
    });
  }

  // Determine Overall Status
  let overallStatus: ValidationStatus = 'PASS';
  const hasCritical = issues.some(i => i.status === 'CRITICAL');
  const hasWarning = issues.some(i => i.status === 'WARNING');

  if (hasCritical) {
    overallStatus = 'CRITICAL';
  } else if (hasWarning) {
    overallStatus = 'WARNING';
  }

  const canLaunch = !hasCritical;

  return {
    overallStatus,
    canLaunch,
    issues,
    metrics: {
      totalMassKg: resources.totalMassKg,
      massMarginKg,
      totalCost: resources.totalCost,
      budgetMargin,
      powerGenerationW: resources.powerGenW,
      powerConsumptionW: resources.powerDrawW,
      netPowerW: resources.netPowerW,
      batteryCapacityWh: resources.batteryCapacityWh,
      eclipseMarginMinutes: resources.batteryReserveMinutes,
      totalDeltaVMs: resources.totalDeltaVMs,
      deltaVMarginMs,
      dataGenerationMbps: resources.dataGenMbps,
      storageCapacityGb: resources.storageCapacityGb,
      downlinkRateMbps: resources.downlinkRateMbps,
      thermalDissipationW: resources.thermalDissipationW,
      spacecraftReliabilityIndex: resources.reliabilityIndex
    }
  };
}
