import { 
  SimulationState, 
  SimulationStage, 
  MissionScenario, 
  SpacecraftComponent, 
  LaunchVehicle, 
  OrbitConfiguration, 
  TelemetryPoint,
  DynamicEvent,
  DynamicEventChoice
} from '../../types/game';
import { calculateSpacecraftResources } from '../calculations/resources';
import { getEventForStage } from '../events/eventEngine';

export const STAGES_ORDER: SimulationStage[] = [
  'launch',
  'deployment',
  'cruise',
  'navigation',
  'arrival',
  'science_ops',
  'communication',
  'completed'
];

export function initializeSimulation(
  mission: MissionScenario,
  components: SpacecraftComponent[],
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration
): SimulationState {
  const res = calculateSpacecraftResources(components, launchVehicle, orbit);
  
  // Calculate approximate distance in km
  let distKm = 384400; // default Moon
  if (mission.target === 'Mars') distKm = 225000000;
  else if (mission.target === 'Asteroid') distKm = 14000000;
  else if (mission.target === 'Earth') distKm = 700;
  else if (mission.target === 'Deep Space') distKm = 4500000000;

  return {
    stage: 'launch',
    elapsedSeconds: 0,
    timeScale: 1,
    isPaused: false,
    distanceToTargetKm: distKm,
    currentVelocityKms: 0,
    batteryLevelWh: res.batteryCapacityWh,
    maxBatteryWh: res.batteryCapacityWh,
    propellantRemainingKg: res.propellantMassKg,
    initialPropellantKg: res.propellantMassKg,
    dataStoredGb: 0,
    dataTransmittedGb: 0,
    sciencePoints: 0,
    equipmentHealthPercent: 100,
    hullTempCelsius: res.thermalBalanceTempC,
    signalLatencySeconds: orbit ? orbit.commDelaySeconds : 0.01,
    signalStrength: 98,
    activeEvent: null,
    eventHistory: [],
    telemetryLog: [],
    missionEventsLog: [
      {
        time: 'T-00:00:00',
        message: `Mission initialization nominal. Spacecraft systems online on pad. Launch vehicle verified.`,
        type: 'info'
      }
    ],
    isCompleted: false,
    isAborted: false
  };
}

export function advanceSimulationStep(
  prevState: SimulationState,
  deltaRealSeconds: number,
  mission: MissionScenario,
  components: SpacecraftComponent[],
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration
): SimulationState {
  if (prevState.isPaused || prevState.isCompleted || prevState.isAborted) {
    return prevState;
  }

  // If there is an unresolved active event that requires decision, hold time progression
  if (prevState.activeEvent && !prevState.activeEvent.resolvedChoiceId) {
    return prevState;
  }

  const dt = deltaRealSeconds * prevState.timeScale;
  const res = calculateSpacecraftResources(components, launchVehicle, orbit);
  const nextElapsed = prevState.elapsedSeconds + dt;

  let nextStage = prevState.stage;
  let nextDistance = prevState.distanceToTargetKm;
  let nextVelocity = prevState.currentVelocityKms;
  let nextBattery = prevState.batteryLevelWh;
  let nextPropellant = prevState.propellantRemainingKg;
  let nextStored = prevState.dataStoredGb;
  let nextTransmitted = prevState.dataTransmittedGb;
  let nextScience = prevState.sciencePoints;
  let nextHealth = prevState.equipmentHealthPercent;
  let nextTemp = prevState.hullTempCelsius;
  let nextSignalStrength = prevState.signalStrength;
  const eventsLog = [...prevState.missionEventsLog];
  let newEvent: DynamicEvent | null = prevState.activeEvent;

  // STAGE PROGRESSION LOGIC (Duration calibrated for compelling real-time & accelerated gameplay)
  // Each stage lasts around 20-40 simulation time units
  const stageDuration = 30; // nominal seconds per stage in game units

  // Stage 1: Launch
  if (nextStage === 'launch') {
    nextVelocity = Math.min(7.8, nextVelocity + (dt * 0.4));
    if (nextElapsed >= stageDuration) {
      nextStage = 'deployment';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Main Engine Cut-Off (MECO). Spacecraft separation from booster confirmed.',
        type: 'success'
      });
    }
  } 
  // Stage 2: Deployment
  else if (nextStage === 'deployment') {
    nextVelocity = 7.7;
    if (nextElapsed >= stageDuration * 2) {
      nextStage = 'cruise';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Solar arrays deployed and locked to Sun. Antennas deployed. Entering interplanetary cruise.',
        type: 'success'
      });
    }
  } 
  // Stage 3: Cruise
  else if (nextStage === 'cruise') {
    nextVelocity = 11.2;
    // Distance decreases
    const distStep = (prevState.distanceToTargetKm * 0.45) * (dt / stageDuration);
    nextDistance = Math.max(1000, nextDistance - distStep);

    // Power generation & consumption
    const powerDelta = (res.netPowerW * (dt / 3600)); // Wh
    nextBattery = Math.min(prevState.maxBatteryWh, Math.max(0, nextBattery + powerDelta));

    // Check for trigger of a dynamic event if none triggered yet
    if (!newEvent && prevState.eventHistory.length === 0 && nextElapsed >= stageDuration * 2.5) {
      newEvent = getEventForStage('cruise');
      if (newEvent) {
        eventsLog.unshift({
          time: formatMissionTime(nextElapsed),
          message: `ALERT: Dynamic space condition encountered: ${newEvent.title}`,
          type: 'alert'
        });
      }
    }

    if (nextElapsed >= stageDuration * 3.5) {
      nextStage = 'navigation';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Target approach boundary reached. Pre-insertion navigation check commenced.',
        type: 'info'
      });
    }
  } 
  // Stage 4: Navigation
  else if (nextStage === 'navigation') {
    // TCM Burn consumes propellant
    const fuelBurn = Math.min(nextPropellant, (dt * 0.5));
    nextPropellant = Math.max(0, nextPropellant - fuelBurn);

    if (!newEvent && prevState.eventHistory.length <= 1 && nextElapsed >= stageDuration * 4.0) {
      newEvent = getEventForStage('navigation');
      if (newEvent) {
        eventsLog.unshift({
          time: formatMissionTime(nextElapsed),
          message: `ADCS Telemetry anomaly: ${newEvent.title}`,
          type: 'warning'
        });
      }
    }

    if (nextElapsed >= stageDuration * 4.8) {
      nextStage = 'arrival';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Trajectory insertion burn completed. Celestial gravity capture verified.',
        type: 'success'
      });
    }
  } 
  // Stage 5: Arrival
  else if (nextStage === 'arrival') {
    nextDistance = Math.max(50, nextDistance * 0.85);
    nextVelocity = 4.2;

    if (nextElapsed >= stageDuration * 6.0) {
      nextStage = 'science_ops';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Stable science orbit achieved. Unlocking scientific instrumentation and detectors.',
        type: 'success'
      });
    }
  } 
  // Stage 6: Scientific Operations
  else if (nextStage === 'science_ops') {
    // Generate scientific data and points
    const dataGenerated = (res.dataGenMbps * dt * 0.125) / 1000; // GB
    const freeBuffer = Math.max(0, res.storageCapacityGb - nextStored);
    const storeAmount = Math.min(freeBuffer, dataGenerated);
    nextStored += storeAmount;
    nextScience += Math.round(storeAmount * 4.2);

    // Power draw during high instrument ops
    const sciencePowerDraw = (res.powerDrawW * 1.2 - res.powerGenW) * (dt / 3600);
    nextBattery = Math.min(prevState.maxBatteryWh, Math.max(0, nextBattery - sciencePowerDraw));

    if (!newEvent && prevState.eventHistory.length <= 2 && nextElapsed >= stageDuration * 6.8) {
      newEvent = getEventForStage('science_ops');
      if (newEvent) {
        eventsLog.unshift({
          time: formatMissionTime(nextElapsed),
          message: `Instrument warning: ${newEvent.title}`,
          type: 'warning'
        });
      }
    }

    if (nextElapsed >= stageDuration * 7.5) {
      nextStage = 'communication';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Ground station acquisition of signal (AOS). Commencing Deep Space Network telemetry downlink.',
        type: 'info'
      });
    }
  } 
  // Stage 7: Communication Downlink
  else if (nextStage === 'communication') {
    // Downlink stored science data to Earth
    const downlinkSpeedGB = (res.downlinkRateMbps * dt * 0.125) / 1000;
    const transmittedNow = Math.min(nextStored, downlinkSpeedGB);
    nextStored = Math.max(0, nextStored - transmittedNow);
    nextTransmitted += transmittedNow;
    nextScience += Math.round(transmittedNow * 2.5);

    if (nextElapsed >= stageDuration * 8.8 || nextStored <= 0.1) {
      nextStage = 'completed';
      eventsLog.unshift({
        time: formatMissionTime(nextElapsed),
        message: 'Primary and secondary mission scientific passes completed. Telemetry downlink verified.',
        type: 'success'
      });
    }
  }

  // Battery critical brownout check
  if (nextBattery <= 0 && nextStage !== 'completed') {
    nextHealth = Math.max(0, nextHealth - (dt * 1.5));
    if (nextHealth <= 10) {
      return {
        ...prevState,
        isCompleted: true,
        isAborted: true,
        failureReason: 'Critical Electrical Failure: Battery depleted and solar generation insufficient to prevent bus freezing.'
      };
    }
  }

  // Append Telemetry record
  const telemetryPoint: TelemetryPoint = {
    timeSeconds: Math.round(nextElapsed),
    stage: nextStage,
    distanceKm: Math.round(nextDistance),
    velocityKms: Math.round(nextVelocity * 10) / 10,
    batteryPercent: Math.round((nextBattery / Math.max(1, prevState.maxBatteryWh)) * 100),
    solarPowerW: Math.round(res.powerGenW),
    powerDrawW: Math.round(res.powerDrawW),
    propellantKg: Math.round(nextPropellant * 10) / 10,
    dataStoredGb: Math.round(nextStored * 10) / 10,
    dataTransmittedGb: Math.round(nextTransmitted * 10) / 10,
    hullTempCelsius: nextTemp,
    signalStrengthPercent: Math.round(nextSignalStrength),
    sciencePointsCollected: nextScience
  };

  const newLog = [...prevState.telemetryLog, telemetryPoint];
  // Keep last 150 points for charts
  if (newLog.length > 150) newLog.shift();

  return {
    ...prevState,
    stage: nextStage,
    elapsedSeconds: nextElapsed,
    distanceToTargetKm: nextDistance,
    currentVelocityKms: nextVelocity,
    batteryLevelWh: nextBattery,
    propellantRemainingKg: nextPropellant,
    dataStoredGb: nextStored,
    dataTransmittedGb: nextTransmitted,
    sciencePoints: nextScience,
    equipmentHealthPercent: Math.max(0, Math.min(100, Math.round(nextHealth))),
    hullTempCelsius: nextTemp,
    signalStrength: nextSignalStrength,
    activeEvent: newEvent,
    telemetryLog: newLog,
    missionEventsLog: eventsLog.slice(0, 50),
    isCompleted: nextStage === 'completed'
  };
}

export function resolveSimulationEvent(
  prevState: SimulationState,
  choice: DynamicEventChoice
): SimulationState {
  if (!prevState.activeEvent) return prevState;

  const event = prevState.activeEvent;
  const impact = choice.resourceImpact;

  const nextPropellant = Math.max(0, prevState.propellantRemainingKg + (impact.propellantDeltaKg || 0));
  const nextBattery = Math.max(0, Math.min(prevState.maxBatteryWh, prevState.batteryLevelWh + (impact.batteryDeltaWh || 0)));
  const nextHealth = Math.max(0, Math.min(100, prevState.equipmentHealthPercent - (impact.damageDelta || 0)));
  const nextScience = Math.max(0, prevState.sciencePoints + (impact.sciencePointsDelta || 0));

  const resolvedEvent = { ...event, resolvedChoiceId: choice.id };
  const historyItem = {
    event: resolvedEvent,
    chosen: choice,
    time: prevState.elapsedSeconds
  };

  const eventsLog = [
    {
      time: formatMissionTime(prevState.elapsedSeconds),
      message: `DECISION EXECUTED: ${choice.label} -> ${choice.explanation}`,
      type: 'info' as const
    },
    ...prevState.missionEventsLog
  ];

  return {
    ...prevState,
    propellantRemainingKg: nextPropellant,
    batteryLevelWh: nextBattery,
    equipmentHealthPercent: nextHealth,
    sciencePoints: nextScience,
    activeEvent: null, // Clear active event to unblock simulation
    eventHistory: [...prevState.eventHistory, historyItem],
    missionEventsLog: eventsLog
  };
}

export function formatMissionTime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `MET ${d}d ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
