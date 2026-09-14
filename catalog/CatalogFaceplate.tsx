import { useState } from 'react'

import { Cell, Knob, Meter, Nameplate, Pad, Surface } from 'aether-kit'

import { SizeFrame } from './SizeFrame.tsx'
import { CATALOG_FIXTURES } from './frames.ts'

const INSERT_AREAS = `
  "name  name  name  name  name"
  "in    axis  hero  trim  out"
  "in    latch hero  trim  out"
`

const fixture = CATALOG_FIXTURES.standard

export function CatalogFaceplate() {
  const [drive, setDrive] = useState(0.4)
  const [tone, setTone] = useState(0)
  const [trim, setTrim] = useState(0.85)
  const [match, setMatch] = useState(true)
  const inLevel = 0.35
  const outLevel = match ? 0.32 : 0.55

  return (
    <SizeFrame width={fixture.width} height={fixture.height}>
      <Surface areas={INSERT_AREAS}>
        <Cell area="name" fill>
          <Nameplate model="Insert" caption="insert" />
        </Cell>
        <Cell area="in" fill>
          <Meter name="In" level={inLevel} />
        </Cell>
        <Cell area="axis">
          <Knob
            name="Tone"
            value={tone}
            min={0}
            max={1}
            step={0.01}
            readout={false}
            minLabel="Lo"
            maxLabel="Hi"
            format={(n) => (n <= 0 ? 'Lo' : n >= 1 ? 'Hi' : 'Blend')}
            onChange={setTone}
          />
        </Cell>
        <Cell area="hero">
          <Knob
            size="hero"
            name="Drive"
            unit="%"
            value={drive}
            min={0}
            max={1}
            step={0.01}
            format={(n) => (n * 100).toFixed(0)}
            onChange={setDrive}
          />
        </Cell>
        <Cell area="trim">
          <Knob
            size="dial"
            name="Output"
            unit="%"
            value={trim}
            min={0}
            max={1}
            step={0.01}
            format={(n) => (n * 100).toFixed(0)}
            onChange={setTrim}
          />
        </Cell>
        <Cell area="latch">
          <Pad name="Match" mark="M" pressed={match} onChange={setMatch} />
        </Cell>
        <Cell area="out" fill>
          <Meter name="Out" level={outLevel} />
        </Cell>
      </Surface>
    </SizeFrame>
  )
}
