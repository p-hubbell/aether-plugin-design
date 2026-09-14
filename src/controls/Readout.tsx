import { ParamChrome } from './ParamChrome.tsx'

import './controls.css'

export type ReadoutProps = {
  name?: string
  unit?: string
  value: string
}

export function Readout({ name, unit, value }: ReadoutProps) {
  return (
    <div className="aether-param" data-aether="readout">
      <ParamChrome name={name} unit={unit} display={value} />
    </div>
  )
}
