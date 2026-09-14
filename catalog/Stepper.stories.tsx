import { useState } from 'react'

import type { Story } from '@ladle/react'
import { Stepper } from 'aether-kit'

import { CatalogStage } from './CatalogStage.tsx'
import { StoryPlate } from './StoryPlate.tsx'

const OPTIONS = ['slow', 'sync', 'free'] as const

export const Mode: Story = () => {
  const [value, setValue] = useState<string>('sync')
  return (
    <CatalogStage width={400} height={220}>
      <StoryPlate caption="stepper">
        <Stepper name="Mode" options={OPTIONS} value={value} onChange={setValue} />
      </StoryPlate>
    </CatalogStage>
  )
}
