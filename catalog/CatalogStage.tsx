import type { ReactNode } from 'react'

import { SizeFrame } from './SizeFrame.tsx'

export function CatalogStage({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: ReactNode
}) {
  return (
    <div className="catalog-scene" style={{ ['--fixture-width' as string]: `${width}px` }}>
      <SizeFrame width={width} height={height}>
        {children}
      </SizeFrame>
    </div>
  )
}
