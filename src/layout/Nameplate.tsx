import { useId, type KeyboardEvent, type ReactNode } from 'react'

import './nameplate.css'

export type NameplateProps = {
  model: string
  caption?: string
}

export type ControlBankProps = {
  children?: ReactNode
  label?: string
  /** Pads in this bank are one-of-many. Screen readers hear a radio group. */
  exclusive?: boolean
  disabled?: boolean
}

export function Nameplate({ model, caption }: NameplateProps) {
  return (
    <div data-aether="nameplate" className="aether-nameplate">
      <span className="aether-nameplate-model">{model}</span>
      {caption != null && caption !== '' ? (
        <span className="aether-nameplate-caption">{caption}</span>
      ) : null}
    </div>
  )
}

export function ControlBank({
  children,
  label,
  exclusive = false,
  disabled = false,
}: ControlBankProps) {
  const labelId = useId()
  const labelled = label != null && label !== ''

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!exclusive || disabled) return
    const radios = [
      ...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]:not(:disabled)'),
    ]
    if (radios.length === 0) return
    const currentIndex = radios.findIndex(
      (node) => node === event.target || node.contains(event.target as Node),
    )
    const checkedIndex = radios.findIndex((node) => node.getAttribute('aria-checked') === 'true')
    const start = currentIndex >= 0 ? currentIndex : checkedIndex < 0 ? 0 : checkedIndex
    let nextIndex = start
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (start + 1) % radios.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (start - 1 + radios.length) % radios.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = radios.length - 1
    } else {
      return
    }
    event.preventDefault()
    radios[nextIndex]?.focus()
    radios[nextIndex]?.click()
  }

  return (
    <div
      data-aether="bank"
      className="aether-bank"
      role={exclusive ? 'radiogroup' : undefined}
      aria-labelledby={exclusive && labelled ? labelId : undefined}
      aria-disabled={exclusive && disabled ? true : undefined}
      onKeyDown={onKeyDown}
    >
      {labelled ? (
        <span id={exclusive ? labelId : undefined} className="aether-bank-label">
          {label}
        </span>
      ) : null}
      <div className="aether-bank-row">{children}</div>
    </div>
  )
}
