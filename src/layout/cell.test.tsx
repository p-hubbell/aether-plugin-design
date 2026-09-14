import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { Cell } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Cell maps area to a named grid region', () => {
  const { container } = render(
    <Cell area="head">
      <span>slot</span>
    </Cell>,
  )
  const cell = container.querySelector('[data-aether="cell"]') as HTMLElement
  expect(cell.style.gridArea).toBe('head')
  expect(cell.getAttribute('data-area')).toBe('head')
})
