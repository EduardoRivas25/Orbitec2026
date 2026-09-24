import type { TelemetryData } from './telemetryTypes';

export const FIRE_VOC_WARNING_PPM = 300;
export const FIRE_VOC_CRITICAL_PPM = 500;
export const FIRE_VOC_RAPID_RISE_PPM = 80;
export const FIRE_VOC_RAPID_RISE_FACTOR = 1.5;

export interface FireRiskAssessment {
  active: boolean;
  critical: boolean;
  voc: number;
  baseline: number | null;
  increase: number;
  reason: 'normal' | 'high' | 'critical' | 'rapid-rise';
}

/**
 * Detecta tanto una concentración absoluta alta como un incremento brusco
 * respecto a las diez tramas válidas anteriores.
 */
export function evaluateForestFireRisk(history: TelemetryData[]): FireRiskAssessment {
  const received = history.filter(frame => frame.raw && Number.isFinite(frame.environment.voc));
  const current = received.at(-1)?.environment.voc ?? 0;
  const previous = received.slice(-11, -1).map(frame => frame.environment.voc);
  const baseline = previous.length
    ? previous.reduce((total, value) => total + value, 0) / previous.length
    : null;
  const increase = baseline === null ? 0 : current - baseline;
  const rapidRise = previous.length >= 3
    && increase >= FIRE_VOC_RAPID_RISE_PPM
    && current >= baseline * FIRE_VOC_RAPID_RISE_FACTOR;
  const critical = current >= FIRE_VOC_CRITICAL_PPM;
  const high = current >= FIRE_VOC_WARNING_PPM;

  return {
    active: critical || high || rapidRise,
    critical,
    voc: current,
    baseline,
    increase,
    reason: critical ? 'critical' : high ? 'high' : rapidRise ? 'rapid-rise' : 'normal',
  };
}
