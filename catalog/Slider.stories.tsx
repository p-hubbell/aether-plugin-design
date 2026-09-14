import { useState } from 'react'

import type { Story } from '@ladle/react'
import { Slider } from 'aether-kit'

import { CatalogStage } from './CatalogStage.tsx'
import { StoryPlate } from './StoryPlate.tsx'

export const Mix: Story = () => {
  const [value, setValue] = useState(0.35)
  return (
    <CatalogStage width={400} height={220}>
      <StoryPlate caption="slider">
        <Slider
          name="Mix"
          unit="%"
          value={value}
          min={0}
          max={1}
          step={0.01}
          format={(n) => (n * 100).toFixed(0)}
          onChange={setValue}
        />
      </StoryPlate>
    </CatalogStage>
  )
}
