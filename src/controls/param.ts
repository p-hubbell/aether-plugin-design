export type ParamChange = (next: number) => void

export function paramHitLabelledBy(
  name: string | undefined,
  nameId: string,
  valueId: string,
  readout = true,
): string {
  if (name != null && name !== '') {
    return readout ? `${nameId} ${valueId}` : nameId
  }
  return readout ? valueId : ''
}

export type ParamControlProps = {
  value: number
  onChange?: ParamChange
  min: number
  max: number
  step: number
  name?: string
  unit?: string
  format?: (n: number) => string
}

const PIXELS_FOR_FULL_RANGE = 280

export function finiteOr(value: number, fallback: number): number {
  return Number.isFinite(value) ? value : fallback
}

export function normalizeRange(
  min: number,
  max: number,
): { min: number; max: number; span: number } {
  const lo = Number.isFinite(min) ? min : 0
  const hi = Number.isFinite(max) ? max : lo
  if (!(hi > lo)) {
    return { min: lo, max: lo, span: 0 }
  }
  return { min: lo, max: hi, span: hi - lo }
}

export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  if (value < min) return min
  if (value > max) return max
  return value
}

export function positiveStep(step: number): number {
  return Number.isFinite(step) && step > 0 ? step : 1
}

export function quantize(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const range = normalizeRange(min, max)
  if (range.span === 0) return range.min
  const grid = positiveStep(step)
  const n = Math.round((value - range.min) / grid)
  const snapped = range.min + n * grid
  const compact = Number.parseFloat(snapped.toPrecision(12))
  return clamp(compact, range.min, range.max)
}

export function displayValue(
  value: number,
  min: number,
  max: number,
): number {
  const range = normalizeRange(min, max)
  if (Number.isFinite(value)) return value
  return Number.isFinite(range.min) ? range.min : 0
}

export function formatValue(
  value: number,
  min: number,
  max: number,
  format?: (n: number) => string,
): string {
  const n = displayValue(value, min, max)
  if (format) {
    const formatted = format(n)
    if (typeof formatted === 'string' && !formatted.includes('NaN')) {
      return formatted
    }
    return Number.isFinite(n) ? String(n) : '0'
  }
  return Number.isFinite(n) ? String(n) : '0'
}

export function valueFromPointerDelta(
  startValue: number,
  pixelDelta: number,
  min: number,
  max: number,
  step: number,
  fine: boolean,
): number | null {
  const range = normalizeRange(min, max)
  if (range.span === 0) return null
  const start = finiteOr(startValue, range.min)
  const scale = fine ? 0.1 : 1
  const raw = start + (pixelDelta / PIXELS_FOR_FULL_RANGE) * range.span * scale
  const grid = fine ? positiveStep(step) / 10 : positiveStep(step)
  const next = quantize(raw, range.min, range.max, grid)
  return Number.isFinite(next) ? next : null
}

export function valueFromKey(
  value: number,
  direction: 1 | -1,
  min: number,
  max: number,
  step: number,
  fine: boolean,
): number | null {
  const range = normalizeRange(min, max)
  const coarse = positiveStep(step)
  const used = fine ? coarse / 10 : coarse
  const base = finiteOr(value, range.min)
  const next = quantize(base + direction * used, range.min, range.max, used)
  return Number.isFinite(next) ? next : null
}

export function keyDirection(key: string): 1 | -1 | 0 {
  if (key === 'ArrowUp' || key === 'ArrowRight') return 1
  if (key === 'ArrowDown' || key === 'ArrowLeft') return -1
  return 0
}

export function knobRotationDeg(value: number, min: number, max: number): number {
  const range = normalizeRange(min, max)
  if (range.span === 0) return -135
  const v = clamp(finiteOr(value, range.min), range.min, range.max)
  const t = (v - range.min) / range.span
  if (!Number.isFinite(t)) return -135
  return -135 + t * 270
}

export function fillPercent(value: number, min: number, max: number): number {
  const range = normalizeRange(min, max)
  if (range.span === 0) return 0
  const v = clamp(finiteOr(value, range.min), range.min, range.max)
  const t = ((v - range.min) / range.span) * 100
  return Number.isFinite(t) ? t : 0
}
