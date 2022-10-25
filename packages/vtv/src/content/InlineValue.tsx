import React, { useRef, useState, useEffect } from 'react'
import Textarea from '../generic/Textarea'
import { NODE_CLASS, NODE_NAME_CLASS } from '../util/constants'

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
  nodeType,
  stringType,
  mediaType,
  context: { onMessage, theme },
}) => {
  const inputRef = useRef<HTMLTextAreaElement>()
  const [focused, setFocused] = useState(false)
  const [newInputValue, setNewInputValue] = useState(inputValue(value))
  useEffect(() => {
    setNewInputValue(inputValue(value))
  }, [editing])

  useEffect(() => {
    if (!editingName && editing && inputRef) {
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      )
      inputRef.current.focus()
    }
  }, [editing, editingName, inputRef])

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
      const node = e.target.closest(`.${NODE_CLASS}`) as HTMLElement
      const nodeName = node.querySelector(`.${NODE_NAME_CLASS}`) as HTMLElement
      nodeName.focus()
      e.preventDefault()
      save({ editing: false })
    } else if (e.key === 'Esc' || e.key === 'Escape') {
      const node = e.target.closest(`.${NODE_CLASS}`) as HTMLElement
      const nodeName = node.querySelector(`.${NODE_NAME_CLASS}`) as HTMLElement
      nodeName.focus()
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

  const showStringExcerpt =
    !editing && typeof value === 'string' && value.length > 256

  let typeClass
  if (showStringExcerpt) {
    typeClass = 'excerpt'
  } else if (nodeType === 'string') {
    typeClass = parsed ? 'stringValue' : 'string'
  } else if (nodeType === 'number') {
    typeClass = 'number'
  } else {
    typeClass = 'value'
  }

  const useTextArea = !expanded && !showStringExcerpt && (autoEdit || editing)
  return (
    <div className={`vtv--inline-value vtv--inline-value--${typeClass} ${error ? 'vtv--inline-value--has-error' : ''}`}>
      {useTextArea && (
        <Textarea
          ref={inputRef}
          className="vtv--inline-value--textarea"
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
          wrap="on"
          tabIndex="-1"
        />
      )}
      {showStringExcerpt && (
        <span>{`${value.substring(0, 256)}… (${value.length} characters)`}</span>
      )}
      {!useTextArea && !showStringExcerpt && <span>{value}</span>}
      {error && <span className="vtv--inline-value--error">{error}</span>}
    </div>
  )
}

export default InlineValue
