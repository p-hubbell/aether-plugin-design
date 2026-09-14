import type { GlobalProvider } from '@ladle/react'

import { ThemeRoot } from 'aether-kit'
import 'aether-kit'

import '../catalog/plates.css'

export const Provider: GlobalProvider = ({ children }) => (
  <ThemeRoot veil={false}>{children}</ThemeRoot>
)
