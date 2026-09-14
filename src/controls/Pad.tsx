import { useId, type KeyboardEvent } from 'react'

import { paramHitLabelledBy } from './param.ts'
import { ParamChrome } from './ParamChrome.tsx'

import './controls.css'

export type PadProps = {
  pressed: boolean
  onChange?: (next: boolean) => void
  name?: string
  /** Visible/announced state when pressed. Defaults to "on". */
  onText?: string
  /** Visible/announced state when released. Defaults to "off". */
  offText?: string
  /** Optional legend drawn on the hit (hardware pads are often unmarked). */
  mark?: string
  /** One-of-many. Parent owns exclusive value; this pad does not unlatch itself. */
  choice?: boolean
}

export function Pad({
  pressed,
  onChange,
  name,
  onText = 'on',
  offText = 'off',
  mark,
  choice = false,
}: PadProps) {
  const nameId = useId()
  const valueId = useId()
  const readOnly = onChange == null
  const display = pressed ? onText : offText
  const announced = name != null && name !== '' ? name : (mark ?? '')

  function select() {
    if (readOnly) return
    if (choice) {
      if (!pressed) onChange(true)
      return
    }
    onChange(!pressed)
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (choice) return
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      select()
    }
  }

  return (
    <div className="aether-param" data-aether="pad" data-pressed={pressed ? 'true' : 'false'}>
      {choice ? null : (
        <ParamChrome name={name} display={display} nameId={nameId} valueId={valueId} />
      )}
      <button
        type="button"
        data-aether="pad-hit"
        className="aether-pad-hit"
        role={choice ? 'radio' : undefined}
        aria-pressed={choice ? undefined : pressed}
        aria-checked={choice ? pressed : undefined}
        aria-label={choice ? (announced === '' ? undefined : announced) : undefined}
        aria-labelledby={choice ? undefined : paramHitLabelledBy(name, nameId, valueId)}
        tabIndex={choice ? (readOnly ? -1 : pressed ? 0 : -1) : undefined}
        disabled={readOnly}
        onClick={select}
        onKeyDown={onKeyDown}
      >
        {mark ?? ''}
      </button>
    </div>
  )
}
