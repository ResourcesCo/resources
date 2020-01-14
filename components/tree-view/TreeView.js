import { useState } from 'react'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { getState, getChildState, getNestedState } from './state'
import { hasChildren, detectUrl, displayPath } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import CodeView from './CodeView'
import Summary from './Summary'
import lodashGet from 'lodash/get'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
}

const TreeView = ({parentType = 'root', name, displayName, value, state, path = [], commandId, showAll, onMessage, onPickId, theme}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const {
    _expanded: expanded,
    _viewType: viewType,
    _showOnly: showOnly,
    _editingName: editingName,
    _editingJson: editingJson
  } = getState(state)
  const setExpanded = expanded => {
    onMessage({
      type: 'tree-update',
      path,
      state: { _expanded: expanded },
      treeCommandId: commandId,
    })
  }
  const _hasChildren = hasChildren(value)

  if (showOnly) {
    const showOnlyParent = showOnly.slice(0, showOnly.length - 1)
    const showOnlyParentType = (
      showOnlyParent.length > 0 ?
      (Array.isArray(lodashGet(value, showOnlyParent)) ? 'array' : 'object') :
      'root'
    )
    return <TreeView
      parentType={showOnlyParentType}
      name={showOnly[showOnly.length - 1]}
      displayName={displayPath([name, ...showOnly])}
      value={lodashGet(value, showOnly)}
      state={getNestedState(state, showOnly)}
      commandId={commandId}
      showAll={true}
      onMessage={onMessage}
      onPickId={onPickId}
      path={showOnly}
      theme={theme}
    />
  }

  return <>
    <div className="row">
      <ExpandButton hasChildren={_hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      {
        (
          menuOpen &&
          <TreeMenu
            parentType={parentType}
            name={name}
            value={value}
            state={state}
            path={path}
            commandId={commandId}
            showAll={showAll}
            onMessage={onMessage}
            onPickId={onPickId}
            onClose={() => setMenuOpen(false)}
            theme={theme}
          />
        )
      }
      <LabelButton
        onClick={() => setMenuOpen(true)}
        editingName={editingName}
        commandId={commandId}
        name={name}
        displayName={displayName}
        path={path}
        value={value}
        onMessage={onMessage}
        theme={theme}
      />
      <div className="inline-details">
        <Summary
          value={value}
          onPickId={onPickId}
          theme={theme}
        />
      </div>
      <style jsx>{`
        .inline-details {
          margin-left: 10px;
        }
        .row {
          display: flex;
          margin: 6px 0;
        }
      `}</style>
    </div>
    {
      !editingJson && <>
        {
          expanded && (isObject(value) || Array.isArray(value)) && viewType === 'tree' && <div className="children">
            {
              Object.keys(value).map(key => (
                <TreeView
                  parentType={Array.isArray(value) ? 'array' : 'object'}
                  key={key}
                  name={key}
                  value={value[key]}
                  state={getChildState(state, key)}
                  commandId={commandId}
                  onMessage={onMessage}
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
      </>
    }
    {
      editingJson && <CodeView
        open={expanded}
        commandId={commandId}
        path={path}
        value={value}
        onMessage={onMessage}
        theme={theme}
      />
    }
  </>
}

export default TreeView
