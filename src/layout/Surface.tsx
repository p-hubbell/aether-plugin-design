import type { CSSProperties, ReactNode } from 'react'

import './surface.css'

export type SurfaceProps = {
  /** Consumer-owned named regions. The kit never ships a plugin topology. */
  areas?: string
  children?: ReactNode
}

const MODULE = '2.75rem'
const ROW_AUTO = `minmax(${MODULE}, auto)`
const ROW_FILL = `minmax(${MODULE}, 1fr)`

export function parseAreaTracks(areas: string): {
  columns: number
  rows: number
  template: string
  rowTracks: string
} | null {
  const cells = areas
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^"+|"+$/g, '').trim().split(/\s+/).filter(Boolean))
  const columns = cells[0]?.length ?? 0
  if (columns === 0 || cells.some((row) => row.length !== columns)) return null
  return {
    columns,
    rows: cells.length,
    template: cells.map((row) => `"${row.join(' ')}"`).join(' '),
    rowTracks: cells.map((row) => rowTrack(row)).join(' '),
  }
}

function rowTrack(row: string[]): string {
  const named = row.filter((cell) => cell !== '.')
  if (named.length > 0 && named.every((cell) => cell === 'name')) return ROW_AUTO
  return ROW_FILL
}

export function Surface({ areas, children }: SurfaceProps) {
  const tracks = areas ? parseAreaTracks(areas) : null
  const gridStyle: CSSProperties = tracks
    ? {
        display: 'grid',
        ['--grid-cols' as string]: String(tracks.columns),
        ['--grid-rows' as string]: String(tracks.rows),
        gridTemplateColumns: `repeat(${tracks.columns}, minmax(${MODULE}, 1fr))`,
        gridTemplateRows: tracks.rowTracks,
        gridTemplateAreas: tracks.template,
      }
    : { display: 'grid' }

  return (
    <div data-aether="surface">
      <div
        data-aether="grid"
        data-modules={tracks ? 'true' : undefined}
        className="aether-surface-grid"
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  )
}
