import { CatalogDelay } from './CatalogDelay.tsx'
import { CatalogScene } from './CatalogScene.tsx'
import { AtmosphereScope, AtmosphereSwitch } from './Atmosphere.tsx'
import type { CatalogFixtureName } from './frames.ts'
import { CATALOG_FIXTURES } from './frames.ts'
import { SizeFrame } from './SizeFrame.tsx'

export function CatalogPlates({
  fixture,
}: {
  fixture: (typeof CATALOG_FIXTURES)[CatalogFixtureName]
}) {
  return (
    <AtmosphereScope>
      <div
        className="catalog-scene catalog-plates"
        style={{ ['--fixture-width' as string]: `${fixture.width}px` }}
      >
        <AtmosphereSwitch />
        <div className="catalog-plates-row">
          <SizeFrame width={fixture.width} height={fixture.height}>
            <CatalogScene width={fixture.width} height={fixture.height} />
          </SizeFrame>
          <SizeFrame width={fixture.width} height={fixture.height}>
            <CatalogDelay width={fixture.width} height={fixture.height} />
          </SizeFrame>
        </div>
      </div>
    </AtmosphereScope>
  )
}
