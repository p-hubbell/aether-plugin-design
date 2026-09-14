import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { PLACEHOLDER_LABEL, Placeholder } from './index.ts'

test('kit public entry exports a placeholder', () => {
  render(<Placeholder />)
  expect(screen.getByText(PLACEHOLDER_LABEL)).toBeTruthy()
})
