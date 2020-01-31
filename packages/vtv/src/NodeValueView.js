import { useState } from 'react'
import Textarea from './Textarea'
import { detectUrl } from './analyze'
import { getState } from './state'
import Link from './Link'
import StringView from './StringView'
import CollectionSummary from './CollectionSummary'

const inputValue = value => {
  if (typeof value === 'string') {
    try {
      JSON.parse(value)
    } catch (e) {
      return value
    }
    return JSON.stringify(value)
  } else {
    return JSON.stringify(value)
  }
}

const InlineValue = React.forwardRef(
  ({ name, value, state, path, onMessage, editing, autoEdit, theme }, ref) => {
    const [newInputValue, setNewInputValue] = useState(inputValue(value))

    const sendAction = (data = {}) => {}

    let newValue
    try {
      newValue = JSON.parse(newInputValue)
    } catch (e) {
      newValue = newInputValue
    }

    const save = () => {
      onMessage({
        path,
        action: 'edit',
        value: newValue,
        editing: false,
      })
    }

    const cancel = () => {
      setNewInputValue(inputValue(value))
      onMessage({
        path,
        action: 'edit',
        editing: false,
      })
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

    let typeClass
    if (typeof newValue === 'string') {
      typeClass = 'string'
    } else if (typeof newValue === 'number') {
      typeClass = 'number'
    } else {
      typeClass = 'value'
    }

    return (
      <div className={typeClass}>
        {autoEdit || editing ? (
          <Textarea
            value={newInputValue}
            onChange={({ target: { value } }) => setNewInputValue(value)}
            onKeyDown={handleKeyPress}
            onBlur={save}
          />
        ) : (
          <span>{value}</span>
        )}

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
          div.number span,
          div.number :global(textarea) {
            color: ${theme.numberColor};
          }
          div.value span,
          div.value :global(textarea) {
            color: ${theme.valueColor};
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
  path,
  onMessage,
  onPickId,
  maxLength = 120,
  autoEdit = true,
  theme,
}) => {
  const { _editing: editing } = getState(state)
  if (editing) {
    return (
      <InlineValue
        name={name}
        value={value}
        state={state}
        path={path}
        onMessage={onMessage}
        editing={editing}
        autoEdit={autoEdit}
        theme={theme}
      />
    )
  } else {
    if (typeof value === 'string') {
      if (detectUrl(value)) {
        return <Link url={value} onPickId={onPickId} theme={theme} />
      } else if (value.length < maxLength || value.indexOf('\n') !== -1) {
        return (
          <InlineValue
            name={name}
            value={value}
            state={state}
            path={path}
            onMessage={onMessage}
            editing={editing}
            autoEdit={autoEdit}
            theme={theme}
          />
        )
      } else {
        return <StringView value={value} maxLength={maxLength} />
      }
    } else if (typeof value === 'object' && value !== null) {
      return (
        <CollectionSummary
          type={Array.isArray(value) ? 'array' : 'object'}
          length={Object.keys(value).length}
          theme={theme}
        />
      )
    } else {
      return (
        <InlineValue
          name={name}
          value={value}
          state={state}
          path={path}
          onMessage={onMessage}
          editing={editing}
          autoEdit={autoEdit}
          theme={theme}
        />
      )
    }
  }
}
