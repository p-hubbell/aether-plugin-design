import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { Rail } from '../index.ts'

afterEach(() => {
  cleanup()
})

test('Rail is a kit column, not a catalog class', () => {
  const { container } = render(
    <Rail>
      <span>clock</span>
      <span>mix</span>
    </Rail>,
  )
  const rail = container.querySelector('[data-aether="rail"]') as HTMLElement
  expect(rail.className).toMatch(/aether-rail/)
  expect(rail.textContent).toMatch(/clock/)
  expect(rail.textContent).toMatch(/mix/)
})
