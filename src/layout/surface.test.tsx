import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { Surface, parseAreaTracks } from '../index.ts'

function layoutSource(name: string): string {
  const dir = dirname(fileURLToPath(import.meta.url))
  return readFileSync(join(dir, name), 'utf8')
}

afterEach(() => {
  cleanup()
})

test('layout modules stay decoupled from catalog and knob/slider', () => {
  const surface = layoutSource('Surface.tsx')
  expect(surface).not.toMatch(/catalog\//)
  expect(surface).not.toMatch(/controls\/Knob/)
  expect(surface).not.toMatch(/controls\/Slider/)
  expect(surface).not.toMatch(/vanDeGraaf/)
  expect(surface).not.toMatch(/canonFrame/)
  expect(surface).not.toMatch(/Overlay/)
  expect(surface).not.toMatch(/\. hero rail \./)
  expect(surface).not.toMatch(/\. eq\s+eq \./)
  expect(surface).not.toMatch(/\. time\s+mix/)
  expect(surface).not.toMatch(/\. bank\s+bank/)
})

test('without areas, Surface stacks on one module column', () => {
  const { container } = render(
    <Surface>
      <div>child</div>
    </Surface>,
  )
  const grid = container.querySelector('[data-aether="grid"]') as HTMLElement
  expect(grid).toBeTruthy()
  expect(grid.getAttribute('data-modules')).toBeNull()
  expect(getComputedStyle(grid).display).toBe('grid')
  expect(grid.style.gridTemplateAreas).toBe('')
})

test('optional areas belong to the consumer, not a kit topology', () => {
  const { container } = render(
    <Surface
      areas={`
        "head head"
        "a b"
        "foot foot"
      `}
    >
      <div>child</div>
    </Surface>,
  )
  const grid = container.querySelector('[data-aether="grid"]') as HTMLElement
  expect(grid.getAttribute('data-modules')).toBe('true')
  expect(grid.style.gridTemplateAreas).toMatch(/head/)
  expect(grid.style.gridTemplateAreas).not.toMatch(/hero/)
  expect(grid.style.gridTemplateColumns).toMatch(/repeat\(2,\s*minmax\(2\.75rem,\s*1fr\)\)/)
  expect(grid.style.gridTemplateRows).toBe(
    'minmax(2.75rem, 1fr) minmax(2.75rem, 1fr) minmax(2.75rem, 1fr)',
  )
})

test('a name-only row is auto; remaining rows share leftover height', () => {
  const { container } = render(
    <Surface
      areas={`
        "name name"
        "hero rail"
        "eq eq"
      `}
    >
      <div>child</div>
    </Surface>,
  )
  const grid = container.querySelector('[data-aether="grid"]') as HTMLElement
  expect(grid.style.gridTemplateRows).toBe(
    'minmax(2.75rem, auto) minmax(2.75rem, 1fr) minmax(2.75rem, 1fr)',
  )
})

test('parseAreaTracks reads quoted rows into equal modules', () => {
  const tracks = parseAreaTracks(`
    ". name name ."
    "in hero trim out"
  `)
  expect(tracks).toEqual({
    columns: 4,
    rows: 2,
    template: `". name name ." "in hero trim out"`,
    rowTracks: 'minmax(2.75rem, auto) minmax(2.75rem, 1fr)',
  })
})

test('uneven area rows fall back to a stack', () => {
  const { container } = render(
    <Surface
      areas={`
        "a b c"
        "d e"
      `}
    >
      <div>plain-child</div>
    </Surface>,
  )
  const grid = container.querySelector('[data-aether="grid"]') as HTMLElement
  expect(grid.getAttribute('data-modules')).toBeNull()
  expect(grid.contains(screen.getByText('plain-child'))).toBe(true)
})

test('public kit entry re-exports Surface, Rail, and not Overlay', () => {
  expect(typeof Surface).toBe('function')
  expect(typeof parseAreaTracks).toBe('function')
})
