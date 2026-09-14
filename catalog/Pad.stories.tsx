import { useState } from 'react'

import type { Story } from '@ladle/react'
import { ControlBank, Pad } from 'aether-kit'

import { CatalogStage } from './CatalogStage.tsx'
import { StoryPlate } from './StoryPlate.tsx'

export const Hits: Story = () => {
  const [idle, setIdle] = useState(false)
  const [on, setOn] = useState(true)
  return (
    <CatalogStage width={400} height={280}>
      <StoryPlate caption="pads">
        <Pad name="Off" pressed={idle} onChange={setIdle} />
        <Pad name="On" pressed={on} onChange={setOn} />
        <ControlBank label="Pads">
          <Pad name="A" pressed={idle} onChange={setIdle} />
          <Pad name="B" pressed={on} onChange={setOn} />
        </ControlBank>
      </StoryPlate>
    </CatalogStage>
  )
}
