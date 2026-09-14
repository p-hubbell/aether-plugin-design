import { useState } from 'react'

import { Knob } from 'aether-kit'

import { SizeFrame } from './SizeFrame.tsx'
import { StoryPlate } from './StoryPlate.tsx'

const CARD_PLATE = { width: 280, height: 160 }

export function CatalogSurface() {
  const [hit, setHit] = useState(40)

  return (
    <SizeFrame width={CARD_PLATE.width} height={CARD_PLATE.height}>
        <StoryPlate model="Blank" caption="construction">
        <Knob name="Hit" unit="%" value={hit} min={0} max={100} step={1} onChange={setHit} />
      </StoryPlate>
    </SizeFrame>
  )
}
