export const CATALOG_FIXTURES = {
  compact: { name: 'compact', width: 560, height: 400 },
  standard: { name: 'standard', width: 800, height: 440 },
  wide: { name: 'wide', width: 1000, height: 520 },
} as const

export type CatalogFixtureName = keyof typeof CATALOG_FIXTURES

export const CATALOG_FIXTURE_NAMES = Object.keys(
  CATALOG_FIXTURES,
) as CatalogFixtureName[]
