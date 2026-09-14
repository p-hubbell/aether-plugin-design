import { useId } from 'react'

import {
  displayValue,
  fillPercent,
  formatValue,
  paramHitLabelledBy,
  type ParamControlProps,
} from './param.ts'
import { ParamChrome } from './ParamChrome.tsx'
import { useParamInteraction } from './useParamInteraction.ts'

import './controls.css'

export type SliderProps = ParamControlProps

export function Slider({
  value,
  onChange,
  min,
  max,
  step,
  name,
  unit,
  format,
}: SliderProps) {
  const nameId = useId()
  const valueId = useId()
  const { grabbed, onPointerDown, onPointerMove, onPointerUp, onDoubleClick, onKeyDown } =
    useParamInteraction({
      value,
      min,
      max,
      step,
      onChange,
      axis: 'x',
    })

  const shown = displayValue(value, min, max)
  const display = formatValue(value, min, max, format)
  const percent = fillPercent(value, min, max)

  return (
    <div className="aether-param" data-aether="slider">
      <ParamChrome
        name={name}
        unit={unit}
        display={display}
        nameId={nameId}
        valueId={valueId}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-orientation="horizontal"
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuenow={shown}
        aria-valuetext={display}
        aria-labelledby={paramHitLabelledBy(name, nameId, valueId)}
        className="aether-slider-hit"
        data-grabbed={grabbed ? 'true' : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
      >
        <div className="aether-slider-track">
          <div
            data-aether="slider-fill"
            className="aether-slider-fill"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
