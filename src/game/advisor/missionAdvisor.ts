import { 
  SpacecraftComponent, 
  MissionScenario, 
  LaunchVehicle, 
  OrbitConfiguration, 
  ValidationResult 
} from '../../types/game';
import { calculateSpacecraftResources } from '../calculations/resources';

export interface AdvisorRecommendation {
  type: 'urgent' | 'optimization' | 'insight';
  title: string;
  subsystem: string;
  message: string;
  suggestedAction?: string;
}

export function generateAdvisorAnalysis(
  components: SpacecraftComponent[],
  mission: MissionScenario,
  validation: ValidationResult,
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration
): AdvisorRecommendation[] {
  const recommendations: AdvisorRecommendation[] = [];
  const res = calculateSpacecraftResources(components, launchVehicle, orbit);

  // 1. Critical Validation Issues
  for (const issue of validation.issues) {
    if (issue.status === 'CRITICAL') {
      recommendations.push({
        type: 'urgent',
        title: issue.title,
        subsystem: issue.subsystem.toUpperCase(),
        message: `${issue.explanation} ${issue.consequence}`,
        suggestedAction: issue.recommendedAction
      });
    }
  }

  // 2. Power Balance Analysis
  if (res.netPowerW < 50 && res.netPowerW >= 0) {
    recommendations.push({
      type: 'optimization',
      title: 'Power Margin Squeeze',
      subsystem: 'ELECTRICAL',
      message: `Your spacecraft generates ${res.powerGenW}W and consumes ${res.powerDrawW}W, leaving only ${res.netPowerW}W for battery recharge. In solar eclipse or degradation phases, this could cause brownouts.`,
      suggestedAction: 'Add a secondary SolWing-I or upgrade to SolWing-II dual arrays.'
    });
  }

  // 3. Mass vs Launch Vehicle Efficiency
  if (launchVehicle) {
    let capacity = launchVehicle.payloadCapacityLeo;
    if (orbit?.id === 'lunar_polar' || orbit?.id === 'geo') capacity = launchVehicle.payloadCapacityGto;
    else if (orbit?.id === 'mars_transfer' || orbit?.id === 'heliocentric') capacity = launchVehicle.payloadCapacityEscape;

    const utilization = Math.round((res.totalMassKg / Math.max(1, capacity)) * 100);
    if (utilization < 40) {
      recommendations.push({
        type: 'optimization',
        title: 'Launch Vehicle Overcapacity',
        subsystem: 'BOOSTER',
        message: `Your spacecraft is utilizing only ${utilization}% of the ${launchVehicle.name}'s payload capacity (${res.totalMassKg} kg of ${capacity} kg). You are paying $${(launchVehicle.cost / 1000).toFixed(1)}M for excess rocket power.`,
        suggestedAction: 'Consider switching to a lighter launcher like AeroFalcon-9 or Vanguard-II to save mission budget.'
      });
    }
  }

  // 4. Science Instrumentation Guidance
  const hasCamera = components.some(c => c.meshType === 'camera_highres');
  const hasSpectrometer = components.some(c => c.meshType === 'spectrometer');
  const hasRadar = components.some(c => c.meshType === 'radar_sar');

  if (!hasCamera && mission.target !== 'Deep Space') {
    recommendations.push({
      type: 'insight',
      title: 'Missing Optical Imaging Payload',
      subsystem: 'SCIENCE',
      message: 'Visual framing cameras produce high public outreach impact and essential geological terrain mapping for target observation.',
      suggestedAction: 'Mount SpectraCam High-Resolution Framing Camera.'
    });
  }

  if (res.dataGenMbps > 40 && res.storageCapacityGb < 256) {
    recommendations.push({
      type: 'optimization',
      title: 'Data Ingestion Bottleneck',
      subsystem: 'STORAGE',
      message: `Active instruments generate ${res.dataGenMbps} Mbps, but storage buffer is only ${res.storageCapacityGb} GB. High-data collection passes will fill the buffer in under 14 hours.`,
      suggestedAction: 'Upgrade to the TeraVault 1TB Solid State Recorder.'
    });
  }

  // 5. Thermal Dissipation
  if (res.thermalBalanceTempC > 45 && res.thermalBalanceTempC <= 65) {
    recommendations.push({
      type: 'optimization',
      title: 'Warm Electronics Thermal Envelope',
      subsystem: 'THERMAL',
      message: `Equilibrium temperature is approaching upper limits at ${res.thermalBalanceTempC}°C. Radiator capacity is barely keeping pace with internal dissipated electronics heat.`,
      suggestedAction: 'Add an Al-Loop Heat Pipe Radiator Fin or MLI thermal blanket.'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'insight',
      title: 'Architecture Verified Nominal',
      subsystem: 'SYSTEMS',
      message: 'Subsystem integration parameters, delta-V budgets, electrical margins, and scientific suites are well-balanced for the selected flight profile.',
      suggestedAction: 'Proceed to Mission Configuration and flight validation.'
    });
  }

  return recommendations;
}

export function answerAdvisorQuery(
  query: string,
  components: SpacecraftComponent[],
  mission: MissionScenario,
  validation: ValidationResult,
  launchVehicle?: LaunchVehicle,
  orbit?: OrbitConfiguration
): string {
  const q = query.toLowerCase();
  const res = calculateSpacecraftResources(components, launchVehicle, orbit);

  if (q.includes('power') || q.includes('battery') || q.includes('solar') || q.includes('electricity')) {
    return `Electrical Subsystem Telemetry:
- Generation: ${res.powerGenW} W (Solar flux factor: ${orbit?.solarFluxMultiplier ?? 1.0}x)
- Active Consumption: ${res.powerDrawW} W
- Net Margin: ${res.netPowerW >= 0 ? '+' : ''}${res.netPowerW} W
- Battery Capacity: ${res.batteryCapacityWh} Wh (${res.batteryReserveMinutes} min shadow reserve)
${res.netPowerW < 0 
  ? 'CRITICAL ADVICE: Power deficit will freeze bus electronics. Add SolWing-II solar arrays or an RTG unit immediately.' 
  : 'Electrical generation exceeds baseline draw. Ensure batteries are sized for maximum eclipse shadow duration.'}`;
  }

  if (q.includes('mass') || q.includes('weight') || q.includes('heavy') || q.includes('limit')) {
    return `Mass Budget Breakdown:
- Dry Mass: ${res.dryMassKg} kg
- Propellant Mass: ${res.propellantMassKg} kg
- Total Spacecraft Launch Mass: ${res.totalMassKg} kg
- Scenario Limit: ${mission.massLimit} kg (Margin: ${mission.massLimit - res.totalMassKg} kg)
${res.totalMassKg > mission.massLimit 
  ? 'MASS EXCEEDED: You must reduce payload weight or swap the chassis to a lighter composite bus.' 
  : 'Spacecraft mass is compliant with scenario launch vehicle constraints.'}`;
  }

  if (q.includes('fuel') || q.includes('delta-v') || q.includes('propulsion') || q.includes('engine') || q.includes('thrust')) {
    return `Propulsion & Delta-V Telemetry:
- Propellant Mass: ${res.propellantMassKg} kg
- Delivered Delta-V: ${res.totalDeltaVMs} m/s (Calculated via Tsiolkovsky equation)
- Mission Requirement: ${mission.minDeltaV} m/s
- Delta-V Margin: ${res.totalDeltaVMs - mission.minDeltaV} m/s
${res.totalDeltaVMs < mission.minDeltaV 
  ? 'PROPULSION DEFICIT: Spacecraft will miss celestial orbit insertion. Equip a HyperGOL bipropellant or Xenon Ion engine.' 
  : 'Delta-V is sufficient to cover orbital insertion and mid-course correction maneuvers.'}`;
  }

  if (q.includes('budget') || q.includes('cost') || q.includes('money') || q.includes('price')) {
    return `Fiscal Budget Analysis:
- Spacecraft Hardware: $${(res.spacecraftCost / 1000).toFixed(2)}M
- Launch Services: $${(res.launchCost / 1000).toFixed(2)}M
- Total Project Cost: $${(res.totalCost / 1000).toFixed(2)}M
- Mission Appropriation: $${(mission.budget / 1000).toFixed(2)}M
- Remaining Margin: $${((mission.budget - res.totalCost) / 1000).toFixed(2)}M`;
  }

  if (q.includes('fail') || q.includes('warning') || q.includes('error') || q.includes('issue')) {
    if (validation.issues.length === 0) {
      return 'All engineering validation checks have PASSED. Zero critical errors or flight cautions detected.';
    }
    return `Diagnostic Report (${validation.issues.length} detected):
${validation.issues.map(i => `[${i.status}] ${i.title}: ${i.explanation} Fix: ${i.recommendedAction}`).join('\n\n')}`;
  }

  // Default aerospace explanation
  return `Spacecraft Engineering Assessment:
Spacecraft '${mission.name}' is currently configured with ${components.length} components. 
Mass: ${res.totalMassKg} kg / ${mission.massLimit} kg | Power: ${res.powerGenW}W gen vs ${res.powerDrawW}W load | Delta-V: ${res.totalDeltaVMs} m/s.
Status: ${validation.overallStatus}. ${validation.canLaunch ? 'Flight certification granted.' : 'Critical deficiencies require resolution before countdown.'}`;
}
