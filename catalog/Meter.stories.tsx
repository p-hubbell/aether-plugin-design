import type { Story } from '@ladle/react'
import { Meter } from 'aether-kit'

import { CatalogStage } from './CatalogStage.tsx'
import { StoryPlate } from './StoryPlate.tsx'

export const In: Story = () => (
  <CatalogStage width={280} height={220}>
    <StoryPlate caption="meter">
      <Meter name="In" level={0.35} />
    </StoryPlate>
  </CatalogStage>
)
