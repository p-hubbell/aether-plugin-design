export function ParamChrome({
  name,
  unit,
  display,
  nameId,
  valueId,
  readout = true,
}: {
  name?: string
  unit?: string
  display: string
  nameId?: string
  valueId?: string
  readout?: boolean
}) {
  return (
    <>
      {name != null ? (
        <span id={nameId} className="aether-param-name">
          {name}
        </span>
      ) : null}
      {readout ? (
        <span className="aether-param-readout">
          <span id={valueId} className="aether-param-value">
            {display}
          </span>
          {unit != null ? <span className="aether-param-unit">{unit}</span> : null}
        </span>
      ) : null}
    </>
  )
}
