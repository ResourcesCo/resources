import { useState } from 'react'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { getState, getChildState, getNestedState } from './state'
import { hasChildren, detectUrl, displayPath } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import Summary from './Summary'
import lodashGet from 'lodash/get'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
}

const TreeView = ({name, value, state, path = [], commandId, showAll, onMessage, onPickId, theme}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { _expanded: expanded, _viewType: viewType, _showOnly: showOnly } = getState(state)
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
    return <TreeView
      name={displayPath(showOnly)}
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
            onPickId={onPickId}
            name={name}
            value={value}
            state={state}
            path={path}
            commandId={commandId}
            showAll={showAll}
            onMessage={onMessage}
            onClose={() => setMenuOpen(false)}
            theme={theme}
          />
        )
      }
      <LabelButton theme={theme} onClick={() => setMenuOpen(true)}>{name}</LabelButton>
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
      expanded && (isObject(value) || Array.isArray(value)) && viewType === 'tree' && <div className="children">
        {
          Object.keys(value).map(key => (
            <TreeView
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
    {
      expanded && viewType === 'json' && <textarea defaultValue={JSON.stringify(value)} style={{height: 200, width: 350}} />
    }
  </>
}

export default TreeView
