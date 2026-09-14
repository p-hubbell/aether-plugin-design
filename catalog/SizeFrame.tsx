import type { CSSProperties, ReactNode } from 'react'

import { ThemeRoot, type Atmosphere } from 'aether-kit'

import {
  AtmosphereScope,
  AtmosphereSwitch,
  useAtmosphere,
  useAtmosphereScope,
} from './Atmosphere.tsx'

export type SizeFrameProps = {
  width: number
  height: number
  children?: ReactNode
  atmosphere?: Atmosphere
}

export function SizeFrame({ width, height, children, atmosphere }: SizeFrameProps) {
  const parent = useAtmosphereScope()
  const frame = (
    <SizeFrameInner width={width} height={height} atmosphere={atmosphere} showSwitch={!parent && atmosphere === undefined}>
      {children}
    </SizeFrameInner>
  )
  if (parent) return frame
  return <AtmosphereScope>{frame}</AtmosphereScope>
}

function SizeFrameInner({
  width,
  height,
  children,
  atmosphere: atmosphereProp,
  showSwitch,
}: SizeFrameProps & { showSwitch: boolean }) {
  const fromContext = useAtmosphere()
  const atmosphere = atmosphereProp ?? fromContext
  const hostStyle = {
    ['--frame-w']: `${width}px`,
    ['--frame-h']: `${height}px`,
  } as CSSProperties

  const frameStyle: CSSProperties = {
    width,
    height,
    boxSizing: 'border-box',
    overflow: 'hidden',
    flex: 'none',
  }

  return (
    <div data-catalog="size-frame-stack">
      {showSwitch ? <AtmosphereSwitch /> : null}
      <div data-catalog="size-frame-host" data-atmosphere={atmosphere} style={hostStyle}>
        <div data-catalog="size-frame-slot">
          <div data-catalog="size-frame" style={frameStyle}>
            <ThemeRoot flush atmosphere={atmosphere}>
              {children}
            </ThemeRoot>
          </div>
        </div>
      </div>
    </div>
  )
}
