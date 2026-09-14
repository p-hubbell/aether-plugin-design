import { useEffect, useId, useRef, useState } from 'react'
import './veil.css'

export type Atmosphere = 'live' | 'still' | 'reduce'

function FogLayer({
  id,
  seed,
  frequency,
  layer,
}: {
  id: string
  seed: number
  frequency: string
  layer: 'bank' | 'sheet' | 'curl'
}) {
  const filter = `${id}-${layer}`
  return (
    <svg className="aether-fog" data-layer={layer} aria-hidden="true">
      <defs>
        <filter
          id={filter}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={frequency}
            numOctaves="4"
            seed={seed}
            stitchTiles="stitch"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="22" result="soft" />
          <feComponentTransfer in="soft" result="billow">
            <feFuncA type="table" tableValues="0 0.05 0.35 0.75 0.55 0.2 0.05 0" />
          </feComponentTransfer>
          <feColorMatrix
            in="billow"
            type="matrix"
            values={
              layer === 'bank'
                ? '0 0 0 0 0.28  0 0 0 0 0.32  0 0 0 0 0.36  0 0 0 0.92 0'
                : '0 0 0 0 0.99  0 0 0 0 0.995  0 0 0 0 1  0 0 0 0.95 0'
            }
          />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${filter})`} />
    </svg>
  )
}

export function Veil({ atmosphere = 'live' }: { atmosphere?: Atmosphere }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const freeze = atmosphere !== 'live'
  const [paused, setPaused] = useState(freeze)
  const fogId = `fog${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const applyMotion = () => setPaused(freeze || Boolean(motion?.matches))
    applyMotion()
    motion?.addEventListener('change', applyMotion)

    const onVis = () => {
      if (document.hidden) setPaused(true)
      else applyMotion()
    }
    document.addEventListener('visibilitychange', onVis)

    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) setPaused(true)
          else applyMotion()
        },
        { threshold: 0.02 },
      )
      io.observe(host)
    }

    return () => {
      motion?.removeEventListener('change', applyMotion)
      document.removeEventListener('visibilitychange', onVis)
      io?.disconnect()
    }
  }, [freeze])

  return (
    <div
      ref={hostRef}
      className="aether-veil"
      data-aether="veil"
      data-atmosphere={atmosphere}
      data-paused={paused ? 'true' : undefined}
      aria-hidden="true"
    >
      <FogLayer id={fogId} layer="bank" seed={2} frequency="0.003 0.005" />
      <FogLayer id={fogId} layer="sheet" seed={7} frequency="0.0045 0.007" />
      <FogLayer id={fogId} layer="curl" seed={13} frequency="0.007 0.004" />
      <div className="aether-bloom" />
      <div className="aether-haze" />
      <div className="aether-grain" />
    </div>
  )
}
