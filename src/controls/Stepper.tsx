import { ParamChrome } from './ParamChrome.tsx'

import './controls.css'

export type StepperProps = {
  options: readonly string[]
  value: string
  onChange?: (next: string) => void
  name?: string
}

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  return (
    <svg
      className="aether-stepper-chevron"
      data-dir={dir}
      viewBox="0 0 12 12"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        d={dir === 'prev' ? 'M8 1.5 L3 6 L8 10.5' : 'M4 1.5 L9 6 L4 10.5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="miter"
      />
    </svg>
  )
}

function stepIndex(options: readonly string[], value: string, delta: number): string | null {
  if (options.length === 0) return null
  const current = options.indexOf(value)
  const start = current < 0 ? 0 : current
  const next = (start + delta + options.length * 8) % options.length
  return options[next] ?? null
}

export function Stepper({ options, value, onChange, name }: StepperProps) {
  const readOnly = onChange == null || options.length === 0
  const display = value === '' || value == null ? '' : value

  function go(delta: number) {
    if (readOnly) return
    const next = stepIndex(options, value, delta)
    if (next != null) onChange(next)
  }

  return (
    <div className="aether-param" data-aether="stepper">
      <ParamChrome name={name} display={display} />
      <div className="aether-stepper-hit" data-aether="stepper-hit">
        <button
          type="button"
          data-aether="stepper-prev"
          className="aether-stepper-btn"
          aria-label={name ? `${name} previous` : 'previous'}
          disabled={readOnly}
          onClick={() => go(-1)}
        >
          <Chevron dir="prev" />
        </button>
        <button
          type="button"
          data-aether="stepper-next"
          className="aether-stepper-btn"
          aria-label={name ? `${name} next` : 'next'}
          disabled={readOnly}
          onClick={() => go(1)}
        >
          <Chevron dir="next" />
        </button>
      </div>
    </div>
  )
}
