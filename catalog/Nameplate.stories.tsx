import type { Story } from '@ladle/react'
import { Cell, Nameplate, Surface } from 'aether-kit'

import { CatalogStage } from './CatalogStage.tsx'

export const Blank: Story = () => (
  <CatalogStage width={400} height={160}>
    <Surface areas={`"name"`}>
      <Cell area="name" fill>
        <Nameplate model="Blank" caption="kit" />
      </Cell>
    </Surface>
  </CatalogStage>
)
