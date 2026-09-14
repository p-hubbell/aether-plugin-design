import type { ReactNode } from 'react'

import './cell.css'

export type CellProps = {
  /** Named region from the consumer’s `Surface` `areas` template — not a kit topology. */
  area?: string
  column?: number
  row?: number
  columnSpan?: number
  rowSpan?: number
  fill?: boolean
  children?: ReactNode
}

export function Cell({
  area,
  column,
  row,
  columnSpan = 1,
  rowSpan = 1,
  fill = false,
  children,
}: CellProps) {
  const style = area
    ? { gridArea: area }
    : column != null && row != null
      ? {
          gridColumn: `${column} / span ${columnSpan}`,
          gridRow: `${row} / span ${rowSpan}`,
        }
      : undefined

  return (
    <div
      data-aether="cell"
      data-area={area}
      data-fill={fill ? 'true' : undefined}
      className="aether-cell"
      style={style}
    >
      {children}
    </div>
  )
}
