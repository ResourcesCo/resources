import { useState } from 'react'
import Textarea from '../util/Textarea'
import { detectUrl } from './analyze'
import { getState } from './state'
import Link from './Link'
import StringView from './StringView'

const CollectionSummary = ({ type, length, theme }) => {
  return (
    <span>
      {type === 'object' ? '{' : '['}
      {length > 0 && `${length} ${length === 1 ? 'item' : 'items'}`}
      {type === 'object' ? '}' : ']'}
      <style jsx>{`
        color: ${theme.summaryColor};
      `}</style>
    </span>
  )
}

const ValueEdit = React.forwardRef(
  ({ name, value, state, commandId, path, onMessage, theme }, ref) => {
    const [newValue, setNewValue] = useState(`${value}`)

    const sendAction = (data = {}) => {
      onMessage({
        type: 'tree-update',
        path,
        action: 'edit',
        editing: false,
        treeCommandId: commandId,
        ...data,
      })
    }

    const save = () => {
      let value
      try {
        value = JSON.parse(newValue)
      } catch (e) {
        value = newValue
      }
      sendAction({
        value,
      })
    }

    const cancel = () => {
      sendAction()
    }

    const handleKeyPress = e => {
      if (e.key === 'Enter' && e.shiftKey === false) {
        e.preventDefault()
        save()
      } else if (e.key === 'Esc' || e.key === 'Escape') {
        e.preventDefault()
        cancel()
      }
    }

    return (
      <div>
        <Textarea
          value={newValue}
          onChange={({ target: { value } }) => setNewValue(value)}
          onKeyDown={handleKeyPress}
          onBlur={save}
          autoFocus
        />
        <style jsx>{`
          div {
            width: 100%;
          }
          div :global(textarea) {
            background: none;
            border: none;
            resize: none;
            outline: none;
            width: 100%;
            font-size: inherit;
          }
        `}</style>
      </div>
    )
  }
)

export default ({
  name,
  value,
  state,
  commandId,
  path,
  onMessage,
  onPickId,
  theme,
}) => {
  const { _editing: editing } = getState(state)
  if (editing) {
    return (
      <ValueEdit
        name={name}
        value={value}
        state={state}
        path={path}
        commandId={commandId}
        onMessage={onMessage}
        theme={theme}
      />
    )
  } else {
    if (typeof value === 'string') {
      if (detectUrl(value)) {
        return <Link url={value} onPickId={onPickId} theme={theme} />
      } else {
        return <StringView value={value} maxLength={120} />
      }
    } else if (typeof value === 'object' && value !== null) {
      return (
        <CollectionSummary
          type={Array.isArray(value) ? 'array' : 'object'}
          length={Object.keys(value).length}
          theme={theme}
        />
      )
    } else if (typeof value === 'number') {
      return (
        <span>
          {`${value}`}
          <style jsx>{`
            span {
              color: ${theme.numberColor};
            }
          `}</style>
        </span>
      )
    } else {
      return (
        <span>
          {`${value}`}
          <style jsx>{`
            span {
              color: ${theme.valueColor};
            }
          `}</style>
        </span>
      )
    }
  }
}
