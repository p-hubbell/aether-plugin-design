import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { Stepper } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Stepper cycles options and wraps', () => {
  const onChange = vi.fn()
  render(<Stepper name="Type" options={['lp', 'bp', 'hp']} value="lp" onChange={onChange} />)
  fireEvent.click(screen.getByRole('button', { name: /type next/i }))
  expect(onChange).toHaveBeenCalledWith('bp')

  onChange.mockClear()
  fireEvent.click(screen.getByRole('button', { name: /type previous/i }))
  expect(onChange).toHaveBeenCalledWith('hp')
})

test('Stepper is inert without onChange or options', () => {
  const onChange = vi.fn()
  const { rerender } = render(<Stepper name="Type" options={['lp']} value="lp" />)
  fireEvent.click(screen.getByRole('button', { name: /type next/i }))
  expect(onChange).not.toHaveBeenCalled()

  rerender(<Stepper name="Type" options={[]} value="" onChange={onChange} />)
  fireEvent.click(screen.getByRole('button', { name: /type next/i }))
  expect(onChange).not.toHaveBeenCalled()
})

test('Stepper chrome does not print undefined', () => {
  const { container } = render(<Stepper options={['lp']} value="lp" />)
  expect(container.textContent).toMatch(/lp/)
  expect(container.textContent).not.toMatch(/undefined/)
})

test('Stepper chevrons are currentColor strokes in the 44px hit', () => {
  const { container } = render(
    <Stepper name="Type" options={['lp', 'bp']} value="lp" onChange={() => {}} />,
  )
  const prev = container.querySelector('[data-aether="stepper-prev"] svg') as SVGElement
  expect(prev.getAttribute('width')).toBe('16')
  expect(prev.querySelector('path')?.getAttribute('stroke')).toBe('currentColor')
})
