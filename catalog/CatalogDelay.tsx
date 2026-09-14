import { useState } from 'react'

import {
  Cell,
  ControlBank,
  Knob,
  Nameplate,
  Pad,
  Rail,
  Readout,
  Slider,
  Stepper,
  Surface,
} from 'aether-kit'

const SYNC_MODES = ['free', 'sync'] as const
const DIVISIONS = ['1/4', '1/8', '1/16', '1/8.'] as const

type Division = (typeof DIVISIONS)[number]

const DELAY_FACEPLATE_AREAS = `
  "name name name"
  "time time mix"
  "bank bank mix"
`

export function CatalogDelay({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const [timeMs, setTimeMs] = useState(375)
  const [feedback, setFeedback] = useState(42)
  const [mix, setMix] = useState(0.62)
  const [clock, setClock] = useState<string>('sync')
  const [division, setDivision] = useState<Division>('1/8')
  const synced = clock === 'sync'

  return (
    <div className="catalog-delay" data-clock={clock}>
      <Surface key={`${width}x${height}`} areas={DELAY_FACEPLATE_AREAS}>
        <Cell area="name" fill>
          <Nameplate model="Hold" caption="delay" />
        </Cell>
        <Cell area="time">
          {synced ? (
            <Readout name="Time" value={division} />
          ) : (
            <Knob
              size="dial"
              name="Time"
              unit="ms"
              value={timeMs}
              min={1}
              max={2000}
              step={1}
              onChange={setTimeMs}
            />
          )}
        </Cell>
        <Cell area="mix" fill>
          <Rail>
            <Stepper name="Clock" options={SYNC_MODES} value={clock} onChange={setClock} />
            <Knob
              name="Feedback"
              unit="%"
              value={feedback}
              min={0}
              max={100}
              step={1}
              onChange={setFeedback}
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
        <Cell area="bank" fill>
          <ControlBank label="Division" exclusive disabled={!synced}>
            {DIVISIONS.map((note) => (
              <Pad
                key={note}
                choice
                name={note}
                mark={note}
                pressed={division === note}
                onChange={synced ? () => setDivision(note) : undefined}
              />
            ))}
          </ControlBank>
        </Cell>
      </Surface>
    </div>
  )
}
