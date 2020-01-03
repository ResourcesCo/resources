import { useState } from 'react'
import ExpandButton from './expand-button'
import LabelButton from './label-button'
import { getState } from './state'

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

const CollectionSummary = ({type, value}) => {
  const length = Object.keys(value).length
  if (length === 0) {
    return <span>{type === 'object' ? '{}' : '[]'}</span>
  } else {
    return <em>({length} {length === 1 ? 'item' : 'items'})</em>
  }
}

const TreeView = ({name, value, state, path = [], commandId, onSubmitForm, onPickId, theme}) => {
  const { expanded } = getState(state, path)
  const setExpanded = expanded => {
    const expandedPaths = ((state || {}).expanded || [])
    const newState = {
      ...state,
      expanded: (
        expanded ?
        [...expandedPaths, path] :
        expandedPaths.filter(e => !(e.length === path.length && e.every((item, i) => item === path[i])))
      )
    }
    onSubmitForm({
      message: '_tree update',
      commandId,
      formData: {
        path,
        state: newState
      }
    })
  }
  const hasChildren = testHasChildren(value)

  return <>
    <div className="row">
      <ExpandButton hasChildren={hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      <LabelButton theme={theme} onClick={() => onPickId(name)}>{name}</LabelButton>
      <div className="inline-details">
        {isObject(value) && <CollectionSummary type="object" value={value} />}
        {Array.isArray(value) && <CollectionSummary type="array" value={value} />}
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
              state={state}
              commandId={commandId}
              onSubmitForm={onSubmitForm}
              onPickId={onPickId}
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
