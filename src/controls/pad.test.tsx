import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { Pad } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Pad latches via click and Space, and stays put without onChange', () => {
  const onChange = vi.fn()
  const { rerender } = render(<Pad name="Bypass" pressed={false} onChange={onChange} />)
  const hit = screen.getByRole('button', { name: /bypass/i })
  expect(hit.getAttribute('aria-label')).toBeNull()
  expect(hit.getAttribute('aria-labelledby')).toBeTruthy()
  expect(hit.getAttribute('aria-pressed')).toBe('false')
  fireEvent.click(hit)
  expect(onChange).toHaveBeenCalledWith(true)

  onChange.mockClear()
  fireEvent.keyDown(hit, { key: ' ' })
  expect(onChange).toHaveBeenCalledWith(true)

  onChange.mockClear()
  rerender(<Pad name="Bypass" pressed={false} />)
  const idle = screen.getByRole('button', { name: /bypass/i })
  fireEvent.click(idle)
  expect(onChange).not.toHaveBeenCalled()
})

test('Pad chrome shows name and on/off without undefined', () => {
  const { container, rerender } = render(<Pad pressed={true} />)
  expect(container.textContent).toMatch(/on/i)
  expect(container.textContent).not.toMatch(/undefined/)
  rerender(<Pad name="" pressed={false} />)
  expect(container.textContent).toMatch(/off/i)
  expect(container.textContent).not.toMatch(/undefined/)
})

test('choice Pad is a radio that does not unlatch itself', () => {
  const onChange = vi.fn()
  const { rerender } = render(
    <Pad choice name="1/8" mark="1/8" pressed={true} onChange={onChange} />,
  )
  const hit = screen.getByRole('radio', { name: '1/8' })
  expect(hit.getAttribute('aria-checked')).toBe('true')
  expect(hit.getAttribute('aria-pressed')).toBeNull()
  fireEvent.click(hit)
  expect(onChange).not.toHaveBeenCalled()

  rerender(<Pad choice name="1/8" mark="1/8" pressed={false} onChange={onChange} />)
  fireEvent.click(screen.getByRole('radio', { name: '1/8' }))
  expect(onChange).toHaveBeenCalledWith(true)
})

test('Pad can name latched states and mark the hit', () => {
  const { container } = render(
    <Pad name="Bypass" pressed={true} onText="out" offText="in" mark="out" />,
  )
  expect(container.textContent).toMatch(/out/i)
  expect(container.textContent).not.toMatch(/\bon\b/i)
  const hit = screen.getByRole('button', { name: /bypass/i })
  expect(hit.textContent).toMatch(/out/i)
})
