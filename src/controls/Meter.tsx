import { useId } from 'react'

import { finiteOr } from './param.ts'

import './controls.css'

export type MeterProps = {
  /** Peak or RMS in 0–1. Non-finite values read as empty. */
  level: number
  name?: string
}

function clampLevel(level: number): number {
  const n = finiteOr(level, 0)
  if (n <= 0) return 0
  if (n >= 1) return 1
  return n
}

export function Meter({ level, name }: MeterProps) {
  const nameId = useId()
  const shown = clampLevel(level)
  const labelled = name != null && name !== ''

  return (
    <div className="aether-param" data-aether="meter">
      {labelled ? (
        <span id={nameId} className="aether-param-name">
          {name}
        </span>
      ) : null}
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={shown}
        aria-labelledby={labelled ? nameId : undefined}
        aria-label={labelled ? undefined : 'Level'}
        className="aether-meter-hit"
        data-aether="meter-hit"
      >
        <div
          className="aether-meter-fill"
          data-aether="meter-fill"
          style={{ height: `${shown * 100}%` }}
        />
      </div>
    </div>
  )
}
