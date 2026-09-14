import { useId } from 'react'

import {
  displayValue,
  formatValue,
  knobRotationDeg,
  paramHitLabelledBy,
  type ParamControlProps,
} from './param.ts'
import { ParamChrome } from './ParamChrome.tsx'
import { useParamInteraction } from './useParamInteraction.ts'

import './controls.css'

export type KnobSize = 'knob' | 'dial' | 'hero'

export type KnobProps = ParamControlProps & {
  size?: KnobSize
  /** When false, the numeric chrome is omitted; the hit still exposes aria-valuetext. */
  readout?: boolean
  minLabel?: string
  maxLabel?: string
}

export function Knob({
  value,
  onChange,
  min,
  max,
  step,
  name,
  unit,
  format,
  size = 'knob',
  readout = true,
  minLabel,
  maxLabel,
}: KnobProps) {
  const nameId = useId()
  const valueId = useId()
  const readOnly = onChange == null
  const { grabbed, onPointerDown, onPointerMove, onPointerUp, onDoubleClick, onKeyDown } =
    useParamInteraction({
      value,
      min,
      max,
      step,
      onChange,
      axis: 'y',
    })

  const shown = displayValue(value, min, max)
  const display = formatValue(value, min, max, format)
  const rotation = knobRotationDeg(value, min, max)
  const labelledBy = paramHitLabelledBy(name, nameId, valueId, readout)

  return (
    <div
      className="aether-param"
      data-aether="knob"
      data-size={size}
      data-readonly={readOnly ? 'true' : undefined}
      data-readout={readout ? undefined : 'false'}
    >
      <ParamChrome
        name={name}
        unit={unit}
        display={display}
        nameId={nameId}
        valueId={valueId}
        readout={readout}
      />
      <div className="aether-knob-row">
        {minLabel != null && minLabel !== '' ? (
          <span className="aether-knob-end" data-aether="knob-end">
            {minLabel}
          </span>
        ) : null}
        <div
          role="slider"
          tabIndex={readOnly ? -1 : 0}
          aria-disabled={readOnly || undefined}
          aria-orientation="vertical"
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuenow={shown}
          aria-valuetext={display}
          aria-labelledby={labelledBy || undefined}
          aria-label={labelledBy ? undefined : name || 'Knob'}
          className="aether-knob-hit"
          data-grabbed={grabbed ? 'true' : undefined}
          onPointerDown={readOnly ? undefined : onPointerDown}
          onPointerMove={readOnly ? undefined : onPointerMove}
          onPointerUp={readOnly ? undefined : onPointerUp}
          onPointerCancel={readOnly ? undefined : onPointerUp}
          onDoubleClick={readOnly ? undefined : onDoubleClick}
          onKeyDown={readOnly ? undefined : onKeyDown}
        >
          <div
            data-aether="knob-rotor"
            className="aether-knob-rotor"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
        {maxLabel != null && maxLabel !== '' ? (
          <span className="aether-knob-end" data-aether="knob-end">
            {maxLabel}
          </span>
        ) : null}
      </div>
    </div>
  )
}
