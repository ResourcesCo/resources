import { useState, useRef, useEffect } from 'react'
import { Manager, Reference, Popper } from 'react-popper'
import ExpandButton from './ExpandButton'
import LabelButton from './LabelButton'
import { updateTree, getState, getChildState, getNestedState } from './state'
import { hasChildren, detectUrl, displayPath } from './analyze'
import TreeMenu from './TreeMenu'
import TableView from './TableView'
import CodeView from './CodeView'
import Summary from './Summary'
import getNested from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getTheme } from './themes'

const isObject = value => {
  return (
    typeof value === 'object' &&
    typeof value !== 'string' &&
    value !== null &&
    !Array.isArray(value)
  )
}

const TreeView = ({
  parentType = 'root',
  name,
  value,
  state,
  displayName,
  path = [],
  showAll,
  rootNode: rootNodeProp = null,
  onChange,
  onPickId,
  theme: themeProp,
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
  const theme = getTheme(themeProp)

  const rootNode =
    rootNodeProp === null
      ? {
          name,
          value,
          state,
        }
      : rootNodeProp

  const setExpanded = expanded => {
    setViewChanged(true)
    const { value, state } = rootNode
    const { state: newState } = updateTree(
      { value, state },
      { path, state: { _expanded: expanded } }
    )
    onChange({ state: newState })
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
      <TreeView
        parentType={showOnlyParentType}
        name={showOnly[showOnly.length - 1]}
        value={getNested(value, showOnly)}
        state={getNestedState(state, showOnly)}
        displayName={displayPath([name, ...showOnly])}
        showAll={true}
        rootNode={rootNode}
        onChange={onChange}
        onPickId={onPickId}
        path={showOnly}
        theme={theme}
      />
    )
  }

  return (
    <div className="tree" ref={scrollRef}>
      <div className="row">
        <ExpandButton
          hasChildren={_hasChildren}
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
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
                onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
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
            margin: 6px 0;
            align-items: center;
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
                  <TreeView
                    parentType={Array.isArray(value) ? 'array' : 'object'}
                    key={key}
                    name={key}
                    value={value[key]}
                    state={getChildState(state, key)}
                    rootNode={rootNode}
                    onChange={onChange}
                    onPickId={onPickId}
                    path={[...path, key]}
                    theme={theme}
                  />
                ))}
                <style jsx>{`
                  .children {
                    padding-left: 10px;
                  }
                `}</style>
              </div>
            )}
          {expanded && viewType === 'table' && (
            <TableView
              name={name}
              value={value}
              state={state}
              onPickId={onPickId}
              onChange={onChange}
              theme={theme}
            />
          )}
        </>
      )}
      {editingJson && (
        <CodeView
          open={expanded}
          path={path}
          value={value}
          onChange={onChange}
          theme={theme}
        />
      )}
    </div>
  )
}

export default TreeView
