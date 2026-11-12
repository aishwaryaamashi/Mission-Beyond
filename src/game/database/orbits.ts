import { OrbitConfiguration, OrbitType } from '../../types/game';

export const ORBIT_CONFIGURATIONS: Record<OrbitType, OrbitConfiguration> = {
  leo: {
    id: 'leo',
    name: 'Low Earth Orbit (LEO)',
    altitude: '400 km circular, 51.6° inclination',
    deltaVRequired: 300,
    solarFluxMultiplier: 1.0,
    commDelaySeconds: 0.003,
    eclipsePercentage: 38,
    description: 'Standard orbital altitude for space stations and Earth observation satellites. High orbital frequency with regular 36-minute night-side eclipses.'
  },
  polar_sso: {
    id: 'polar_sso',
    name: 'Polar Sun-Synchronous Orbit (SSO)',
    altitude: '700 km circular, 98.2° retrograde inclination',
    deltaVRequired: 450,
    solarFluxMultiplier: 1.0,
    commDelaySeconds: 0.005,
    eclipsePercentage: 25,
    description: 'Retrograde polar orbit where precession matches Earth orbital rotation around the Sun. Guarantees consistent ground illumination for photography.'
  },
  geo: {
    id: 'geo',
    name: 'Geostationary Orbit (GEO)',
    altitude: '35,786 km circular, 0° equatorial',
    deltaVRequired: 1800,
    solarFluxMultiplier: 1.0,
    commDelaySeconds: 0.12,
    eclipsePercentage: 5,
    description: 'Matches Earth 24-hour rotational period. Spacecraft remains stationary relative to ground tracking stations; minimal solar eclipse shadows.'
  },
  lunar_polar: {
    id: 'lunar_polar',
    name: 'Lunar Polar Insertion Orbit',
    altitude: '100 km circular lunar orbit, 90° inclination',
    deltaVRequired: 1450,
    solarFluxMultiplier: 1.0,
    commDelaySeconds: 1.28,
    eclipsePercentage: 42,
    description: 'Direct orbit over lunar north and south poles. Experiences communication occultation when passing behind the Moon.'
  },
  mars_transfer: {
    id: 'mars_transfer',
    name: 'Hohmann Mars Transfer & Areocentric Capture',
    altitude: '250 km periapsis x 20,400 km apoapsis',
    deltaVRequired: 2200,
    solarFluxMultiplier: 0.43, // 1 / 1.52^2
    commDelaySeconds: 720, // 12 minutes average
    eclipsePercentage: 15,
    description: 'Interplanetary elliptical transfer trajectory followed by hyperbolic capture burn at Mars. Solar illumination falls to 43% of terrestrial values.'
  },
  heliocentric: {
    id: 'heliocentric',
    name: 'Heliocentric Deep Space Escape Trajectory',
    altitude: 'C3 = 25 km²/s² Hyperbolic Escape Arc',
    deltaVRequired: 3400,
    solarFluxMultiplier: 0.001, // outer solar system
    commDelaySeconds: 16200, // 4.5 hours
    eclipsePercentage: 0,
    description: 'Parabolic/hyperbolic trajectory escaping Earth and solar gravity toward outer planets and interstellar space. Solar power is negligible; RTG required.'
  }
};

export function getOrbitConfig(type: OrbitType): OrbitConfiguration {
  return ORBIT_CONFIGURATIONS[type];
}
