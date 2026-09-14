import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { Meter } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Meter exposes a named 0–1 level and clamps non-finite to empty', () => {
  const { rerender } = render(<Meter name="In" level={0.4} />)
  const hit = screen.getByRole('meter', { name: /in/i })
  expect(hit.getAttribute('aria-valuemin')).toBe('0')
  expect(hit.getAttribute('aria-valuemax')).toBe('1')
  expect(hit.getAttribute('aria-valuenow')).toBe('0.4')
  expect(hit.getAttribute('aria-label')).toBeNull()
  expect(hit.getAttribute('aria-labelledby')).toBeTruthy()

  rerender(<Meter name="In" level={2} />)
  expect(screen.getByRole('meter', { name: /in/i }).getAttribute('aria-valuenow')).toBe('1')

  rerender(<Meter name="In" level={Number.NaN} />)
  expect(screen.getByRole('meter', { name: /in/i }).getAttribute('aria-valuenow')).toBe('0')
})

test('unnamed Meter is still a meter role', () => {
  render(<Meter level={0} />)
  expect(screen.getByRole('meter', { name: /level/i })).toBeTruthy()
})
