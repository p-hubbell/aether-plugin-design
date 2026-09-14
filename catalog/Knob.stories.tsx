import { useState, type ReactNode } from 'react'

import type { Story } from '@ladle/react'
import { Knob } from 'aether-kit'

import { SizeFrame } from './SizeFrame.tsx'
import { StoryPlate } from './StoryPlate.tsx'

const HIT_FRAMES = {
  knob: { width: 280, height: 220 },
  dial: { width: 400, height: 300 },
  hero: { width: 560, height: 400 },
} as const

function KitPlate({
  caption,
  frame,
  children,
}: {
  caption: string
  frame: (typeof HIT_FRAMES)[keyof typeof HIT_FRAMES]
  children: ReactNode
}) {
  return (
    <div className="catalog-scene" style={{ ['--fixture-width' as string]: `${frame.width}px` }}>
      <SizeFrame width={frame.width} height={frame.height}>
        <StoryPlate caption={caption}>{children}</StoryPlate>
      </SizeFrame>
      <p className="aether-operate-hint">Shift fine · Home min · End max · double-click rest</p>
    </div>
  )
}

export const Compact: Story = () => {
  const [value, setValue] = useState(440)
  return (
    <KitPlate caption="knob" frame={HIT_FRAMES.knob}>
      <Knob
        size="knob"
        name="Rate"
        unit="Hz"
        value={value}
        min={20}
        max={2000}
        step={1}
        onChange={setValue}
      />
    </KitPlate>
  )
}

export const Dial: Story = () => {
  const [value, setValue] = useState(440)
  return (
    <KitPlate caption="dial" frame={HIT_FRAMES.dial}>
      <Knob
        size="dial"
        name="Rate"
        unit="Hz"
        value={value}
        min={20}
        max={2000}
        step={1}
        onChange={setValue}
      />
    </KitPlate>
  )
}

export const Hero: Story = () => {
  const [value, setValue] = useState(0.4)
  return (
    <KitPlate caption="hero" frame={HIT_FRAMES.hero}>
      <Knob
        size="hero"
        name="Drive"
        unit="%"
        value={value}
        min={0}
        max={1}
        step={0.01}
        format={(n) => (n * 100).toFixed(0)}
        onChange={setValue}
      />
    </KitPlate>
  )
}
