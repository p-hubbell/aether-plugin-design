import type { ReactNode } from 'react'

import { Cell, Nameplate, Surface } from 'aether-kit'

const STORY_AREAS = `
  "name"
  "hit"
`

export function StoryPlate({
  model = 'Aether',
  caption,
  children,
}: {
  model?: string
  caption: string
  children?: ReactNode
}) {
  return (
    <Surface areas={STORY_AREAS}>
      <Cell area="name" fill>
        <Nameplate model={model} caption={caption} />
      </Cell>
      {children != null ? <Cell area="hit">{children}</Cell> : null}
    </Surface>
  )
}
