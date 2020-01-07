import { useState } from 'react'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { getState, getChildState } from './state'
import { hasChildren, detectUrl } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import Link from './Link'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
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
  const [menuOpen, setMenuOpen] = useState(false)
  const { _expanded: expanded, _viewType: viewType } = getState(state)
  const setExpanded = expanded => {
    onSubmitForm({
      message: '_tree update',
      commandId,
      formData: {
        path,
        state: { ...state, _expanded: expanded }
      }
    })
  }
  const _hasChildren = hasChildren(value)

  return <>
    <div className="row">
      <ExpandButton hasChildren={_hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      {
        (
          menuOpen &&
          <TreeMenu
            onPickId={onPickId}
            name={name}
            value={value}
            state={state}
            path={path}
            onSubmitForm={onSubmitForm}
            commandId={commandId}
            onClose={() => setMenuOpen(false)}
            theme={theme}
          />
        )
      }
      <LabelButton theme={theme} onClick={() => setMenuOpen(true)}>{name}</LabelButton>
      <div className="inline-details">
        {isObject(value) && <CollectionSummary type="object" value={value} />}
        {Array.isArray(value) && <CollectionSummary type="array" value={value} />}
        {typeof value === 'string' && (
          detectUrl(value) ? <Link url={value} onPickId={onPickId} theme={theme} /> : value
        )}
        {value === null && <em>null</em>}
        {typeof value !== 'string' && typeof value !== 'object' && <em>{JSON.stringify(value)}</em>}
        {typeof value === 'undefined' && <em>undefined</em>}
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
      expanded && (isObject(value) || Array.isArray(value)) && viewType === 'tree' && <div className="children">
        {
          Object.keys(value).map(key => (
            <TreeView
              key={key}
              name={key}
              value={value[key]}
              state={getChildState(state, key)}
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
    {
      expanded && viewType === 'table' && <TableView
        value={value}
        onPickId={onPickId}
        theme={theme}
      />
    }
    {
      expanded && viewType === 'json' && <textarea defaultValue={JSON.stringify(value)} style={{height: 200, width: 350}} />
    }
  </>
}

export default TreeView
