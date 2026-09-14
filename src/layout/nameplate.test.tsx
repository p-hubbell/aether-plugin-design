import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { ControlBank, Nameplate } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Nameplate shows model and optional caption', () => {
  const { rerender } = render(<Nameplate model="Aether" caption="filter" />)
  expect(screen.getByText('Aether')).toBeTruthy()
  expect(screen.getByText('filter')).toBeTruthy()
  rerender(<Nameplate model="Aether" />)
  expect(screen.queryByText('filter')).toBeNull()
})

test('ControlBank renders children and optional label', () => {
  const { rerender } = render(
    <ControlBank>
      <span>child-a</span>
    </ControlBank>,
  )
  expect(screen.getByText('child-a')).toBeTruthy()
  rerender(
    <ControlBank label="eq">
      <span>child-a</span>
    </ControlBank>,
  )
  expect(screen.getByText('eq')).toBeTruthy()
})

test('ControlBank exclusive is a radio group', () => {
  const { rerender } = render(
    <ControlBank label="Division" exclusive>
      <button type="button" role="radio" aria-checked="true">
        a
      </button>
      <button type="button" role="radio" aria-checked="false">
        b
      </button>
    </ControlBank>,
  )
  const group = screen.getByRole('radiogroup', { name: /division/i })
  expect(group.getAttribute('aria-disabled')).toBeNull()
  rerender(
    <ControlBank label="Division" exclusive disabled>
      <button type="button" role="radio" aria-checked="true">
        a
      </button>
    </ControlBank>,
  )
  expect(screen.getByRole('radiogroup', { name: /division/i }).getAttribute('aria-disabled')).toBe(
    'true',
  )
})
