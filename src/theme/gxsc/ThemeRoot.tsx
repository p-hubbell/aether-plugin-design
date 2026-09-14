import type { ReactNode } from 'react'

import './gxsc.css'
import { Veil, type Atmosphere } from './Veil.tsx'

export type { Atmosphere }

export function ThemeRoot({
  children,
  veil = true,
  flush = false,
  atmosphere = 'live',
}: {
  children: ReactNode
  veil?: boolean
  /** Flush stage: no inset. Use inside a sized plugin frame. */
  flush?: boolean
  /** Live weather, frozen sculpture, or reduced-motion preview. */
  atmosphere?: Atmosphere
}) {
  return (
    <div className="aether-gxsc" data-aether="theme" data-atmosphere={atmosphere}>
      {veil ? <Veil atmosphere={atmosphere} /> : null}
      <div className="aether-gxsc-stage" data-flush={flush ? 'true' : undefined}>
        {children}
      </div>
    </div>
  )
}
