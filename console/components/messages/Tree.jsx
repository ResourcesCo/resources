import View, { joinPath } from 'vtv'

export default function Tree({
  name,
  value,
  state = { _expanded: true },
  onMessage,
  commandId,
  onPickId,
  message,
  onSubmitForm,
  codeMirrorComponent,
  theme,
}) {
  const onChange = ({ name, value, state }) => {
    onMessage({
      type: 'tree-update',
      name,
      value,
      state,
      parentCommandId: commandId,
    })
  }

  const handlePickId = pathOrString => {
    if (typeof pathOrString === 'string') {
      onPickId(pathOrString)
    } else {
      onPickId(joinPath(['messages', commandId, ...pathOrString]))
    }
  }

  return (
    <div>
      <View
        name={name}
        value={value}
        state={state}
        theme={theme}
        onChange={onChange}
        onAction={m => onSubmitForm({ commandId, message, formData: m })}
        onPickId={handlePickId}
        codeMirrorComponent={codeMirrorComponent}
      />
      <style jsx>{`
        div {
          margin: 5px 0;
        }
      `}</style>
    </div>
  )
}
