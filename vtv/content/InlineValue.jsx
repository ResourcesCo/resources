import React, { useRef, useState, useEffect } from 'react'
import Textarea from '../generic/Textarea'
import { getNodeType } from '../../vtv-model/analyze'

const inputValue = value => {
  if (value === null) {
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
  editing,
  editingName,
  error,
  autoEdit,
  context: { onMessage, theme },
}) => {
  const inputRef = useRef()
  const [focused, setFocused] = useState(false)
  const [newInputValue, setNewInputValue] = useState(inputValue(value))
  useEffect(() => {
    setNewInputValue(inputValue(value))
  }, [editing])

  useEffect(() => {
    if (!editingName && editing && inputRef.current) {
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      )
      inputRef.current.focus()
    }
  }, [editing, inputRef])

  const { _expanded: expanded } = state
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

  const save = (options = {}) => {
    onMessage({
      path,
      action: 'edit',
      value: newValue,
      ...options,
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
      save({ editing: false })
    } else if (e.key === 'Esc' || e.key === 'Escape') {
      e.target.blur()
      e.preventDefault()
      cancel()
    }
  }

  const onFocus = () => {
    setFocused(true)
    save()
  }

  const onBlur = () => {
    setFocused(false)
    setNewInputValue(inputValue(newValue))
    save({ editing: false })
  }

  let typeClass
  const nodeType = getNodeType(newValue)
  if (nodeType === 'string') {
    typeClass = parsed ? 'stringValue' : 'string'
  } else if (nodeType === 'number') {
    typeClass = 'number'
  } else {
    typeClass = 'value'
  }

  const sizeClass = value => {
    if (typeof value !== 'string') {
      return 'full-width'
    } else if (value.length <= 10) {
      return 'small'
    } else if (value.length <= 20) {
      return 'medium'
    } else if (value.length <= 30) {
      return 'large'
    } else {
      return 'full-width'
    }
  }
  const showStringExcerpt = typeof value === 'string' && value.length > 500
  const useTextArea = !expanded && !showStringExcerpt && (autoEdit || editing)
  return (
    <div
      className={`${typeClass} ${error ? 'has-error' : ''} ${
        useTextArea ? sizeClass(newInputValue) : ''
      }`}
    >
      {useTextArea && (
        <Textarea
          ref={inputRef}
          value={
            focused
              ? newInputValue
              : value === null
              ? editing === 'new'
                ? ''
                : 'null'
              : newInputValue
          }
          onChange={({ target: { value } }) => setNewInputValue(value)}
          onKeyDown={handleKeyPress}
          onFocus={onFocus}
          onBlur={onBlur}
          wrap="off"
          tabIndex="-1"
        />
      )}
      {showStringExcerpt && (
        <span>{`${value.substr(0, 50)}… (${value.length} characters)`}</span>
      )}
      {!useTextArea && !showStringExcerpt && <span>{value}</span>}
      {error && <span className="error">{error}</span>}

      <style jsx>{`
        div {
          width: 100%;
          display: flex;
        }
        div :global(textarea) {
          background: none;
          border: none;
          resize: none;
          outline: none;
          font-size: inherit;
          color: ${theme.foreground};
          margin: 0;
          padding: 0;
        }
        div.has-error :global(textarea) {
          border-bottom: 1px solid red;
        }
        div.small :global(textarea) {
          max-width: 80px;
          flex-grow: 1;
        }
        div.medium :global(textarea) {
          max-width: 180px;
          flex-grow: 1;
        }
        div.large :global(textarea) {
          max-width: 250px;
          flex-grow: 1;
        }
        div.full-width :global(textarea) {
          flex-grow: 1;
        }
        div.number span,
        div.number :global(textarea) {
          color: ${theme.numberColor};
        }
        div.value span,
        div.value :global(textarea) {
          color: ${theme.valueColor};
        }
        div.has-error .error {
          color: red;
          padding-left: 3px;
        }
      `}</style>
    </div>
  )
}

export default InlineValue
