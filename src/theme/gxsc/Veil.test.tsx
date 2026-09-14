import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, expect, test } from 'vitest'

import { ThemeRoot } from '../../index.ts'

afterEach(() => {
  cleanup()
})

test('ThemeRoot mounts a mist veil by default', () => {
  render(
    <ThemeRoot>
      <span>theme-root-child</span>
    </ThemeRoot>,
  )
  expect(screen.getByText('theme-root-child')).toBeTruthy()
  const veil = document.querySelector('[data-aether="veil"]') as HTMLElement
  expect(veil).toBeTruthy()
  expect(veil.querySelectorAll('.aether-fog')).toHaveLength(3)
  expect(veil.querySelector('.aether-bloom')).toBeTruthy()
  expect(document.querySelector('[data-aether="ascii-field"]')).toBeNull()
  expect(document.querySelector('.aether-flourish')).toBeNull()
})

test('ThemeRoot can omit the veil', () => {
  render(
    <ThemeRoot veil={false}>
      <span>no-veil</span>
    </ThemeRoot>,
  )
  expect(screen.getByText('no-veil')).toBeTruthy()
  expect(document.querySelector('[data-aether="veil"]')).toBeNull()
})

test('ThemeRoot atmosphere still freezes the veil', () => {
  render(
    <ThemeRoot atmosphere="still">
      <span>still-child</span>
    </ThemeRoot>,
  )
  const veil = document.querySelector('[data-aether="veil"]')
  expect(veil?.getAttribute('data-atmosphere')).toBe('still')
})

test('mist weather is CSS drift, not a glyph tick', () => {
  const { container } = render(
    <ThemeRoot>
      <span>mist-child</span>
    </ThemeRoot>,
  )
  expect(container.querySelector('pre.aether-ascii')).toBeNull()
  expect(container.querySelectorAll('.aether-fog[data-layer]').length).toBe(3)
})

test('ThemeRoot flush stage still renders children', () => {
  render(
    <ThemeRoot flush>
      <span>flush-child</span>
    </ThemeRoot>,
  )
  expect(screen.getByText('flush-child')).toBeTruthy()
  expect(document.querySelector('.aether-gxsc-stage')?.getAttribute('data-flush')).toBe('true')
})
