import { DynamicEvent, SimulationStage } from '../../types/game';

export const DYNAMIC_EVENTS_POOL: DynamicEvent[] = [
  {
    id: 'event-solar-flare',
    title: 'Coronal Mass Ejection: Solar Particle Storm',
    severity: 'critical',
    triggerStage: 'cruise',
    description: 'Solar space weather satellites detect a Class-X solar flare erupting directly along the spacecraft trajectory. High-energy protons are about to strike solar arrays and sensitive CMOS camera sensors.',
    systemAffected: 'Power & Scientific Optics',
    timestamp: 0,
    choices: [
      {
        id: 'choice-safe-mode-roll',
        label: 'Roll Spacecraft & Point MLI Shield at Sun (Safe Mode)',
        description: 'Re-orient the bus so the titanium heat shield and MLI blankets face the radiation wavefront. Instruments powered down for 4 hours.',
        resourceImpact: {
          propellantDeltaKg: -5,
          batteryDeltaWh: -120,
          sciencePointsDelta: -50,
          damageDelta: 0
        },
        explanation: 'Safely protects all sensors and solar cells from permanent latchup, consuming only 5kg RCS attitude fuel and modest battery power.'
      },
      {
        id: 'choice-deflect-heaters',
        label: 'Maintain Course & Over-drive Radiator Heat Loop',
        description: 'Keep science instruments active in low-power observation mode while cycling thermal radiator loops.',
        resourceImpact: {
          propellantDeltaKg: 0,
          batteryDeltaWh: -280,
          sciencePointsDelta: +120,
          damageDelta: 12
        },
        explanation: 'Yields valuable solar storm scientific measurements, but causes 12% micro-degradation to solar cell efficiency.'
      },
      {
        id: 'choice-dump-telemetry',
        label: 'Deploy Magnetic Field Sensors & Record Peak Flux',
        description: 'Command radiation detector to full sampling frequency and dump buffer to high-gain dish immediately.',
        resourceImpact: {
          propellantDeltaKg: -2,
          batteryDeltaWh: -350,
          sciencePointsDelta: +250,
          damageDelta: 8
        },
        explanation: 'Produces groundbreaking discovery data on solar proton acceleration with minor radiation exposure.'
      }
    ]
  },
  {
    id: 'event-reaction-wheel-friction',
    title: 'Reaction Wheel #2 Bearing Friction Spike',
    severity: 'warning',
    triggerStage: 'navigation',
    description: 'Telemetry alerts indicate bearing torque resistance in Reaction Wheel #2 has jumped from 0.05 Nm to 0.42 Nm, causing attitude jitter during star-tracker lock.',
    systemAffected: 'Attitude Determination & Control (ADCS)',
    timestamp: 0,
    choices: [
      {
        id: 'choice-desaturate-rcs',
        label: 'Switch to Cold-Gas RCS Thrusters for Attitude Trims',
        description: 'Spin down the struggling reaction wheel and use attitude thruster pulses for fine pointing during maneuvers.',
        resourceImpact: {
          propellantDeltaKg: -14,
          batteryDeltaWh: 0,
          damageDelta: 0
        },
        explanation: 'Completely eliminates wheel bearing wear, preserving ADCS health at the expense of 14 kg of propellant.'
      },
      {
        id: 'choice-thermal-reconditioning',
        label: 'Execute Thermal Bearing Re-lubrication Cycle',
        description: 'Apply targeted heater power to warm bearing synthetic grease and reverse spin direction.',
        resourceImpact: {
          propellantDeltaKg: 0,
          batteryDeltaWh: -95,
          damageDelta: 4
        },
        explanation: 'Clears grease crystallization and restores smooth rotation, saving precious propellant with only 95 Wh battery draw.'
      }
    ]
  },
  {
    id: 'event-comm-alignment-drift',
    title: 'Deep Space Network Ground Antenna Desynchronization',
    severity: 'warning',
    triggerStage: 'communication',
    description: 'Madrid Deep Space Communications Complex reports high atmospheric moisture and dish feed alignment drift, degrading signal carrier-to-noise ratio by 4.2 dB.',
    systemAffected: 'Radio Frequency Downlink',
    timestamp: 0,
    choices: [
      {
        id: 'choice-boost-transponder',
        label: 'Overdrive Ka-Band Power Amplifier to 100W',
        description: 'Boost transmitter RF wattage to burn through atmospheric attenuation and maintain target 25 Mbps throughput.',
        resourceImpact: {
          batteryDeltaWh: -180,
          sciencePointsDelta: +80,
          damageDelta: 2
        },
        explanation: 'Maintains scheduled high-speed science downlink without backlog, drawing extra battery power.'
      },
      {
        id: 'choice-adaptive-coding',
        label: 'Drop to Robust Low-Bitrate Convolutional Coding',
        description: 'Throttle transmission bitrate by 50% and activate Reed-Solomon packet error correction until Canberra station acquires signal.',
        resourceImpact: {
          batteryDeltaWh: -30,
          sciencePointsDelta: 0,
          delaySeconds: 1800
        },
        explanation: 'Ensures zero packet corruption at low power consumption, delaying final downlink completion by 30 minutes.'
      }
    ]
  },
  {
    id: 'event-unexpected-orbital-debris',
    title: 'Proximity Warning: Uncatalogued Orbital Debris Track',
    severity: 'critical',
    triggerStage: 'arrival',
    description: 'Ground optical radar tracks a 12cm orbital fragment on a reciprocal vector intersecting the spacecraft corridor within 22 minutes.',
    systemAffected: 'Structural Integrity & Trajectory',
    timestamp: 0,
    choices: [
      {
        id: 'choice-tcm-burn',
        label: 'Execute Emergency Retrograde Trajectory Correction Burn',
        description: 'Fire main propulsion engine for 4.2 seconds to alter orbital periapsis by 18 km out of the collision plane.',
        resourceImpact: {
          propellantDeltaKg: -18,
          batteryDeltaWh: -40,
          damageDelta: 0
        },
        explanation: 'Guarantees 100% collision avoidance safety, consuming 18 kg of fuel and slightly modifying the final insertion geometry.'
      },
      {
        id: 'choice-rcs-dodge',
        label: 'Minimum-Impulse RCS Lateral Dodge Maneuver',
        description: 'Use attitude control thrusters to perform a shallow 300-meter sidestep vector.',
        resourceImpact: {
          propellantDeltaKg: -6,
          batteryDeltaWh: -20,
          damageDelta: 5
        },
        explanation: 'Saves propellant while clearing the core debris cloud, though glancing micro-dust leaves 5% cosmetic sensor scuffing.'
      }
    ]
  },
  {
    id: 'event-sensor-glitch-spectrometer',
    title: 'Infrared Cryo-Cooler Thermal Oscillation',
    severity: 'info',
    triggerStage: 'science_ops',
    description: 'Spectrometer Stirling cycle cryo-cooler reports temperature rising above 85 Kelvin (-188°C), causing infrared detector noise and optical baseline drift.',
    systemAffected: 'Spectrometer Cryogenics',
    timestamp: 0,
    choices: [
      {
        id: 'choice-deep-space-point',
        label: 'Slew Spacecraft to Point Optics at Dark Deep Space Sky',
        description: 'Use radiative cooling against cold empty space for 15 minutes to re-stabilize detector thermal equilibrium.',
        resourceImpact: {
          propellantDeltaKg: -3,
          batteryDeltaWh: -45,
          sciencePointsDelta: +100,
          damageDelta: 0
        },
        explanation: 'Passively drops sensor temperature back down to nominal 70K, restoring crystalline spectral absorption clarity.'
      },
      {
        id: 'choice-digital-filter',
        label: 'Apply Neural De-noising Calibration Filter',
        description: 'Instruct the flight computer to subtract thermal background dark current in software.',
        resourceImpact: {
          batteryDeltaWh: -80,
          sciencePointsDelta: +50,
          damageDelta: 0
        },
        explanation: 'Avoids attitude slews and propellant burn, recovering usable science data via on-board digital filtering.'
      }
    ]
  }
];

export function getEventForStage(stage: SimulationStage): DynamicEvent | null {
  const matching = DYNAMIC_EVENTS_POOL.filter(e => e.triggerStage === stage);
  if (matching.length === 0) return null;
  const picked = matching[Math.floor(Math.random() * matching.length)];
  return { ...picked, timestamp: Date.now() };
}
