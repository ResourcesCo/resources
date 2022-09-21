import View from 'vtv'
import { State } from 'vtv-model'
import { FunctionComponent } from 'react'
import { encodePointer } from 'json-ptr'

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
      onPickId(encodePointer(['messages', commandId, ...pathOrString]))
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
