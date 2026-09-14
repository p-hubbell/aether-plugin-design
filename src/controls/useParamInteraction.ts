import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'

import {
  displayValue,
  keyDirection,
  normalizeRange,
  valueFromKey,
  valueFromPointerDelta,
  type ParamChange,
} from './param.ts'

type Axis = 'x' | 'y'

function capturePointer(target: HTMLElement, pointerId: number) {
  if (typeof target.setPointerCapture !== 'function') return
  try {
    target.setPointerCapture(pointerId)
  } catch {
    /* jsdom and invalid pointer ids */
  }
}

function releasePointer(target: HTMLElement, pointerId: number) {
  if (typeof target.releasePointerCapture !== 'function') return
  try {
    if (
      typeof target.hasPointerCapture === 'function' &&
      !target.hasPointerCapture(pointerId)
    ) {
      return
    }
    target.releasePointerCapture(pointerId)
  } catch {
    /* jsdom and invalid pointer ids */
  }
}

export function useParamInteraction({
  value,
  min,
  max,
  step,
  onChange,
  axis,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange?: ParamChange
  axis: Axis
}) {
  const dragRef = useRef<{ start: number; value: number } | null>(null)
  const restRef = useRef(displayValue(value, min, max))
  const [grabbed, setGrabbed] = useState(false)

  const emit = useCallback(
    (next: number | null) => {
      if (!onChange || next == null || !Number.isFinite(next)) return
      const range = normalizeRange(min, max)
      const lo = range.min
      const hi = range.span === 0 ? range.min : range.max
      const clamped = next < lo ? lo : next > hi ? hi : next
      if (!Number.isFinite(clamped)) return
      onChange(clamped)
    },
    [max, min, onChange],
  )

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      capturePointer(event.currentTarget, event.pointerId)
      const coord = axis === 'y' ? event.clientY : event.clientX
      dragRef.current = {
        start: coord,
        value: displayValue(value, min, max),
      }
      setGrabbed(true)
    },
    [axis, max, min, value],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const drag = dragRef.current
      if (!drag) return
      const coord = axis === 'y' ? event.clientY : event.clientX
      const pixelDelta = axis === 'y' ? drag.start - coord : coord - drag.start
      emit(
        valueFromPointerDelta(
          drag.value,
          pixelDelta,
          min,
          max,
          step,
          event.shiftKey,
        ),
      )
    },
    [axis, emit, max, min, step],
  )

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    releasePointer(event.currentTarget, event.pointerId)
    dragRef.current = null
    setGrabbed(false)
  }, [])

  const onDoubleClick = useCallback(() => {
    emit(restRef.current)
  }, [emit])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === 'Home') {
        event.preventDefault()
        emit(min)
        return
      }
      if (event.key === 'End') {
        event.preventDefault()
        emit(max)
        return
      }
      const direction = keyDirection(event.key)
      if (direction === 0) return
      emit(valueFromKey(value, direction, min, max, step, event.shiftKey))
    },
    [emit, max, min, step, value],
  )

  return {
    grabbed,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick,
    onKeyDown,
  }
}
