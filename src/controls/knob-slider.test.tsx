import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'

import { Knob, Slider, ThemeRoot } from '../index.ts'

const controlsDir = dirname(fileURLToPath(import.meta.url))

afterEach(() => {
  cleanup()
})

function controlSources(): string[] {
  return readdirSync(controlsDir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(controlsDir, entry.name)
    if (entry.isDirectory()) return []
    if (/\.(css|ts|tsx)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      return [path]
    }
    return []
  })
}

function assertNoNaN(root: HTMLElement) {
  expect(root.textContent?.includes('NaN')).toBe(false)
  for (const node of root.querySelectorAll('*')) {
    expect(node.textContent?.includes('NaN')).toBe(false)
    const el = node as HTMLElement
    expect(el.getAttribute('aria-valuenow')?.includes('NaN')).toBeFalsy()
    expect(el.getAttribute('aria-valuemin')?.includes('NaN')).toBeFalsy()
    expect(el.getAttribute('aria-valuemax')?.includes('NaN')).toBeFalsy()
    expect(el.getAttribute('style')?.includes('NaN')).toBeFalsy()
    expect(el.style.cssText.includes('NaN')).toBe(false)
    expect(el.style.transform.includes('NaN')).toBe(false)
    expect(el.style.width.includes('NaN')).toBe(false)
  }
}

function assertFiniteInRange(
  onChange: ReturnType<typeof vi.fn>,
  min: number,
  max: number,
) {
  for (const [next] of onChange.mock.calls) {
    expect(Number.isFinite(next)).toBe(true)
    expect(next).toBeGreaterThanOrEqual(min)
    expect(next).toBeLessThanOrEqual(max)
  }
}

function pointerDrag(
  target: HTMLElement,
  from: { clientX: number; clientY: number },
  to: { clientX: number; clientY: number },
  shiftKey = false,
) {
  fireEvent.pointerDown(target, { ...from, shiftKey })
  fireEvent.pointerMove(target, { ...to, shiftKey })
  fireEvent.pointerUp(target, { ...to, shiftKey })
}

const chromeProps = {
  name: 'Cutoff',
  unit: 'Hz',
  value: 440,
  min: 0,
  max: 1000,
  step: 1,
  format: (n: number) => n.toFixed(1),
} as const

test('kit public entry re-exports Knob and Slider; dial is a Knob size', () => {
  expect(typeof Knob).toBe('function')
  expect(typeof Slider).toBe('function')
  render(
    <Knob
      size="dial"
      value={0}
      min={0}
      max={1}
      step={0.01}
    />,
  )
  expect(screen.getByRole('slider')).toBeTruthy()
})

test('control modules do not import Surface, Overlay leftovers, or catalog', () => {
  for (const file of controlSources()) {
    const text = readFileSync(file, 'utf8')
    expect(text).not.toMatch(/vanDeGraaf/)
    expect(text).not.toMatch(/selectPowerLines/)
    expect(text).not.toMatch(/layout\/Surface/)
    expect(text).not.toMatch(/layout\/Overlay/)
    expect(text).not.toMatch(/catalog\//)
  }
})

test('Knob chrome shows name, formatted value, and unit', () => {
  const { container, rerender } = render(<Knob {...chromeProps} />)
  const text = container.textContent ?? ''
  expect(text.includes('Cutoff')).toBe(true)
  expect(text.includes('440.0')).toBe(true)
  expect(text.includes('Hz')).toBe(true)

  rerender(
    <Knob
      name="Cutoff"
      unit="Hz"
      value={440}
      min={0}
      max={1000}
      step={1}
    />,
  )
  const unformatted = container.textContent ?? ''
  expect(unformatted.includes('440')).toBe(true)
  expect(unformatted.includes('NaN')).toBe(false)
  expect(unformatted.includes('undefined')).toBe(false)
})

test('Slider chrome shows name, formatted value, and unit', () => {
  const { container, rerender } = render(<Slider {...chromeProps} />)
  const text = container.textContent ?? ''
  expect(text.includes('Cutoff')).toBe(true)
  expect(text.includes('440.0')).toBe(true)
  expect(text.includes('Hz')).toBe(true)

  rerender(
    <Slider
      name="Cutoff"
      unit="Hz"
      value={440}
      min={0}
      max={1000}
      step={1}
    />,
  )
  const unformatted = container.textContent ?? ''
  expect(unformatted.includes('440')).toBe(true)
  expect(unformatted.includes('NaN')).toBe(false)
  expect(unformatted.includes('undefined')).toBe(false)
})

test('Knob pointer uses vertical-delta mapping', () => {
  const onChange = vi.fn()
  const props = { min: 0, max: 100, step: 1, value: 50, onChange }
  render(<Knob {...props} />)
  const target = screen.getByRole('slider')

  pointerDrag(target, { clientX: 10, clientY: 80 }, { clientX: 10, clientY: 40 })
  expect(onChange.mock.calls.length).toBeGreaterThan(0)
  const up = onChange.mock.calls.at(-1)![0] as number
  expect(up).toBeGreaterThan(50)
  expect(up).toBeLessThanOrEqual(100)
  assertFiniteInRange(onChange, 0, 100)

  onChange.mockClear()
  pointerDrag(target, { clientX: 10, clientY: 40 }, { clientX: 10, clientY: 80 })
  const down = onChange.mock.calls.at(-1)![0] as number
  expect(down).toBeLessThan(50)
  expect(down).toBeGreaterThanOrEqual(0)
  assertFiniteInRange(onChange, 0, 100)

  onChange.mockClear()
  pointerDrag(target, { clientX: 10, clientY: 50 }, { clientX: 90, clientY: 50 })
  const horizontal = onChange.mock.calls.map((call) => call[0] as number)
  for (const next of horizontal) {
    expect(Number.isFinite(next)).toBe(true)
    expect(next).toBeGreaterThanOrEqual(0)
    expect(next).toBeLessThanOrEqual(100)
    expect(next).toBe(50)
  }
})

test('Slider pointer uses horizontal mapping', () => {
  const onChange = vi.fn()
  render(<Slider min={0} max={100} step={1} value={50} onChange={onChange} />)
  const target = screen.getByRole('slider')

  pointerDrag(target, { clientX: 40, clientY: 10 }, { clientX: 80, clientY: 10 })
  const right = onChange.mock.calls.at(-1)![0] as number
  expect(right).toBeGreaterThan(50)
  expect(right).toBeLessThanOrEqual(100)
  assertFiniteInRange(onChange, 0, 100)

  onChange.mockClear()
  pointerDrag(target, { clientX: 80, clientY: 10 }, { clientX: 40, clientY: 10 })
  const left = onChange.mock.calls.at(-1)![0] as number
  expect(left).toBeLessThan(50)
  expect(left).toBeGreaterThanOrEqual(0)
  assertFiniteInRange(onChange, 0, 100)
})

function keyboardContract(
  Control: typeof Knob | typeof Slider,
) {
  const onChange = vi.fn()
  const { rerender } = render(
    <Control min={0} max={100} step={1} value={50} onChange={onChange} />,
  )
  const slider = screen.getByRole('slider')

  fireEvent.keyDown(slider, { key: 'ArrowUp' })
  expect(onChange).toHaveBeenCalledWith(51)
  onChange.mockClear()
  fireEvent.keyDown(slider, { key: 'ArrowRight' })
  expect(onChange).toHaveBeenCalledWith(51)
  onChange.mockClear()
  fireEvent.keyDown(slider, { key: 'ArrowDown' })
  expect(onChange).toHaveBeenCalledWith(49)
  onChange.mockClear()
  fireEvent.keyDown(slider, { key: 'ArrowLeft' })
  expect(onChange).toHaveBeenCalledWith(49)

  onChange.mockClear()
  rerender(
    <Control min={0} max={100} step={1} value={100} onChange={onChange} />,
  )
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowUp' })
  for (const [next] of onChange.mock.calls) {
    expect(next).toBeLessThanOrEqual(100)
    expect(Number.isFinite(next)).toBe(true)
  }

  onChange.mockClear()
  rerender(
    <Control min={0} max={100} step={1} value={0} onChange={onChange} />,
  )
  fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowDown' })
  for (const [next] of onChange.mock.calls) {
    expect(next).toBeGreaterThanOrEqual(0)
    expect(Number.isFinite(next)).toBe(true)
  }

  onChange.mockClear()
  rerender(
    <Control min={0} max={100} step={1} value={50} onChange={onChange} />,
  )
  fireEvent.keyDown(screen.getByRole('slider'), {
    key: 'ArrowUp',
    shiftKey: true,
  })
  const fineUp = onChange.mock.calls.at(-1)![0] as number
  expect(Math.abs(fineUp - 50)).toBeLessThan(1)
  expect(fineUp).not.toBe(50)
  expect(Number.isFinite(fineUp)).toBe(true)
  expect(fineUp).toBeGreaterThanOrEqual(0)
  expect(fineUp).toBeLessThanOrEqual(100)

  onChange.mockClear()
  fireEvent.keyDown(screen.getByRole('slider'), {
    key: 'ArrowDown',
    shiftKey: true,
  })
  const fineDown = onChange.mock.calls.at(-1)![0] as number
  expect(Math.abs(fineDown - 50)).toBeLessThan(1)
  expect(Number.isFinite(fineDown)).toBe(true)
  expect(fineDown).toBeGreaterThanOrEqual(0)
  expect(fineDown).toBeLessThanOrEqual(100)
}

test('Knob keyboard, clamp, and Shift finer step', () => {
  keyboardContract(Knob)
})

test('Slider keyboard, clamp, and Shift finer step', () => {
  keyboardContract(Slider)
})

test('Knob Shift pointer drag is finer than unshifted drag', () => {
  const onChange = vi.fn()
  render(<Knob min={0} max={100} step={1} value={50} onChange={onChange} />)
  const target = screen.getByRole('slider')
  const from = { clientX: 10, clientY: 80 }
  const to = { clientX: 10, clientY: 40 }

  pointerDrag(target, from, to, false)
  const coarse = Math.abs((onChange.mock.calls.at(-1)![0] as number) - 50)
  expect(coarse).toBeGreaterThan(0)
  expect(coarse).toBeLessThan(50)

  onChange.mockClear()
  pointerDrag(target, from, to, true)
  const fine = Math.abs((onChange.mock.calls.at(-1)![0] as number) - 50)
  expect(fine).toBeGreaterThan(0)
  expect(fine).toBeLessThan(coarse)
  assertFiniteInRange(onChange, 0, 100)
})

test('integer step grid: ArrowUp from 0 with step 2 emits 2', () => {
  for (const Control of [Knob, Slider]) {
    const onChange = vi.fn()
    const { unmount } = render(
      <Control min={0} max={10} step={2} value={0} onChange={onChange} />,
    )
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowUp' })
    expect(onChange).toHaveBeenCalledWith(2)
    for (const [next] of onChange.mock.calls) {
      expect(Number.isInteger(next)).toBe(true)
      expect((next - 0) % 2).toBe(0)
      expect(next).toBeGreaterThanOrEqual(0)
      expect(next).toBeLessThanOrEqual(10)
    }
    unmount()
  }
})

test('read-only Knob and Slider do not throw and stay controlled', () => {
  for (const Control of [Knob, Slider]) {
    const { container, unmount } = render(
      <Control min={0} max={100} step={1} value={50} name="Cutoff" unit="Hz" />,
    )
    const slider = screen.getByRole('slider')
    expect(() => {
      pointerDrag(slider, { clientX: 10, clientY: 80 }, { clientX: 10, clientY: 20 })
      fireEvent.keyDown(slider, { key: 'ArrowUp' })
      fireEvent.keyDown(slider, { key: 'ArrowDown' })
    }).not.toThrow()
    expect(container.textContent?.includes('50')).toBe(true)
    unmount()
  }
})

test('empty name/unit never print undefined', () => {
  const { container, rerender } = render(
    <Knob name="" value={440} min={0} max={1000} step={1} />,
  )
  expect(container.textContent?.includes('undefined')).toBe(false)
  expect(container.textContent?.includes('440')).toBe(true)

  rerender(<Knob unit="" value={440} min={0} max={1000} step={1} />)
  expect(container.textContent?.includes('undefined')).toBe(false)
  expect(container.textContent?.includes('440')).toBe(true)

  rerender(<Slider name="" value={440} min={0} max={1000} step={1} />)
  expect(container.textContent?.includes('undefined')).toBe(false)
  expect(container.textContent?.includes('440')).toBe(true)

  rerender(<Slider unit="" value={440} min={0} max={1000} step={1} />)
  expect(container.textContent?.includes('undefined')).toBe(false)
  expect(container.textContent?.includes('440')).toBe(true)
})

function exerciseDegenerate(
  Control: typeof Knob | typeof Slider,
  props: { min: number; max: number; value: number },
) {
  const onChange = vi.fn()
  const { container, unmount } = render(
    <Control {...props} step={1} onChange={onChange} name="Cutoff" unit="Hz" />,
  )
  const slider = screen.getByRole('slider')
  expect(() => {
    pointerDrag(slider, { clientX: 10, clientY: 80 }, { clientX: 40, clientY: 20 })
    fireEvent.keyDown(slider, { key: 'ArrowUp' })
    fireEvent.keyDown(slider, { key: 'ArrowDown' })
  }).not.toThrow()
  assertNoNaN(container)
  assertFiniteInRange(onChange, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY)
  for (const [next] of onChange.mock.calls) {
    expect(Number.isFinite(next)).toBe(true)
  }
  unmount()
}

test('degenerate min/max and non-finite value do not produce NaN', () => {
  for (const Control of [Knob, Slider]) {
    exerciseDegenerate(Control, { min: 10, max: 10, value: 10 })
    exerciseDegenerate(Control, { min: 20, max: 10, value: 15 })
    exerciseDegenerate(Control, { min: 0, max: 100, value: Number.NaN })
  }
})

test('dial size is larger than default knob', () => {
  const { unmount } = render(
    <Knob min={0} max={100} step={1} value={50} />,
  )
  const defaultRoot = screen.getByRole('slider').closest('[data-aether="knob"]')
  expect(defaultRoot?.getAttribute('data-size')).toBe('knob')
  unmount()

  render(<Knob size="dial" min={0} max={100} step={1} value={50} />)
  const dialRoot = screen.getByRole('slider').closest('[data-aether="knob"]')
  expect(dialRoot?.getAttribute('data-size')).toBe('dial')

  const css = readFileSync(join(controlsDir, 'controls.css'), 'utf8')
  expect(css).toMatch(/data-size='knob'[\s\S]*width:\s*2\.75rem/)
  expect(css).toMatch(/data-size='dial'[\s\S]*width:\s*6\.75rem/)
  expect(css).toMatch(/data-size='hero'[\s\S]*width:\s*10rem/)
  expect(css).toMatch(/data-aether='meter'[\s\S]*width:\s*2\.75rem/)
})

test('pointer down captures the pointer on the hit', () => {
  const onChange = vi.fn()
  render(<Knob min={0} max={100} step={1} value={40} onChange={onChange} />)
  const target = screen.getByRole('slider')
  const capture = vi.fn()
  Object.defineProperty(target, 'setPointerCapture', {
    configurable: true,
    value: capture,
  })
  fireEvent.pointerDown(target, { pointerId: 7, clientX: 10, clientY: 80 })
  expect(capture).toHaveBeenCalledWith(7)
})

test('named knob hit is labelled by chrome, not a duplicate aria-label', () => {
  render(<Knob {...chromeProps} />)
  const hit = screen.getByRole('slider', { name: /cutoff/i })
  expect(hit.getAttribute('aria-label')).toBeNull()
  expect(hit.getAttribute('aria-labelledby')).toBeTruthy()
})

test('Knob can hide numeric chrome and show end captions', () => {
  const { container } = render(
    <Knob
      name="Tone"
      value={0}
      min={0}
      max={1}
      step={0.01}
      readout={false}
      minLabel="Lo"
      maxLabel="Hi"
      format={() => 'Lo'}
    />,
  )
  expect(container.querySelector('.aether-param-readout')).toBeNull()
  expect(container.textContent).toMatch(/Lo/)
  expect(container.textContent).toMatch(/Hi/)
  expect(container.textContent).not.toMatch(/%/)
  const hit = screen.getByRole('slider', { name: /tone/i })
  expect(hit.getAttribute('aria-valuetext')).toBe('Lo')
  expect(hit.closest('[data-aether="knob"]')?.getAttribute('data-readout')).toBe('false')
})

test('control CSS binds ink/muted tokens and has no paint hex', () => {
  const css = readFileSync(join(controlsDir, 'controls.css'), 'utf8')
  expect(css.includes('var(--ink)')).toBe(true)
  expect(css.includes('focus-visible')).toBe(true)
  expect(css.includes('min-height: 2.75rem')).toBe(true)
  expect(css.includes('aether-stepper-chevron')).toBe(true)
  expect(css.includes('var(--muted)')).toBe(true)
  expect(css.includes('var(--surface)')).toBe(true)
  expect(css.includes('var(--accent)')).toBe(true)
  expect(css.includes('var(--type-size-name)')).toBe(true)
  expect(css.includes('var(--type-size-value)')).toBe(true)
  expect(css.includes('var(--font-family)')).toBe(true)
  expect(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i.test(css)).toBe(false)
  expect(/rgb\(/i.test(css)).toBe(false)
  expect(/hsl\(/i.test(css)).toBe(false)
  expect(css.toLowerCase().includes('#ff6b00')).toBe(false)

  for (const file of controlSources()) {
    const text = readFileSync(file, 'utf8')
    expect(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i.test(text)).toBe(false)
    expect(/rgb\(/i.test(text)).toBe(false)
    expect(/hsl\(/i.test(text)).toBe(false)
  }

  render(
    <ThemeRoot>
      <Knob name="Cutoff" unit="Hz" value={440} min={0} max={1000} step={1} />
    </ThemeRoot>,
  )
  const name = document.querySelector('.aether-param-name') as HTMLElement
  expect(name).toBeTruthy()
  expect(getComputedStyle(name).color.includes('#ff6b00')).toBe(false)
})

test('value chrome and rotation update from props without a spin wait', () => {
  const { container, rerender } = render(
    <Knob min={0} max={100} step={1} value={0} name="Cutoff" unit="Hz" />,
  )
  expect(container.textContent?.includes('0')).toBe(true)
  const rotor = () =>
    container.querySelector('[data-aether="knob-rotor"]') as HTMLElement
  const first = rotor().style.transform
  rerender(
    <Knob min={0} max={100} step={1} value={100} name="Cutoff" unit="Hz" />,
  )
  expect(container.textContent?.includes('100')).toBe(true)
  expect(rotor().style.transform).not.toBe(first)
  expect(rotor().style.transform.includes('NaN')).toBe(false)

  window.matchMedia = ((query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent() {
        return false
      },
      onchange: null,
    })) as typeof window.matchMedia

  rerender(
    <Knob min={0} max={100} step={1} value={25} name="Cutoff" unit="Hz" />,
  )
  expect(container.textContent?.includes('25')).toBe(true)
  expect(container.textContent?.includes('Cutoff')).toBe(true)
})

test('Home and End jump the range; double-click restores rest', () => {
  const onChange = vi.fn()
  render(<Knob min={0} max={100} step={1} value={40} onChange={onChange} />)
  const hit = screen.getByRole('slider')
  fireEvent.keyDown(hit, { key: 'End' })
  expect(onChange.mock.calls.at(-1)?.[0]).toBe(100)
  fireEvent.keyDown(hit, { key: 'Home' })
  expect(onChange.mock.calls.at(-1)?.[0]).toBe(0)
  fireEvent.doubleClick(hit)
  expect(onChange.mock.calls.at(-1)?.[0]).toBe(40)
})

test('pointer down marks the hit grabbed', () => {
  render(<Knob min={0} max={100} step={1} value={50} onChange={() => {}} />)
  const hit = screen.getByRole('slider')
  fireEvent.pointerDown(hit, { clientX: 10, clientY: 80 })
  expect(hit.getAttribute('data-grabbed')).toBe('true')
  fireEvent.pointerUp(hit, { clientX: 10, clientY: 80 })
  expect(hit.getAttribute('data-grabbed')).toBeNull()
})

test('pointer travel uses a 280px full range', () => {
  const src = readFileSync(join(controlsDir, 'param.ts'), 'utf8')
  expect(src.includes('PIXELS_FOR_FULL_RANGE = 280')).toBe(true)
})
