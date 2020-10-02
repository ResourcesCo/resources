import View from 'vtv'
import { joinPath, State } from 'vtv-model'
import { FunctionComponent } from 'react'

interface TreeProps {
  name?: string
  value?: any
  state?: State
  [key: string]: any
}

const Tree: FunctionComponent<TreeProps> = ({
  name = 'root',
  value,
  state = { _expanded: true },
  rules = undefined,
  onMessage,
  commandId,
  onPickId,
  message,
  onSubmitForm,
  codeMirrorComponent,
  theme,
}) => {
  const onChange = ({ name, value, state }) => {
    onMessage({
      type: 'tree-update',
      name,
      value,
      state,
      parentCommandId: commandId,
    })
  }

  const handlePickId = (pathOrString) => {
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
        rules={rules}
        theme={theme.base}
        onChange={onChange}
        onAction={(m) => onSubmitForm({ commandId, message, formData: m })}
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

export default Tree
