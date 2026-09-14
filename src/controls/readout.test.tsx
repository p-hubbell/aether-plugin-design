import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { Readout } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Readout is param chrome without a hit', () => {
  const { container } = render(<Readout name="Time" value="1/8" />)
  expect(screen.getByText('Time')).toBeTruthy()
  expect(screen.getByText('1/8')).toBeTruthy()
  expect(container.querySelector('[data-aether="readout"]')).toBeTruthy()
  expect(container.querySelector('[data-aether="knob"]')).toBeNull()
  expect(screen.queryByRole('slider')).toBeNull()
})
