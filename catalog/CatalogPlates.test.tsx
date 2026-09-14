import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest'

import { ThemeRoot } from 'aether-kit'

import { CatalogFaceplate } from './CatalogFaceplate.tsx'
import { CatalogPlates } from './CatalogPlates.tsx'
import { CatalogSurface } from './CatalogSurface.tsx'
import { SizeFrame } from './SizeFrame.tsx'
import { CATALOG_FIXTURE_NAMES, CATALOG_FIXTURES } from './frames.ts'

import './plates.css'

type LiveObserver = {
  callback: ResizeObserverCallback
  target: Element | null
}

const catalogDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(catalogDir, '..')
const liveObservers: LiveObserver[] = []

class MockResizeObserver {
  private readonly handle: LiveObserver

  constructor(callback: ResizeObserverCallback) {
    this.handle = { callback, target: null }
    liveObservers.push(this.handle)
  }

  observe(target: Element) {
    this.handle.target = target
  }

  unobserve() {}

  disconnect() {
    this.handle.target = null
    const index = liveObservers.indexOf(this.handle)
    if (index >= 0) liveObservers.splice(index, 1)
  }
}

function deliverSize(width: number, height: number) {
  const active = liveObservers.filter((observer) => observer.target)
  if (active.length === 0) return
  const contentRect = {
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
    toJSON() {
      return {}
    },
  } satisfies DOMRectReadOnly

  act(() => {
    for (const observer of active) {
      const target = observer.target!
      observer.callback(
        [
          {
            target,
            contentRect,
            borderBoxSize: [],
            contentBoxSize: [{ inlineSize: width, blockSize: height }],
            devicePixelContentBoxSize: [],
          } as ResizeObserverEntry,
        ],
        {} as ResizeObserver,
      )
    }
  })
}

function catalogSources(): string[] {
  return readdirSync(catalogDir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(catalogDir, entry.name)
    if (entry.isDirectory()) return []
    if (/\.(css|ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      return [path]
    }
    return []
  })
}

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(path))
      continue
    }
    if (/\.(css|ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      files.push(path)
    }
  }
  return files
}

function mockRect(width: number, height: number, left = 0, top = 0): DOMRect {
  return {
    x: left,
    y: top,
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
    toJSON() {
      return {}
    },
  } as DOMRect
}

function resolvedCustomProperty(node: Element, name: string): string {
  let current: Element | null = node
  while (current) {
    const value = getComputedStyle(current).getPropertyValue(name).trim()
    if (value.length > 0) return value
    current = current.parentElement
  }
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

beforeAll(() => {
  const themeDir = join(repoRoot, 'src/theme/gxsc')
  const style = document.createElement('style')
  style.textContent = [
    readFileSync(join(themeDir, 'gxsc.css'), 'utf8'),
    readFileSync(join(themeDir, '../../type/tokens/tokens.css'), 'utf8'),
  ].join('\n')
  document.head.appendChild(style)
})

beforeEach(() => {
  liveObservers.length = 0
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test('dev script serves Ladle, not a custom catalog shell or Storybook', () => {
  const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>
  }
  expect(pkg.scripts.dev).toMatch(/ladle serve/)
  expect(pkg.scripts.dev).not.toMatch(/storybook/i)
  expect(readFileSync(join(repoRoot, '.ladle/config.mjs'), 'utf8')).toMatch(
    /catalog\/\*\*\/\*\.stories/,
  )
  expect(readFileSync(join(repoRoot, '.ladle/components.tsx'), 'utf8')).toMatch(
    /veil=\{false\}/,
  )
})

test('SizeFrame clips the mist veil to the plate', () => {
  const { container } = render(
    <ThemeRoot veil={false}>
      <SizeFrame width={200} height={100}>
        <span>framed</span>
      </SizeFrame>
    </ThemeRoot>,
  )
  const frame = container.querySelector('[data-catalog="size-frame"]') as HTMLElement
  expect(frame.querySelector('[data-aether="veil"]')).toBeTruthy()
  const page = container.querySelector('[data-aether="theme"]') as HTMLElement
  expect(page.querySelector(':scope > [data-aether="veil"]')).toBeNull()
})

test('SizeFrame can preview still and reduce atmosphere', () => {
  const { container } = render(
    <SizeFrame width={200} height={100}>
      <span>framed</span>
    </SizeFrame>,
  )
  expect(container.querySelector('[data-catalog="atmosphere"]')).toBeTruthy()
  fireEvent.click(container.querySelector('[data-catalog="atmosphere"] button:nth-child(2)') as HTMLButtonElement)
  expect(container.querySelector('[data-aether="veil"]')?.getAttribute('data-atmosphere')).toBe('still')
  fireEvent.click(container.querySelector('[data-catalog="atmosphere"] button:nth-child(3)') as HTMLButtonElement)
  expect(container.querySelector('[data-aether="veil"]')?.getAttribute('data-atmosphere')).toBe('reduce')
})

test('catalog composes the public kit API and never deep-imports kit internals', () => {
  const sources = catalogSources()
  expect(sources.length).toBeGreaterThan(0)
  const joined = sources.map((file) => readFileSync(file, 'utf8')).join('\n')
  expect(joined).toMatch(/from ['"]aether-kit['"]/)
  expect(joined).not.toMatch(/src\/layout\//)
  expect(joined).not.toMatch(/src\/controls\//)
  expect(joined).not.toMatch(/src\/theme\//)
  expect(joined).not.toMatch(/src\/geometry\//)

  const chromeFiles = [
    'CatalogScene.tsx',
    'CatalogDelay.tsx',
    'CatalogPlates.tsx',
    'CatalogFaceplate.tsx',
    'CatalogSurface.tsx',
    'SizeFrame.tsx',
    'CatalogStage.tsx',
    'frames.ts',
    'plates.css',
    'Knob.stories.tsx',
    'Plates.stories.tsx',
  ]
  for (const name of chromeFiles) {
    const text = readFileSync(join(catalogDir, name), 'utf8')
    expect(text).not.toMatch(/vanDeGraaf/)
    expect(text).not.toMatch(/selectPowerLines/)
  }

  const kitSources = collectSourceFiles(join(repoRoot, 'src'))
  for (const file of kitSources) {
    expect(readFileSync(file, 'utf8')).not.toMatch(/catalog\//)
  }
})

test('boots framed Surfaces under ThemeRoot with GXSC tokens, knob, and slider', () => {
  const { container } = render(
    <ThemeRoot>
      <CatalogPlates fixture={CATALOG_FIXTURES.standard} />
    </ThemeRoot>,
  )
  const fixture = CATALOG_FIXTURES.standard
  deliverSize(fixture.width, fixture.height)

  expect(screen.queryByText(/placeholder/i)).toBeNull()

  const theme = container.querySelector('.aether-gxsc') as HTMLElement
  const surfaces = [...container.querySelectorAll('[data-aether="surface"]')] as HTMLElement[]
  expect(theme).toBeTruthy()
  expect(surfaces).toHaveLength(2)
  expect(theme.contains(surfaces[0]!)).toBe(true)
  expect(theme.contains(surfaces[1]!)).toBe(true)
  expect(screen.getByText('Prism')).toBeTruthy()
  expect(screen.getByText('Hold')).toBeTruthy()

  const surface = surfaces.find((node) => node.textContent?.includes('Prism')) as HTMLElement
  const grid = surface.querySelector('[data-aether="grid"]') as HTMLElement
  const knob = surface.querySelector('[data-aether="knob"]') as HTMLElement
  const slider = surface.querySelector('[data-aether="slider"]') as HTMLElement
  expect(resolvedCustomProperty(knob, '--surface').length).toBeGreaterThan(0)
  expect(resolvedCustomProperty(knob, '--ink').length).toBeGreaterThan(0)
  expect(grid.contains(knob)).toBe(true)
  expect(grid.contains(slider)).toBe(true)
  expect(knob.textContent).toMatch(/Cutoff/)
  expect(screen.getByText('filter')).toBeTruthy()
  expect(screen.getByText('delay')).toBeTruthy()
  expect(surface.textContent).not.toMatch(/Aether/)
  expect(knob.getAttribute('data-size')).toBe('dial')
  expect(slider.textContent).toMatch(/Mix/)
  expect(surface.textContent).toMatch(/low-pass/i)
  expect(surface.textContent).not.toMatch(/\blp\b/)
  expect(screen.getByRole('button', { name: /bypass in/i })).toBeTruthy()

  const frames = [...container.querySelectorAll('[data-catalog="size-frame"]')] as HTMLElement[]
  expect(frames).toHaveLength(2)
  for (const frame of frames) {
    expect(frame.getAttribute('data-aether')).toBeNull()
    expect(frame.style.width).toBe(`${fixture.width}px`)
  }
})

test('named landscape fixtures resize paired Prism and Hold plates', () => {
  expect(CATALOG_FIXTURE_NAMES.length).toBeGreaterThanOrEqual(2)
  const { container, rerender } = render(
    <ThemeRoot>
      <CatalogPlates fixture={CATALOG_FIXTURES.standard} />
    </ThemeRoot>,
  )
  deliverSize(CATALOG_FIXTURES.standard.width, CATALOG_FIXTURES.standard.height)

  rerender(
    <ThemeRoot>
      <CatalogPlates  fixture={CATALOG_FIXTURES.wide} />
    </ThemeRoot>,
  )
  const frames = [...container.querySelectorAll('[data-catalog="size-frame"]')] as HTMLElement[]
  for (const frame of frames) {
    expect(frame.style.width).toBe(`${CATALOG_FIXTURES.wide.width}px`)
    expect(frame.style.height).toBe(`${CATALOG_FIXTURES.wide.height}px`)
  }
  expect(container.querySelector('.catalog-scene')?.getAttribute('style') ?? '').toMatch(
    /--fixture-width/,
  )
  const catalogCss = readFileSync(join(catalogDir, 'plates.css'), 'utf8')
  expect(catalogCss).toMatch(/100cqi/)
  expect(catalogCss).toMatch(/size-frame-host/)
  expect(catalogCss).toMatch(/catalog-plates-row/)
})

test('kit plates never paint a construction overlay', () => {
  const { container } = render(
    <ThemeRoot veil={false}>
      <CatalogPlates fixture={CATALOG_FIXTURES.standard} />
      <CatalogSurface />
      <CatalogFaceplate />
    </ThemeRoot>,
  )
  expect(container.querySelector('[data-aether="overlay"]')).toBeNull()
  expect(container.querySelectorAll('[data-construction]')).toHaveLength(0)
})

test('Faceplate is a generic insert plate with no plugin IDs', () => {
  const { container } = render(
    <ThemeRoot veil={false}>
      <CatalogFaceplate />
    </ThemeRoot>,
  )
  expect(container.textContent).not.toMatch(/inTrim|outPad|mach1|Mackity/i)
  expect(screen.getByText('Insert')).toBeTruthy()
  expect(
    screen.getByRole('slider', { name: /drive/i }).closest('[data-aether="knob"]')?.getAttribute(
      'data-size',
    ),
  ).toBe('hero')
  expect(screen.getByRole('meter', { name: /^in$/i })).toBeTruthy()
  expect(screen.getByRole('button', { name: /match/i })).toBeTruthy()
  expect(
    screen.getByRole('button', { name: /match/i }).textContent,
  ).toBe('M')
})

test('Prism and Hold sit on the same fixture, Hold with a bank not the filter map', () => {
  const { container } = render(
    <ThemeRoot>
      <CatalogPlates fixture={CATALOG_FIXTURES.standard} />
    </ThemeRoot>,
  )
  const fixture = CATALOG_FIXTURES.standard
  deliverSize(fixture.width, fixture.height)

  const surface = [...container.querySelectorAll('[data-aether="surface"]')].find((node) =>
    node.textContent?.includes('Hold'),
  ) as HTMLElement
  const grid = surface.querySelector('[data-aether="grid"]') as HTMLElement
  expect(screen.getByText('Hold')).toBeTruthy()
  expect(surface.textContent).not.toMatch(/Cutoff/)
  expect(grid.style.gridTemplateAreas).toMatch(/time/)
  expect(grid.style.gridTemplateAreas).not.toMatch(/hero/)

  const time = surface.querySelector('[data-aether="readout"]') as HTMLElement
  expect(time.textContent).toMatch(/Time/)
  expect(time.textContent).toMatch(/1\/8/)
  expect(screen.queryByRole('slider', { name: /time/i })).toBeNull()
  const mixes = screen.getAllByRole('slider', { name: /mix/i })
  expect(mixes[0]?.getAttribute('aria-valuetext')).toBe('35')
  expect(mixes[1]?.getAttribute('aria-valuetext')).toBe('62')
  expect(surface.querySelector('[data-aether="rail"]')).toBeTruthy()
  fireEvent.click(screen.getByRole('radio', { name: '1/16' }))
  expect(time.textContent).toMatch(/1\/16/)

  fireEvent.click(within(surface).getByRole('button', { name: /clock previous/i }))
  const freeTime = screen.getByRole('slider', { name: /time/i })
  expect(freeTime.getAttribute('aria-disabled')).toBeNull()
  expect(freeTime.getAttribute('aria-valuetext')).toBe('375')
  expect(surface.textContent).toMatch(/ms/)
  fireEvent.click(within(surface).getByRole('button', { name: /clock next/i }))
  expect(screen.queryByRole('slider', { name: /time/i })).toBeNull()
  expect(surface.querySelector('[data-aether="readout"]')?.textContent).toMatch(/1\/16/)

  const kinds = new Set(
    [...surface.querySelectorAll('[data-aether]')].map((node) => node.getAttribute('data-aether')),
  )
  expect(kinds.has('bank')).toBe(true)
})

test('Hold fills the SizeFrame; Rail lives in the kit; isolated stories declare areas', () => {
  const plates = readFileSync(join(catalogDir, 'plates.css'), 'utf8')
  expect(plates).toMatch(/\.catalog-delay[\s\S]*height:\s*100%/)
  expect(plates).not.toMatch(/face-rail/)
  expect(readFileSync(join(repoRoot, 'src/theme/gxsc/gxsc.css'), 'utf8')).toMatch(
    /data-flush='true'\] > \*/,
  )
  expect(readFileSync(join(repoRoot, 'src/layout/Rail.tsx'), 'utf8')).toMatch(/data-aether="rail"/)
  expect(readFileSync(join(catalogDir, 'StoryPlate.tsx'), 'utf8')).toMatch(/"name"/)
  expect(readFileSync(join(catalogDir, 'StoryPlate.tsx'), 'utf8')).toMatch(/"hit"/)
  expect(readFileSync(join(catalogDir, 'Knob.stories.tsx'), 'utf8')).toMatch(/StoryPlate/)
})

test('Plates stories keep Prism and Hold on one plate each', () => {
  const text = readFileSync(join(catalogDir, 'Plates.stories.tsx'), 'utf8')
  expect(text).toMatch(/export const Prism/)
  expect(text).toMatch(/export const Hold/)
  expect(text).toMatch(/export const Pair/)
})

test('Knob stories name rest keys on a size-fit plate', () => {
  const text = readFileSync(join(catalogDir, 'Knob.stories.tsx'), 'utf8')
  expect(text).toMatch(/HIT_FRAMES/)
  expect(text).toMatch(/280/)
  expect(text).toMatch(/Shift fine/)
  expect(text).toMatch(/double-click rest/)
})
