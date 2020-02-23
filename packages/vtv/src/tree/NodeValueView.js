import { useRef, useState, useEffect } from 'react'
import Textarea from '../generic/Textarea'
import { detectUrl } from '../model/analyze'
import { getState } from '../model/state'
import Link from '../value/Link'
import StringView from '../value/StringView'
import CollectionSummary from '../value/CollectionSummary'

const inputValue = value => {
  if (typeof value === 'string') {
    if (/^\s*$/.test(value) || /\n|\t/.test(value)) {
      return JSON.stringify(value)
    }
    try {
      JSON.parse(value)
    } catch (e) {
      return `${value}`
    }
    return JSON.stringify(value)
  } else {
    return JSON.stringify(value)
  }
}

const InlineValue = React.forwardRef(
  (
    {
      name,
      value,
      state,
      path,
      onMessage,
      editing,
      editingJson,
      autoEdit,
      theme,
    },
    ref
  ) => {
    const [newInputValue, setNewInputValue] = useState(inputValue(value))

    useEffect(() => {
      setNewInputValue(inputValue(value))
    }, [editingJson])

    const sendAction = (data = {}) => {}

    let newValue, parsed
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

    const onBlur = () => {
      setNewInputValue(inputValue(newValue))
      save()
    }

    let typeClass
    if (typeof newValue === 'string') {
      typeClass = parsed ? 'stringValue' : 'string'
    } else if (typeof newValue === 'number') {
      typeClass = 'number'
    } else {
      typeClass = 'value'
    }

    return (
      <div className={typeClass}>
        {!editingJson && (autoEdit || editing) ? (
          <Textarea
            value={newInputValue}
            onChange={({ target: { value } }) => setNewInputValue(value)}
            onKeyDown={handleKeyPress}
            onBlur={onBlur}
            wrap="off"
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
  autoEdit = true,
  theme,
}) => {
  const { _editing: editing, _editingJson: editingJson } = getState(state)
  if (editing) {
    return (
      <InlineValue
        name={name}
        value={value}
        state={state}
        path={path}
        onMessage={onMessage}
        editing={editing}
        editingJson={editingJson}
        autoEdit={autoEdit}
        theme={theme}
      />
    )
  } else {
    if (typeof value === 'string') {
      if (detectUrl(value)) {
        return <Link url={value} onPickId={onPickId} theme={theme} />
      } else {
        return (
          <InlineValue
            name={name}
            value={value}
            state={state}
            path={path}
            onMessage={onMessage}
            editing={editing}
            editingJson={editingJson}
            autoEdit={autoEdit}
            theme={theme}
          />
        )
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
          editingJson={editingJson}
          autoEdit={autoEdit}
          theme={theme}
        />
      )
    }
  }
}
