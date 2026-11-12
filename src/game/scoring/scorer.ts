import { 
  MissionScenario, 
  SimulationState, 
  SpacecraftComponent, 
  LaunchVehicle, 
  OrbitConfiguration, 
  MissionScoreBreakdown 
} from '../../types/game';
import { calculateSpacecraftResources } from '../calculations/resources';

export function calculateMissionScore(
  mission: MissionScenario,
  simulationState: SimulationState,
  components: SpacecraftComponent[],
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration,
  isMultiplayer: boolean = false
): MissionScoreBreakdown {
  const res = calculateSpacecraftResources(components, launchVehicle, orbit);
  const achievements: string[] = [];

  // 1. Mission Success (0 - 2500 pts)
  let missionSuccessScore = 0;
  if (!simulationState.isAborted && simulationState.isCompleted) {
    missionSuccessScore = 2500;
    achievements.push('Mission Accomplished');
  } else if (!simulationState.isAborted && simulationState.stage === 'science_ops') {
    missionSuccessScore = 1800;
  } else if (!simulationState.isAborted) {
    missionSuccessScore = 800;
  }

  // 2. Scientific Value (0 - 2500 pts)
  const targetScience = mission.successConditions.minSciencePoints;
  const scienceRatio = Math.min(1.5, simulationState.sciencePoints / Math.max(1, targetScience));
  const scientificValueScore = Math.round(Math.min(2500, scienceRatio * 2000 + (simulationState.dataTransmittedGb * 5)));
  if (scienceRatio >= 1.2) {
    achievements.push('Scientific Breakthrough');
  }

  // 3. Budget Efficiency (0 - 1500 pts)
  // Higher points if under budget without failing
  const costRatio = Math.max(0, (mission.budget - res.totalCost) / mission.budget);
  const budgetEfficiencyScore = Math.round(Math.min(1500, Math.max(200, costRatio * 1500)));
  if (costRatio > 0.25) {
    achievements.push('Cost Optimizer');
  }

  // 4. Mass Efficiency (0 - 1000 pts)
  const massRatio = Math.max(0, (mission.massLimit - res.totalMassKg) / mission.massLimit);
  const massEfficiencyScore = Math.round(Math.min(1000, Math.max(150, massRatio * 1000)));

  // 5. Power Efficiency (0 - 1000 pts)
  const powerMargin = Math.max(0, res.netPowerW);
  const powerEfficiencyScore = Math.round(Math.min(1000, 500 + Math.min(500, powerMargin * 1.5)));

  // 6. Communication Performance (0 - 1000 pts)
  const dataTransmittedRatio = Math.min(1.0, simulationState.dataTransmittedGb / Math.max(1, (simulationState.dataTransmittedGb + simulationState.dataStoredGb)));
  const commPerformanceScore = Math.round(dataTransmittedRatio * 1000);

  // 7. Reliability & Equipment Preservation (0 - 500 pts)
  const healthRatio = simulationState.equipmentHealthPercent / 100;
  const reliabilitySafetyScore = Math.round(healthRatio * 500);
  if (simulationState.equipmentHealthPercent >= 95) {
    achievements.push('Pristine Engineering');
  }

  if (simulationState.eventHistory.length >= 2) {
    achievements.push('Crisis Navigator');
  }

  if (isMultiplayer) {
    achievements.push('Crew Synergy');
  }

  const totalScore = Math.min(10000, Math.round(
    missionSuccessScore +
    scientificValueScore +
    budgetEfficiencyScore +
    massEfficiencyScore +
    powerEfficiencyScore +
    commPerformanceScore +
    reliabilitySafetyScore
  ));

  let grade: MissionScoreBreakdown['grade'] = 'F';
  if (totalScore >= 9000) grade = 'S';
  else if (totalScore >= 7800) grade = 'A';
  else if (totalScore >= 6400) grade = 'B';
  else if (totalScore >= 5000) grade = 'C';
  else if (totalScore >= 3500) grade = 'D';

  return {
    missionSuccessScore,
    scientificValueScore,
    budgetEfficiencyScore,
    massEfficiencyScore,
    powerEfficiencyScore,
    commPerformanceScore,
    reliabilitySafetyScore,
    totalScore,
    grade,
    achievementsUnlocked: achievements
  };
}
