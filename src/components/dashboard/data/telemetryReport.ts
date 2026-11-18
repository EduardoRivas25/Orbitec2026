import type { TelemetryData } from './telemetryTypes';
import type { TelemetryDiagnostics } from './serialService';

type Series = { label: string; unit: string; color: string; value: (frame: TelemetryData) => number };

const numeric = (values: number[]) => values.filter(Number.isFinite);
const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const minimum = (values: number[]) => values.reduce((min, value) => value < min ? value : min, Infinity);
const maximum = (values: number[]) => values.reduce((max, value) => value > max ? value : max, -Infinity);
const fixed = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
const htmlEntities: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => htmlEntities[character] || character);

function makeChart(title: string, frames: TelemetryData[], series: Series[]) {
  const width = 720;
  const height = series.length > 1 ? 240 : 205;
  const left = 58;
  const right = 18;
  const top = 22;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const allValues = series.flatMap(item => numeric(frames.map(item.value)));
  let min = Math.min(minimum(allValues), 0);
  let max = Math.max(maximum(allValues), 1);
  if (min === max) { min -= 1; max += 1; }
  const padding = (max - min) * 0.08;
  min -= padding;
  max += padding;
  const xAt = (index: number) => left + (frames.length <= 1 ? plotWidth / 2 : index * plotWidth / (frames.length - 1));
  const yAt = (value: number) => top + (max - value) * plotHeight / (max - min);
  const horizontal = Array.from({ length: 5 }, (_, index) => {
    const value = max - (max - min) * index / 4;
    const y = yAt(value);
    return `<line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}" stroke="#dbe3ec"/><text x="${left - 9}" y="${y + 4}" text-anchor="end" class="axis">${fixed(value, 1)}</text>`;
  }).join('');
  const labels = [0, Math.floor((frames.length - 1) / 2), frames.length - 1]
    .filter((index, position, all) => all.indexOf(index) === position)
    .map(index => `<text x="${xAt(index)}" y="${height - 10}" text-anchor="middle" class="axis">${escapeHtml(frames[index]?.missionTime || '—')}</text>`).join('');
  const paths = series.map(item => {
    const path = frames.map((frame, index) => `${index ? 'L' : 'M'}${xAt(index).toFixed(1)},${yAt(item.value(frame)).toFixed(1)}`).join(' ');
    return `<path d="${path}" fill="none" stroke="${item.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  }).join('');
  const legend = series.map(item => {
    const values = numeric(frames.map(item.value));
    return `<span class="legend-item"><i style="background:${item.color}"></i>${escapeHtml(item.label)} (${escapeHtml(item.unit)}) · mín ${fixed(minimum(values), 2)} · máx ${fixed(maximum(values), 2)} · prom ${fixed(average(values), 2)}</span>`;
  }).join('');
  return `<section class="chart-card"><div class="chart-heading"><h3>${escapeHtml(title)}</h3><div class="legend">${legend}</div></div><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(title)}">${horizontal}${paths}${labels}</svg></section>`;
}

function makeGpsPlot(frames: TelemetryData[]) {
  const points = frames.filter(frame => Number.isFinite(frame.gps.lat) && Number.isFinite(frame.gps.lng) && (frame.gps.lat !== 0 || frame.gps.lng !== 0));
  if (points.length < 2) return '<p class="gps-note">Sin trayectoria GPS suficiente para dibujar el recorrido.</p>';
  const width = 720, height = 230, pad = 24;
  const lats = points.map(point => point.gps.lat), lngs = points.map(point => point.gps.lng);
  const minLat = minimum(lats), maxLat = maximum(lats), minLng = minimum(lngs), maxLng = maximum(lngs);
  const x = (lng: number) => pad + (lng - minLng) / (maxLng - minLng || 1) * (width - pad * 2);
  const y = (lat: number) => height - pad - (lat - minLat) / (maxLat - minLat || 1) * (height - pad * 2);
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(point.gps.lng)},${y(point.gps.lat)}`).join(' ');
  const first = points[0], last = points[points.length - 1];
  const peak = points.reduce((best, point) => point.altitude.bme > best.altitude.bme ? point : best, points[0]);
  return `<svg class="gps-plot" viewBox="0 0 ${width} ${height}" role="img" aria-label="Esquema de trayectoria GPS"><rect width="100%" height="100%" rx="8" fill="#f5f8fa"/><path d="${line}" fill="none" stroke="#b71e2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${x(first.gps.lng)}" cy="${y(first.gps.lat)}" r="6" fill="#27815a"/><circle cx="${x(peak.gps.lng)}" cy="${y(peak.gps.lat)}" r="6" fill="#d28b16"/><circle cx="${x(last.gps.lng)}" cy="${y(last.gps.lat)}" r="6" fill="#b71e2b"/><text x="${pad}" y="18" class="axis">Inicio · verde</text><text x="${width / 2}" y="18" text-anchor="middle" class="axis">Altitud máxima · ámbar</text><text x="${width - pad}" y="18" text-anchor="end" class="axis">Última posición · rojo</text></svg>`;
}

export function createTelemetryReport(frames: TelemetryData[], connected = false, diagnostics?: TelemetryDiagnostics) {
  const captured = frames.filter(frame => frame.raw && Number.isFinite(frame.time));
  const data = captured.length ? captured : frames.filter(frame => frame.packetCount > 0);
  const safeFrames = data.length ? data : frames.slice(-1);
  const temps = numeric(safeFrames.map(frame => frame.environment.temp));
  const pressures = numeric(safeFrames.map(frame => frame.environment.pressure));
  const altitudes = numeric(safeFrames.map(frame => frame.altitude.bme));
  const speeds = numeric(safeFrames.map(frame => frame.verticalSpeed));
  const voltages = numeric(safeFrames.map(frame => frame.voltage));
  const accelerations = numeric(safeFrames.map(frame => frame.acceleration.total));
  const humidity = numeric(safeFrames.map(frame => frame.environment.humidity));
  const voc = numeric(safeFrames.map(frame => frame.environment.voc));
  const peakAltitude = safeFrames.reduce((peak, frame) => frame.altitude.bme > peak.altitude.bme ? frame : peak, safeFrames[0]);
  const gpsFrames = safeFrames.filter(frame => Number.isFinite(frame.gps.lat) && Number.isFinite(frame.gps.lng) && (frame.gps.lat !== 0 || frame.gps.lng !== 0));
  const states = ['WAIT', 'DESC', 'LAND'].map(state => [state, safeFrames.filter(frame => frame.state === state).length] as const);
  const start = safeFrames[0];
  const end = safeFrames[safeFrames.length - 1];
  const duration = Math.max(0, end.time - start.time);
  const packets = safeFrames.length;
  const invalidCount = diagnostics?.invalidFrames;
  const totalCandidateFrames = diagnostics?.totalFrames;
  const integrity = totalCandidateFrames ? packets / totalCandidateFrames * 100 : null;
  const missionId = `${start.teamId || 'SIN-EQUIPO'}-${(start.receivedAt || new Date().toISOString()).slice(0, 10).replace(/-/g, '')}-${String(start.packetCount).padStart(4, '0')}`;
  const reportId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `ORB-${Date.now().toString(36).toUpperCase()}`;
  const acquisitionStart = start.receivedAt ? new Date(start.receivedAt).toLocaleString('es-MX') : 'Sin datos disponibles';
  const acquisitionEnd = end.receivedAt ? new Date(end.receivedAt).toLocaleString('es-MX') : 'Sin datos disponibles';
  const missionStatus = end.state === 'LAND' ? 'Completada' : connected ? 'En curso' : 'Interrumpida';
  const intervals = safeFrames.slice(1).map((frame, index) => frame.time - safeFrames[index].time).filter(interval => interval > 0);
  const avgInterval = average(intervals);
  const gapThreshold = Math.max(3, avgInterval * 2);
  const gaps = safeFrames.slice(1).map((frame, index) => ({ frame, interval: frame.time - safeFrames[index].time })).filter(item => item.interval > gapThreshold);
  const events: Array<{ time: string; name: string; description: string; level: string }> = [];
  events.push({ time: start.missionTime, name: 'Inicio de adquisición', description: `Primera trama válida recibida a las ${acquisitionStart}.`, level: 'Informativo' });
  safeFrames.forEach((frame, index) => {
    if (index > 0 && frame.state !== safeFrames[index - 1].state) events.push({ time: frame.missionTime, name: `Cambio de fase: ${frame.state}`, description: `Estado de vuelo cambió de ${safeFrames[index - 1].state} a ${frame.state}.`, level: 'Informativo' });
  });
  const ascent = safeFrames.find(frame => frame.verticalSpeed > 0);
  const descent = safeFrames.find(frame => frame.state === 'DESC');
  if (ascent) events.push({ time: ascent.missionTime, name: 'Ascenso detectado', description: `Velocidad vertical positiva de ${fixed(ascent.verticalSpeed, 2)} m/s.`, level: 'Informativo' });
  if (descent) events.push({ time: descent.missionTime, name: 'Inicio de descenso', description: 'La telemetría reportó la fase DESC.', level: 'Informativo' });
  events.push({ time: peakAltitude.missionTime, name: 'Máxima altitud', description: `${fixed(peakAltitude.altitude.bme, 1)} m barométricos.`, level: 'Informativo' });
  gaps.forEach(item => events.push({ time: item.frame.missionTime, name: 'Intervalo sin recepción', description: `${fixed(item.interval, 1)} s entre tramas válidas; umbral de detección ${fixed(gapThreshold, 1)} s.`, level: 'Advertencia' }));
  events.push({ time: end.missionTime, name: end.state === 'LAND' ? 'Fin de misión' : 'Última trama válida', description: `Última trama registrada a las ${acquisitionEnd}; estado ${end.state}.`, level: end.state === 'LAND' ? 'Informativo' : 'Advertencia' });
  events.sort((firstEvent, secondEvent) => firstEvent.time.localeCompare(secondEvent.time));
  const card = (label: string, value: string, detail: string) => `<article class="metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></article>`;
  const rows = safeFrames.map(frame => `<tr><td>${escapeHtml(frame.missionTime)}</td><td>${frame.packetCount}</td><td>${escapeHtml(frame.teamId)}</td><td>${frame.gps.lat.toFixed(6)}</td><td>${frame.gps.lng.toFixed(6)}</td><td>${fixed(frame.altitude.bme, 2)}</td><td>${fixed(frame.environment.pressure, 2)}</td><td>${fixed(frame.environment.temp, 2)}</td><td>${fixed(frame.environment.humidity, 2)}</td><td>${fixed(frame.environment.voc, 1)}</td><td>${fixed(frame.verticalSpeed, 2)}</td><td>${fixed(frame.voltage, 2)}</td><td>${fixed(frame.acceleration.x, 3)}, ${fixed(frame.acceleration.y, 3)}, ${fixed(frame.acceleration.z, 3)}</td><td>${fixed(frame.gyroscope.x, 3)}, ${fixed(frame.gyroscope.y, 3)}, ${fixed(frame.gyroscope.z, 3)}</td><td>${fixed(frame.magnetometer.x, 3)}, ${fixed(frame.magnetometer.y, 3)}, ${fixed(frame.magnetometer.z, 3)}</td><td>${frame.state}</td><td class="raw">${escapeHtml(frame.raw)}</td></tr>`).join('');
  const invalidRows = diagnostics?.retainedInvalidFrames.map(frame => `<tr><td>${escapeHtml(frame.receivedAt)}</td><td class="raw">${escapeHtml(frame.raw)}</td><td>Inválida o incompleta</td></tr>`).join('') || '';
  const charts = [
    makeChart('Temperatura', safeFrames, [{ label: 'Temperatura', unit: '°C', color: '#d65320', value: frame => frame.environment.temp }]),
    makeChart('Humedad relativa', safeFrames, [{ label: 'Humedad', unit: '%', color: '#2784b5', value: frame => frame.environment.humidity }]),
    makeChart('Altitud barométrica', safeFrames, [{ label: 'Altitud', unit: 'm', color: '#1d6d9b', value: frame => frame.altitude.bme }]),
    makeChart('Presión atmosférica', safeFrames, [{ label: 'Presión', unit: 'hPa', color: '#25815a', value: frame => frame.environment.pressure }]),
    makeChart('Orientación de vuelo', safeFrames, [
      { label: 'Pitch', unit: '°', color: '#2784b5', value: frame => frame.orientation.pitch },
      { label: 'Roll', unit: '°', color: '#c83b3b', value: frame => frame.orientation.roll },
      { label: 'Yaw', unit: '°', color: '#b58b17', value: frame => frame.orientation.yaw },
    ]),
    makeChart('Velocidad vertical', safeFrames, [{ label: 'Velocidad vertical', unit: 'm/s', color: '#d65320', value: frame => frame.verticalSpeed }]),
    makeChart('Aceleración por eje', safeFrames, [
      { label: 'X', unit: 'g', color: '#2784b5', value: frame => frame.acceleration.x },
      { label: 'Y', unit: 'g', color: '#d65320', value: frame => frame.acceleration.y },
      { label: 'Z', unit: 'g', color: '#25815a', value: frame => frame.acceleration.z },
    ]),
    makeChart('Giroscopio', safeFrames, [
      { label: 'X', unit: '°/s', color: '#2784b5', value: frame => frame.gyroscope.x },
      { label: 'Y', unit: '°/s', color: '#d65320', value: frame => frame.gyroscope.y },
      { label: 'Z', unit: '°/s', color: '#25815a', value: frame => frame.gyroscope.z },
    ]),
    makeChart('Magnetómetro', safeFrames, [
      { label: 'X', unit: 'µT', color: '#2784b5', value: frame => frame.magnetometer.x },
      { label: 'Y', unit: 'µT', color: '#d65320', value: frame => frame.magnetometer.y },
      { label: 'Z', unit: 'µT', color: '#8353a5', value: frame => frame.magnetometer.z },
    ]),
    makeChart('Voltaje de batería', safeFrames, [{ label: 'Voltaje', unit: 'V', color: '#b58b17', value: frame => frame.voltage }]),
    makeChart('Lectura del sensor de gas', safeFrames, [{ label: 'VOC', unit: 'u.', color: '#8353a5', value: frame => frame.environment.voc }]),
  ].join('');
  const generated = new Date().toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' });
  const logo = new URL('/logo_sinfondoCansat2026.webp', window.location.origin).href;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reporte de misión ORBITEC</title><style>
    *{box-sizing:border-box}body{margin:0;color:#17212b;font:13px/1.45 Arial,Helvetica,sans-serif;background:#eef2f6}.report{max-width:900px;margin:24px auto;background:white;padding:42px 48px 64px;box-shadow:0 12px 40px #10203018}.masthead{display:flex;align-items:center;gap:18px;border-bottom:3px solid #b71e2b;padding-bottom:16px}.masthead img{width:76px;height:76px;object-fit:contain}.brand{flex:1}.brand strong{display:block;font-size:20px;letter-spacing:.12em}.brand span{color:#65717d;font-size:11px;letter-spacing:.12em}.report-code{text-align:right;color:#64717c;font-size:10px}.report-code b{display:block;color:#b71e2b;font-size:12px}.title{margin:27px 0 5px;font-size:25px;line-height:1.2}.subtitle{color:#64717c;margin:0 0 21px}.section-title{margin:24px 0 10px;font-size:14px;letter-spacing:.04em;text-transform:uppercase;color:#263744;border-bottom:1px solid #dce3e9;padding-bottom:7px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.metric{border:1px solid #dce3e9;border-radius:8px;padding:12px 14px;min-height:82px}.metric span,.metric small{display:block;color:#64717c;font-size:10px}.metric strong{display:block;color:#17212b;font-size:19px;margin:4px 0}.metric small{font-size:9px}.summary{border-left:3px solid #b71e2b;background:#f7f8fa;padding:12px 15px;margin-top:12px}.summary p{margin:3px 0}.charts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.chart-card{border:1px solid #dce3e9;border-radius:8px;padding:10px;break-inside:avoid}.chart-card h3{font-size:11px;margin:0}.chart-heading{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.legend{display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end}.legend-item{font-size:8px;color:#64717c;white-space:nowrap}.legend-item i{display:inline-block;width:8px;height:3px;vertical-align:middle;margin-right:3px}.chart-card svg{display:block;width:100%;height:auto;margin-top:5px}.axis{font:9px Arial,sans-serif;fill:#74818c}.gps-plot{width:100%;height:auto;max-height:250px}.raw{font:6px/1.25 monospace;overflow-wrap:anywhere;max-width:180px}.event-level{font-weight:bold}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#f0f3f6;color:#344550;text-align:left}td,th{padding:7px 8px;border-bottom:1px solid #e2e7eb}.gps-note{font-size:10px;color:#64717c;margin-top:7px}.footer{position:fixed;bottom:12px;left:48px;right:48px;padding-top:7px;border-top:1px solid #dce3e9;color:#73808b;font-size:9px;display:flex;justify-content:space-between}.actions{max-width:900px;margin:0 auto 18px;display:flex;justify-content:flex-end}.actions button{border:0;border-radius:7px;background:#b71e2b;color:white;padding:11px 18px;font-weight:700;cursor:pointer}@page{size:A4 landscape;margin:12mm 12mm 18mm}@media print{body{background:white;font-size:9px}.report{max-width:none;margin:0;padding:0;box-shadow:none}.actions{display:none}.footer{left:12mm;right:12mm;bottom:5mm}.masthead{padding-bottom:10px}.masthead img{width:58px;height:58px}.title{font-size:22px;margin-top:20px}.metric{min-height:62px;padding:8px 10px}.metric strong{font-size:15px}.section-title{margin-top:14px}.chart-card{padding:6px}.chart-card svg{max-height:125px}.charts{gap:7px}.page-break{break-before:page}.report-table{break-before:page}.data-table{font-size:6px;table-layout:fixed}.data-table th,.data-table td{padding:3px 3px;overflow-wrap:anywhere}.data-table .raw{font-size:5px}.footer:after{content:'ORBITEC · PATSARHI-1'}}
    </style></head><body><div class="actions"><button onclick="window.print()">Imprimir / Guardar como PDF</button></div><main class="report"><header class="masthead"><img src="${logo}" alt="Logo ORBITEC"><div class="brand"><strong>ORBITEC CANSAT TEAM</strong><span>TECNM · INSTITUTO TECNOLÓGICO SUPERIOR DE URUAPAN · PATSARHI-1</span></div><div class="report-code"><b>INFORME DE MISIÓN</b>Generado ${escapeHtml(generated)}<br>ID ${escapeHtml(reportId)}</div></header>
    <h1 class="title">Reporte técnico de misión · PATSARHI-1</h1><p class="subtitle">Misión ${escapeHtml(missionId)} · Equipo ${escapeHtml(start.teamId || 'Sin datos disponibles')} · Estado: <b>${missionStatus}</b></p>
    <h2 class="section-title">Identificación y resumen de misión</h2><div class="metrics">${card('TRAMAS RECIBIDAS', String(totalCandidateFrames ?? packets), 'Candidatas válidas e inválidas detectadas')}${card('TRAMAS VÁLIDAS', String(packets), 'Tramas aceptadas y archivadas')}${card('TRAMAS INVÁLIDAS', diagnostics?.diagnosticsAvailable ? String(invalidCount) : 'No disponible', `${diagnostics?.retainedInvalidFrames.length || 0} originales conservadas`)}${card('INTEGRIDAD DE TRAMAS', integrity === null ? 'No disponible' : `${fixed(integrity, 1)}%`, 'Válidas / total de tramas candidatas')}${card('ESTADO FINAL', missionStatus, `Último estado de vuelo: ${end.state}`)}${card('DURACIÓN REGISTRADA', `${Math.floor(duration / 60)} min ${duration % 60} s`, `${start.missionTime} — ${end.missionTime} MET`)}${card('ALTITUD MÁXIMA', `${fixed(maximum(altitudes), 1)} m`, `Mín. ${fixed(minimum(altitudes), 1)} m · Pico en ${escapeHtml(peakAltitude.missionTime)} MET`)}${card('TEMPERATURA PROMEDIO', `${fixed(average(temps), 1)} °C`, `Mín. ${fixed(minimum(temps), 1)} °C · Máx. ${fixed(maximum(temps), 1)} °C`)}${card('PRESIÓN PROMEDIO', `${fixed(average(pressures), 1)} hPa`, `Mín. ${fixed(minimum(pressures), 1)} · Máx. ${fixed(maximum(pressures), 1)} hPa`)}${card('VELOCIDAD VERTICAL PICO', `${fixed(maximum(speeds), 1)} m/s`, `Mín. ${fixed(minimum(speeds), 1)} m/s · Ascenso / descenso`)}${card('BATERÍA INICIAL / FINAL', `${fixed(start.voltage, 2)} / ${fixed(end.voltage, 2)} V`, `Mín. ${fixed(minimum(voltages), 2)} V · Máx. ${fixed(maximum(voltages), 2)} V`)}${card('ACELERACIÓN PICO', `${fixed(maximum(accelerations), 2)} g`, `Valor máximo total registrado`)}${card('HUMEDAD PROMEDIO', `${fixed(average(humidity), 1)} %`, `Mín. ${fixed(minimum(humidity), 1)} % · Máx. ${fixed(maximum(humidity), 1)} %`)}${card('VOC PROMEDIO', `${fixed(average(voc), 0)} u.`, `Mín. ${fixed(minimum(voc), 0)} · Máx. ${fixed(maximum(voc), 0)} u.`)}</div>
    <div class="summary"><p><b>Institución:</b> TecNM · Instituto Tecnológico Superior de Uruapan · <b>Fecha de adquisición:</b> ${escapeHtml(acquisitionStart)} a ${escapeHtml(acquisitionEnd)}</p><p><b>Distribución de estados:</b> ${states.map(([state, count]) => `${state}: ${count}`).join(" · ")}</p><p><b>Coordenadas iniciales:</b> ${gpsFrames.length ? `${gpsFrames[0].gps.lat.toFixed(6)}, ${gpsFrames[0].gps.lng.toFixed(6)}` : 'Sin datos disponibles'} · <b>Coordenadas finales:</b> ${gpsFrames.length ? `${gpsFrames[gpsFrames.length - 1].gps.lat.toFixed(6)}, ${gpsFrames[gpsFrames.length - 1].gps.lng.toFixed(6)}` : 'Sin datos disponibles'}</p><p><b>Última posición GPS:</b> ${gpsFrames.length ? `${gpsFrames[gpsFrames.length - 1].gps.lat.toFixed(6)}, ${gpsFrames[gpsFrames.length - 1].gps.lng.toFixed(6)}` : 'Sin datos disponibles'} · <b>Punto de altitud máxima:</b> ${peakAltitude.gps.lat.toFixed(6)}, ${peakAltitude.gps.lng.toFixed(6)}</p><p><b>Intervalo medio entre tramas:</b> ${intervals.length ? `${fixed(avgInterval, 2)} s` : 'Sin datos disponibles'} · <b>Intervalos sin recepción detectados:</b> ${gaps.length} · <b>ID del reporte:</b> ${escapeHtml(reportId)}</p></div>
    <h2 class="section-title">Trayectoria GPS registrada</h2>${makeGpsPlot(safeFrames)}
    <h2 class="section-title">Línea de tiempo y eventos</h2><table><thead><tr><th>Tiempo MET</th><th>Evento</th><th>Descripción</th><th>Clasificación</th></tr></thead><tbody>${events.map(event => `<tr><td class="nowrap">${escapeHtml(event.time)}</td><td>${escapeHtml(event.name)}</td><td>${escapeHtml(event.description)}</td><td class="event-level">${event.level}</td></tr>`).join('')}</tbody></table>
    <h2 class="section-title">Gráficas de la misión</h2><div class="charts">${charts}</div>
    <section class="report-table"><h2 class="section-title">Registro completo de tramas válidas (${safeFrames.length})</h2><table class="data-table"><thead><tr><th>MET</th><th># Paq.</th><th>Equipo</th><th>Latitud</th><th>Longitud</th><th>Alt. m</th><th>Pres. hPa</th><th>Temp. °C</th><th>Hum. %</th><th>VOC</th><th>Vel. m/s</th><th>V</th><th>Aceleración X/Y/Z</th><th>Giroscopio X/Y/Z</th><th>Magnetómetro X/Y/Z</th><th>Estado</th><th>Trama original</th></tr></thead><tbody>${rows || '<tr><td colspan="17">Sin datos disponibles.</td></tr>'}</tbody></table><p class="gps-note">Se incluyen todas las tramas válidas conservadas en el archivo local, en orden cronológico.</p></section>
    <section class="report-table"><h2 class="section-title">Tramas incompletas o corruptas (${invalidCount ?? 'Sin datos disponibles'})</h2><p>El receptor detecta tramas CSV candidatas que no pasan la validación estructural. Se conservan hasta ${diagnostics?.retainedInvalidFrames.length || 0} originales en este navegador${invalidCount && invalidCount > (diagnostics?.retainedInvalidFrames.length || 0) ? '; el número total supera el límite local de retención' : ''}.</p><table><thead><tr><th>Recibida</th><th>Contenido original</th><th>Clasificación</th></tr></thead><tbody>${invalidRows || '<tr><td colspan="3">Sin tramas inválidas registradas.</td></tr>'}</tbody></table></section>
    <section><h2 class="section-title">Conclusiones automáticas</h2><p>Se procesaron ${safeFrames.length} muestras válidas${diagnostics?.diagnosticsAvailable ? ` de ${totalCandidateFrames} tramas candidatas (${fixed(integrity || 0, 1)}% de integridad)` : ''}. La misión alcanzó ${fixed(maximum(altitudes), 1)} m de altitud barométrica máxima. La temperatura se mantuvo entre ${fixed(minimum(temps), 1)} °C y ${fixed(maximum(temps), 1)} °C (promedio ${fixed(average(temps), 1)} °C). La batería pasó de ${fixed(start.voltage, 2)} V a ${fixed(end.voltage, 2)} V. ${gaps.length ? `Se detectaron ${gaps.length} intervalos de recepción mayores al umbral calculado.` : 'No se detectaron intervalos prolongados de recepción con los tiempos de misión disponibles.'} El estado final fue ${missionStatus}. Las capturas de pantalla del dashboard, mapa y modelo 3D no se conservan en el sistema y por ello no se adjuntan.</p></section>
    <footer class="footer"><span>ORBITEC · De Uruapan hacia nuevas fronteras</span><span>PATSARHI-1 · Reporte ${escapeHtml(reportId)} · ${escapeHtml(generated)}</span></footer></main><script>window.addEventListener('load',()=>{const logo=document.querySelector('.masthead img');const print=()=>setTimeout(()=>window.print(),350);if(logo.complete)print();else logo.addEventListener('load',print,{once:true});});</script></body></html>`;
}

export function openTelemetryReport(frames: TelemetryData[], connected = false, diagnostics?: TelemetryDiagnostics) {
  const reportWindow = window.open('', '_blank');
  if (!reportWindow) return false;
  reportWindow.document.open();
  reportWindow.document.write(createTelemetryReport(frames, connected, diagnostics));
  reportWindow.document.close();
  return true;
}
