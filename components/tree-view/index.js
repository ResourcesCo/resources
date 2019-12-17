import { useState } from 'react'
import ExpandButton from './expand-button'
import LabelButton from './label-button'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
}

const testHasChildren = value => {
  if (isObject(value)) {
    return Object.keys(value).length > 0
  } else if (Array.isArray(value)) {
    return value.length > 0
  } else {
    return false
  }
}

const TreeView = ({name, value, path = [], message, commandId, onSubmitForm, theme}) => {
  const expanded = value.__vtv_expanded === true
  const setExpanded = expanded => {
    onSubmitForm({message, commandId, formData: {path, expanded}})
  }
  const hasChildren = testHasChildren(value)

  return <>
    <div className="row">
      <ExpandButton hasChildren={hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      <LabelButton theme={theme}>{name}</LabelButton>
      <div className="inline-details">
        {isObject(value) && (hasChildren ? <em>({Object.keys(value).length} items)</em> : '{}')}
        {Array.isArray(value) && (hasChildren ? <em>({Object.keys(value).length} items)</em> : '[]')}
        {typeof value === 'string' && value}
        {value === null && <em>null</em>}
        {typeof value !== 'string' && typeof value !== 'object' && <em>{JSON.stringify(value)}</em>}
      </div>
      <style jsx>{`
        .inline-details {
          margin-left: 10px;
        }
        .row {
          display: flex;
        }
      `}</style>
    </div>
    {
      expanded && (isObject(value) || Array.isArray(value)) && <div className="children">
        {
          Object.keys(value).filter(key => key !== '__vtv_expanded').map(key => (
            <TreeView
              key={key}
              name={key}
              value={value[key]}
              message={message}
              commandId={commandId}
              onSubmitForm={onSubmitForm}
              path={[...path, key]}
              theme={theme}
            />
          ))
        }
        <style jsx>{`
          .children {
            padding-left: 10px;
          }
        `}</style>
      </div>
    }
  </>
}

export default TreeView
