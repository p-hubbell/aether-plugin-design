import type { ReactNode } from 'react'

import './rail.css'

export type RailProps = {
  children?: ReactNode
}

export function Rail({ children }: RailProps) {
  return (
    <div data-aether="rail" className="aether-rail">
      {children}
    </div>
  )
}
