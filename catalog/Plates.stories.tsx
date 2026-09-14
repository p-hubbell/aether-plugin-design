import type { Story } from '@ladle/react'

import { CatalogDelay } from './CatalogDelay.tsx'
import { CatalogPlates } from './CatalogPlates.tsx'
import { CatalogScene } from './CatalogScene.tsx'
import { CatalogStage } from './CatalogStage.tsx'
import { CATALOG_FIXTURES, type CatalogFixtureName } from './frames.ts'

export const Prism: Story<{ fixture: CatalogFixtureName }> = ({ fixture }) => {
  const box = CATALOG_FIXTURES[fixture]
  return (
    <CatalogStage width={box.width} height={box.height}>
      <CatalogScene width={box.width} height={box.height} />
    </CatalogStage>
  )
}

Prism.storyName = 'Prism'
Prism.args = { fixture: 'standard' }
Prism.argTypes = {
  fixture: {
    options: ['compact', 'standard', 'wide'],
    control: { type: 'select' },
    defaultValue: 'standard',
  },
}

export const Hold: Story<{ fixture: CatalogFixtureName }> = ({ fixture }) => {
  const box = CATALOG_FIXTURES[fixture]
  return (
    <CatalogStage width={box.width} height={box.height}>
      <CatalogDelay width={box.width} height={box.height} />
    </CatalogStage>
  )
}

Hold.storyName = 'Hold'
Hold.args = { fixture: 'standard' }
Hold.argTypes = Prism.argTypes

export const Pair: Story<{ fixture: CatalogFixtureName }> = ({ fixture }) => (
  <CatalogPlates fixture={CATALOG_FIXTURES[fixture]} />
)

Pair.storyName = 'Pair'
Pair.args = { fixture: 'standard' }
Pair.argTypes = Prism.argTypes
