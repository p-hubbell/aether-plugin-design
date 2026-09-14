import { useState } from 'react'

import {
  Cell,
  Knob,
  Nameplate,
  Pad,
  Rail,
  Slider,
  Stepper,
  Surface,
} from 'aether-kit'

const FILTER_TYPES = ['low-pass', 'band-pass', 'high-pass'] as const

const FILTER_FACEPLATE_AREAS = `
  "name name name"
  "hero hero rail"
  "eq   eq   rail"
`

export function CatalogScene({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const [cutoff, setCutoff] = useState(440)
  const [mix, setMix] = useState(0.35)
  const [bypass, setBypass] = useState(false)
  const [filterType, setFilterType] = useState<string>('low-pass')
  const [eqLow, setEqLow] = useState(0)
  const [eqMid, setEqMid] = useState(0)
  const [eqHigh, setEqHigh] = useState(0)

  const eqFormat = (n: number) => (n > 0 ? `+${n.toFixed(0)}` : n.toFixed(0))

  return (
    <Surface key={`${width}x${height}`} areas={FILTER_FACEPLATE_AREAS}>
      <Cell area="name" fill>
        <Nameplate model="Prism" caption="filter" />
      </Cell>
      <Cell area="hero">
        <Knob
          size="dial"
          name="Cutoff"
          unit="Hz"
          value={cutoff}
          min={20}
          max={2000}
          step={1}
          onChange={setCutoff}
        />
      </Cell>
      <Cell area="rail" fill>
        <Rail>
          <Stepper
            name="Type"
            options={FILTER_TYPES}
            value={filterType}
            onChange={setFilterType}
          />
          <Pad
            name="Bypass"
            pressed={bypass}
            onText="out"
            offText="in"
            mark={bypass ? 'out' : 'in'}
            onChange={setBypass}
          />
          <Slider
            name="Mix"
            unit="%"
            value={mix}
            min={0}
            max={1}
            step={0.01}
            format={(n) => (n * 100).toFixed(0)}
            onChange={setMix}
          />
        </Rail>
      </Cell>
      <Cell area="eq" fill>
        <div className="face-eq">
          <Knob
            name="Low"
            unit="dB"
            value={eqLow}
            min={-12}
            max={12}
            step={1}
            format={eqFormat}
            onChange={setEqLow}
          />
          <Knob
            name="Mid"
            unit="dB"
            value={eqMid}
            min={-12}
            max={12}
            step={1}
            format={eqFormat}
            onChange={setEqMid}
          />
          <Knob
            name="High"
            unit="dB"
            value={eqHigh}
            min={-12}
            max={12}
            step={1}
            format={eqFormat}
            onChange={setEqHigh}
          />
        </div>
      </Cell>
    </Surface>
  )
}
