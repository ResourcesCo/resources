import { useState, useRef, useEffect } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { getState, getChildState, getNestedState } from './state'
import { hasChildren, detectUrl, displayPath } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import CodeView from './CodeView'
import Summary from './Summary'
import lodashGet from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'

const isObject = value => {
  return typeof value === 'object' && typeof value !== 'string' && value !== null && !Array.isArray(value)
}

const TreeView = ({parentType = 'root', name, displayName, value, state, path = [], commandId, showAll, onMessage, onPickId, theme}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewChanged, setViewChanged] = useState(false)
  const {
    _expanded: expanded,
    _viewType: viewType,
    _showOnly: showOnly,
    _editingName: editingName,
    _editingJson: editingJson
  } = getState(state)

  const setExpanded = expanded => {
    setViewChanged(true)
    onMessage({
      type: 'tree-update',
      path,
      state: { _expanded: expanded },
      treeCommandId: commandId,
    })
  }
  const _hasChildren = hasChildren(value)

  const scrollRef = useRef(null)
  const anchorRef = useRef(null)

  useEffect(() => {
    if (viewChanged && expanded && scrollRef.current) {
      setTimeout(() => {
        scrollIntoView(scrollRef.current, {
          behavior: 'smooth',
          block: 'start',
          scrollMode: 'if-needed',
        })
      }, 10)
    }
  }, [expanded, editingJson, viewType])

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

  return <div ref={scrollRef}>
    <div className="row">
      <ExpandButton hasChildren={_hasChildren} expanded={expanded} onClick={() => setExpanded(!expanded)} />
      <Manager>
        <Reference>
          {({ref}) => (
            <LabelButton
              ref={ref}
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
          )}
        </Reference>
        {( menuOpen &&
          <Popper placement="bottom">
            {({ref, style, placement}) => (
              <div ref={ref} style={style} data-placement={placement}>
                <TreeMenu
                  parentType={parentType}
                  name={name}
                  value={value}
                  state={state}
                  path={path}
                  commandId={commandId}
                  showAll={showAll}
                  onMessage={onMessage}
                  onViewChanged={() => setViewChanged(true)}
                  onPickId={onPickId}
                  onClose={() => setMenuOpen(false)}
                  theme={theme}
                />
              </div>
            )}
          </Popper>
        )}
      </Manager>
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
  </div>
}

export default TreeView
