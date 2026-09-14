import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { render, screen } from '@testing-library/react'
import { beforeAll, expect, test } from 'vitest'

import { ThemeRoot } from '../../index.ts'

type Rgb = { r: number; g: number; b: number }

const SEMANTIC_VARS = [
  '--bg',
  '--surface',
  '--ink',
  '--muted',
  '--rule',
  '--accent',
] as const

const PRIMITIVE_VARS = [
  '--gxsc-fog',
  '--gxsc-ink',
  '--gxsc-mute',
  '--gxsc-moss',
  '--gxsc-blue',
  '--gxsc-green',
  '--gxsc-ice',
  '--gxsc-pool',
  '--gxsc-fluoro',
  '--gxsc-grey',
  '--gxsc-black',
] as const

const TE_PRODUCT_HEX = [
  '#ff6b00',
  '#ff5c00',
  '#ff6600',
  '#f5e6d3',
  '#faeeda',
] as const

function themedNode(): HTMLElement {
  const node = document.createElement('div')
  node.className = 'aether-gxsc'
  document.body.appendChild(node)
  return node
}

function readCustomProperty(node: Element, name: string): string {
  const seen = new Set<string>()
  let current = getComputedStyle(node).getPropertyValue(name).trim()
  while (/^var\(/.test(current)) {
    const inner = current.slice(4, current.endsWith(')') ? -1 : current.length).trim()
    const ref = inner.split(',')[0]?.trim() ?? ''
    if (!ref.startsWith('--') || seen.has(ref)) {
      break
    }
    seen.add(ref)
    const next = getComputedStyle(node).getPropertyValue(ref).trim()
    if (!next) {
      break
    }
    current = next
  }
  return current
}

function specifiedCustomProperty(node: Element, name: string): string {
  return getComputedStyle(node).getPropertyValue(name).trim()
}

function parseCssColor(value: string): Rgb {
  const trimmed = value.trim()
  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hex?.[1]) {
    let digits = hex[1]
    if (digits.length === 3) {
      digits = digits
        .split('')
        .map((ch) => ch + ch)
        .join('')
    }
    return {
      r: Number.parseInt(digits.slice(0, 2), 16),
      g: Number.parseInt(digits.slice(2, 4), 16),
      b: Number.parseInt(digits.slice(4, 6), 16),
    }
  }
  const rgb = trimmed.match(
    /^rgba?\(\s*([\d.]+)[%]?\s*[,\s]\s*([\d.]+)[%]?\s*[,\s]\s*([\d.]+)/i,
  )
  if (rgb) {
    return { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) }
  }
  throw new Error(`Could not parse CSS color: ${value}`)
}

/** WCAG 2.1 relative luminance (sRGB). */
function relativeLuminance({ r, g, b }: Rgb): number {
  const toLinear = (channel: number) => {
    const srgb = channel / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG 2.1 contrast ratio: (Lighter + 0.05) / (Darker + 0.05). */
function contrastRatio(a: Rgb, b: Rgb): number {
  const l1 = relativeLuminance(a)
  const l2 = relativeLuminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const lightness = (max + min) / 2
  if (max === min) {
    return { h: 0, s: 0, l: lightness * 100 }
  }
  const delta = max - min
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  let hue = 0
  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0)
  } else if (max === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }
  return { h: hue * 60, s: saturation * 100, l: lightness * 100 }
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

function hexToRgb(hex: string): Rgb {
  return parseCssColor(hex)
}

beforeAll(() => {
  const themeDir = dirname(fileURLToPath(import.meta.url))
  const style = document.createElement('style')
  style.textContent = [
    readFileSync(join(themeDir, 'gxsc.css'), 'utf8'),
    readFileSync(join(themeDir, '../../type/tokens/tokens.css'), 'utf8'),
  ].join('\n')
  document.head.appendChild(style)
})

test('theme CSS defines semantic vars as primitives on a themed node', () => {
  const node = themedNode()
  for (const name of SEMANTIC_VARS) {
    const specified = specifiedCustomProperty(node, name)
    expect(specified.startsWith('var(')).toBe(true)
    expect(specified.includes('--gxsc-')).toBe(true)
    expect(readCustomProperty(node, name).length).toBeGreaterThan(0)
  }
  for (const name of PRIMITIVE_VARS) {
    expect(specifiedCustomProperty(node, name).length).toBeGreaterThan(0)
  }
})

test('primitives stay cool: no earthy beige/tan hues', () => {
  const node = themedNode()
  const css = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), 'gxsc.css'),
    'utf8',
  ).toLowerCase()
  expect(css).not.toMatch(/--gxsc-beige|--gxsc-tan/)
  expect(css).not.toMatch(/#c8bfae|#a89478/)

  for (const name of PRIMITIVE_VARS) {
    const { h, s } = rgbToHsl(parseCssColor(readCustomProperty(node, name)))
    const earthyHue = h >= 15 && h <= 55
    expect(earthyHue && s > 18).toBe(false)
  }
})

test('ink/surface and muted/surface meet WCAG 2.1 contrast floors', () => {
  const node = themedNode()
  const ink = parseCssColor(readCustomProperty(node, '--ink'))
  const muted = parseCssColor(readCustomProperty(node, '--muted'))
  const surface = parseCssColor(readCustomProperty(node, '--surface'))
  const bg = parseCssColor(readCustomProperty(node, '--bg'))
  const accent = parseCssColor(readCustomProperty(node, '--accent'))
  // WCAG 2.1 relative luminance (sRGB linearization) and contrast (L+0.05)/(L+0.05).
  // Normal text floor 4.5:1; large/secondary (muted) floor 3.0:1; UI chrome 3.0:1.
  expect(contrastRatio(ink, surface)).toBeGreaterThanOrEqual(4.5)
  expect(contrastRatio(muted, surface)).toBeGreaterThanOrEqual(3)
  expect(contrastRatio(accent, bg)).toBeGreaterThanOrEqual(3)
  expect(contrastRatio(accent, surface)).toBeGreaterThanOrEqual(3)
  expect(relativeLuminance(surface)).toBeGreaterThan(relativeLuminance(ink))
  expect(relativeLuminance(bg)).toBeGreaterThan(relativeLuminance(ink))
})

test('accent is cool fluoro, not Teenage Engineering orange', () => {
  const node = themedNode()
  const accent = parseCssColor(readCustomProperty(node, '--accent'))
  const { h, s } = rgbToHsl(accent)
  const inOrangeHue = h >= 15 && h <= 50
  expect(inOrangeHue && s > 20).toBe(false)

  const themeDir = dirname(fileURLToPath(import.meta.url))
  const typeDir = join(themeDir, '../../type')
  const sources = [...collectSourceFiles(themeDir), ...collectSourceFiles(typeDir)]
  const forbiddenRgb = TE_PRODUCT_HEX.map((hex) => hexToRgb(hex))
  for (const file of sources) {
    const text = readFileSync(file, 'utf8').toLowerCase()
    for (const hex of TE_PRODUCT_HEX) {
      expect(text.includes(hex)).toBe(false)
    }
    for (const { r, g, b } of forbiddenRgb) {
      const rgb = `rgb(${r}, ${g}, ${b})`
      const rgbSpace = `rgb(${r} ${g} ${b})`
      const hsl = rgbToHsl({ r, g, b })
      const hslCss = `hsl(${Math.round(hsl.h)}`
      expect(text.includes(rgb)).toBe(false)
      expect(text.includes(rgbSpace)).toBe(false)
      if (hsl.s > 25) {
        expect(text.includes(hslCss.toLowerCase())).toBe(false)
      }
    }
  }
})

test('type tokens cover family, name/value/label sizes, tracking, and weights', () => {
  const node = themedNode()
  const family = specifiedCustomProperty(node, '--font-family')
  expect(family.toLowerCase()).toContain('spectral')
  expect(family.toLowerCase()).toContain('serif')
  expect(specifiedCustomProperty(node, '--font-family-body').toLowerCase()).toContain(
    'spectral',
  )

  const nameSize = specifiedCustomProperty(node, '--type-size-name')
  const valueSize = specifiedCustomProperty(node, '--type-size-value')
  const labelSize = specifiedCustomProperty(node, '--type-size-label')
  expect(nameSize).toMatch(/^\d/)
  expect(valueSize).toMatch(/^\d/)
  expect(labelSize).toMatch(/^\d/)
  expect(new Set([nameSize, valueSize, labelSize]).size).toBe(3)

  expect(specifiedCustomProperty(node, '--type-tracking').length).toBeGreaterThan(
    0,
  )
  expect(specifiedCustomProperty(node, '--type-numeric')).toMatch(/tabular-nums/)
  const regular = specifiedCustomProperty(node, '--type-weight-regular')
  const medium = specifiedCustomProperty(node, '--type-weight-medium')
  expect(regular).not.toBe(medium)
  expect(regular.length).toBeGreaterThan(0)
  expect(medium.length).toBeGreaterThan(0)

  const typeCss = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../type/tokens/tokens.css'),
    'utf8',
  )
  expect(typeCss.includes('@font-face')).toBe(true)
  expect(/font-display:\s*swap/.test(typeCss)).toBe(true)
})

test('ThemeRoot renders children', () => {
  render(
    <ThemeRoot>
      <span>theme-root-child</span>
    </ThemeRoot>,
  )
  expect(screen.getByText('theme-root-child')).toBeTruthy()
})
