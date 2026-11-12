import { LaunchVehicle } from '../../types/game';

export const LAUNCH_VEHICLES: LaunchVehicle[] = [
  {
    id: 'lv-pegasus-light',
    name: 'Vanguard-II Light Launcher',
    manufacturer: 'AeroLaunch Systems',
    payloadCapacityLeo: 650,
    payloadCapacityGto: 280,
    payloadCapacityEscape: 120,
    cost: 12000, // $12M
    reliability: 0.94,
    fairingDiameter: 2.1,
    description: 'Cost-effective two-stage small-lift launch vehicle. Ideal for lightweight Earth observation and low-mass lunar microsatellites.'
  },
  {
    id: 'lv-falcon-medium',
    name: 'AeroFalcon-9 Medium Booster',
    manufacturer: 'Orbital Dynamics Corp',
    payloadCapacityLeo: 3200,
    payloadCapacityGto: 1450,
    payloadCapacityEscape: 850,
    cost: 22000, // $22M
    reliability: 0.99,
    fairingDiameter: 3.8,
    description: 'High-flight-rate medium-lift workhorse with flight-proven liquid oxygen / RP-1 kerosene engines. Exceptional reliability and fairing volume.'
  },
  {
    id: 'lv-centaur-heavy',
    name: 'Titan-Centaur Heavy Launcher',
    manufacturer: 'Deep Space Propulsion Ltd',
    payloadCapacityLeo: 6800,
    payloadCapacityGto: 3100,
    payloadCapacityEscape: 1800,
    cost: 38000, // $38M
    reliability: 0.97,
    fairingDiameter: 5.2,
    description: 'Heavy-lift cryogenic hydrogen/oxygen three-stage booster. Engineered for high characteristic energy (C3 > 0) Mars transfers and outer solar system probes.'
  },
  {
    id: 'lv-super-heavy',
    name: 'Prometheus Super-Heavy System',
    manufacturer: 'Interplanetary Flight Systems',
    payloadCapacityLeo: 18000,
    payloadCapacityGto: 8500,
    payloadCapacityEscape: 4200,
    cost: 58000, // $58M
    reliability: 0.96,
    fairingDiameter: 7.0,
    description: 'Ultra-heavy deep space launch system. Delivers multi-ton flagships directly to outer planetary transfer trajectories with vast payload margins.'
  }
];

export function getLaunchVehicleById(id: string): LaunchVehicle | undefined {
  return LAUNCH_VEHICLES.find(lv => lv.id === id);
}
