import { useState, useRef, useEffect } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { getState, getChildState, getNestedState } from './state'
import { hasChildren, detectUrl, displayPath, isObject } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import CodeView from './CodeView'
import Summary from './Summary'
import getNested from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getTheme } from './themes'

const NodeView = ({
  parentType = 'root',
  name,
  value,
  state,
  displayName,
  showOnlyPath = [],
  path = [],
  showAll,
  onMessage,
  onPickId,
  theme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewChanged, setViewChanged] = useState(false)

  const {
    _expanded: expanded,
    _viewType: viewType,
    _showOnly: showOnly,
    _editingName: editingName,
    _editingJson: editingJson,
  } = getState(state)

  const toggleExpanded = () => {
    setViewChanged(true)
    if (editingJson) {
      return
    }
    onMessage({ path, state: { _expanded: !expanded } })
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
    const showOnlyParentType =
      showOnlyParent.length > 0
        ? Array.isArray(getNested(value, showOnlyParent))
          ? 'array'
          : 'object'
        : 'root'
    return (
      <NodeView
        parentType={showOnlyParentType}
        name={showOnly[showOnly.length - 1]}
        value={getNested(value, showOnly)}
        state={getNestedState(state, showOnly)}
        displayName={displayPath([name, ...showOnly])}
        showAll={true}
        showOnlyPath={showOnly}
        onMessage={onMessage}
        onPickId={onPickId}
        path={showOnly}
        theme={theme}
      />
    )
  }

  const indent = 10 * (path.length - showOnlyPath.length)

  return (
    <div className="tree" ref={scrollRef}>
      <div
        className={`row level-${path.length}`}
        style={{ paddingLeft: indent }}
      >
        <ExpandButton
          hasChildren={_hasChildren}
          expanded={expanded}
          onClick={toggleExpanded}
        />
        <Manager>
          <Reference>
            {({ ref }) => (
              <LabelButton
                ref={ref}
                onClick={() => setMenuOpen(true)}
                editingName={editingName}
                name={name}
                displayName={displayName}
                path={path}
                value={value}
                onMessage={onMessage}
                theme={theme}
              />
            )}
          </Reference>
          {menuOpen && (
            <TreeMenu
              parentType={parentType}
              name={name}
              value={value}
              state={state}
              path={path}
              showAll={showAll}
              onMessage={onMessage}
              onViewChanged={() => setViewChanged(true)}
              onPickId={onPickId}
              onClose={() => setMenuOpen(false)}
              theme={theme}
            />
          )}
        </Manager>
        <div className="inline-details">
          <Summary
            name={name}
            value={value}
            state={state}
            path={path}
            onMessage={onMessage}
            onPickId={onPickId}
            theme={theme}
          />
        </div>
        <style jsx>{`
          .inline-details {
            margin-left: 10px;
            flex-grow: 1;
          }
          .row {
            display: flex;
            margin: 0 0;
            padding-top: 3px;
            padding-bottom: 3px;
            align-items: center;
          }
          .row:hover {
            background-color: ${theme.backgroundHover};
          }
        `}</style>
      </div>
      {!editingJson && (
        <>
          {expanded &&
            (isObject(value) || Array.isArray(value)) &&
            viewType === 'tree' && (
              <div className="children">
                {Object.keys(value).map(key => (
                  <NodeView
                    parentType={Array.isArray(value) ? 'array' : 'object'}
                    key={key}
                    name={key}
                    value={value[key]}
                    state={getChildState(state, key)}
                    onMessage={onMessage}
                    onPickId={onPickId}
                    path={[...path, key]}
                    showOnlyPath={showOnlyPath}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          {expanded && viewType === 'table' && (
            <div style={{ paddingLeft: indent }}>
              <TableView
                name={name}
                value={value}
                state={state}
                onPickId={onPickId}
                onMessage={onMessage}
                theme={theme}
              />
            </div>
          )}
        </>
      )}
      {editingJson && (
        <div
          style={{
            paddingLeft: indent,
            paddingTop: 5,
            paddingBottom: 5,
            marginRight: 15,
          }}
        >
          <CodeView
            open={expanded}
            path={path}
            value={value}
            onMessage={onMessage}
            theme={theme}
          />
        </div>
      )}
    </div>
  )
}

export default NodeView
