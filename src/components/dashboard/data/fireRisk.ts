import type { TelemetryData } from './telemetryTypes';

// La trama transmite la lectura cruda del sensor de gas, no una conversión a ppm.
// Estos valores pueden calibrarse cuando se disponga de mediciones de campo.
export const FIRE_GAS_WARNING_VALUE = 20000;
export const FIRE_GAS_CRITICAL_VALUE = 30000;
export const FIRE_GAS_RAPID_RISE_VALUE = 2500;
export const FIRE_GAS_RAPID_RISE_FACTOR = 1.2;

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
    && increase >= FIRE_GAS_RAPID_RISE_VALUE
    && current >= baseline * FIRE_GAS_RAPID_RISE_FACTOR;
  const critical = current >= FIRE_GAS_CRITICAL_VALUE;
  const high = current >= FIRE_GAS_WARNING_VALUE;

  return {
    active: critical || high || rapidRise,
    critical,
    voc: current,
    baseline,
    increase,
    reason: critical ? 'critical' : high ? 'high' : rapidRise ? 'rapid-rise' : 'normal',
  };
}
