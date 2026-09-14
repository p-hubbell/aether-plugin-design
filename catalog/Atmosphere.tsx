import { createContext, useContext, useState, type ReactNode } from 'react'

import type { Atmosphere } from 'aether-kit'

export type { Atmosphere }

const AtmosphereContext = createContext<{
  atmosphere: Atmosphere
  setAtmosphere: (next: Atmosphere) => void
} | null>(null)

export function useAtmosphere(): Atmosphere {
  return useContext(AtmosphereContext)?.atmosphere ?? 'live'
}

export function useAtmosphereScope() {
  return useContext(AtmosphereContext)
}

export function AtmosphereScope({
  children,
  controls = false,
}: {
  children: ReactNode
  controls?: boolean
}) {
  const parent = useContext(AtmosphereContext)
  const [atmosphere, setAtmosphere] = useState<Atmosphere>('live')
  if (parent) return children
  return (
    <AtmosphereContext.Provider value={{ atmosphere, setAtmosphere }}>
      {controls ? <AtmosphereSwitch /> : null}
      {children}
    </AtmosphereContext.Provider>
  )
}

const OPTIONS: { id: Atmosphere; label: string }[] = [
  { id: 'live', label: 'live' },
  { id: 'still', label: 'still' },
  { id: 'reduce', label: 'reduce' },
]

export function AtmosphereSwitch() {
  const ctx = useContext(AtmosphereContext)
  if (!ctx) return null
  return (
    <div data-catalog="atmosphere" role="group" aria-label="Veil motion">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={ctx.atmosphere === option.id}
          onClick={() => ctx.setAtmosphere(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

