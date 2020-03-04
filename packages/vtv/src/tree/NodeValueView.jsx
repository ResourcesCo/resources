import React, { useRef, useState, useEffect } from 'react'
import Textarea from '../generic/Textarea'
import { detectUrl } from '../model/analyze'
import { getState } from '../model/state'
import Link from '../value/Link'
import StringView from '../value/StringView'
import CollectionSummary from '../value/CollectionSummary'

const inputValue = (value, isNew = false) => {
  if (isNew && value === null) {
    return ''
  } else if (typeof value === 'string') {
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

const InlineValue = ({
  name,
  value,
  state,
  path,
  onMessage,
  editing,
  editingJson,
  isNew,
  autoEdit,
  theme,
}) => {
  const inputRef = useRef()
  const [newInputValue, setNewInputValue] = useState(inputValue(value, isNew))
  useEffect(() => {
    setNewInputValue(inputValue(value))
  }, [editingJson])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      )
      inputRef.current.focus()
    }
  }, [editing, inputRef])

  const sendAction = (data = {}) => {}
  let newValue
  let parsed = false
  if (newInputValue === '') {
    newValue = null
  } else {
    try {
      newValue = JSON.parse(newInputValue)
      parsed = true
    } catch (e) {
      newValue = newInputValue
    }
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
      e.target.blur()
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
          ref={inputRef}
          value={newInputValue}
          onChange={({ target: { value } }) => setNewInputValue(value)}
          onKeyDown={handleKeyPress}
          onBlur={onBlur}
          wrap="off"
          tabIndex="-1"
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
          color: ${theme.foreground};
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
  const {
    _editing: editing,
    _editingJson: editingJson,
    _isNew: isNew,
  } = getState(state)
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
    if (typeof value === 'string' && detectUrl(value)) {
      const handleEdit = () => {
        onMessage({
          path,
          action: 'edit',
          editing: true,
        })
      }
      return (
        <Link
          url={value}
          onEdit={handleEdit}
          onPickId={onPickId}
          theme={theme}
        />
      )
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
          isNew={isNew}
          autoEdit={autoEdit}
          theme={theme}
        />
      )
    }
  }
}
