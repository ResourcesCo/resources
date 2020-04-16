import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Manager, Reference, Popper } from 'react-popper'
import getNested from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getState, getChildState, getNestedState } from '../model/state'
import {
  hasChildren,
  detectUrl,
  joinPath,
  isObject,
  getNodeType,
} from '../model/analyze'
import ExpandButton from './ExpandButton'
import NodeNameView from './NodeNameView'
import NodeValueView from './NodeValueView'
import NodeMenuButton from './NodeMenuButton'
import NodeMenu from './NodeMenu'
import TableView from '../table/TableView'
import CodeView from '../value/CodeView'
import AttachmentView from '../value/AttachmentView'
import ActionButton from '../generic/ActionButton'

function NodeView({
  parentType = null,
  name,
  value,
  state,
  options,
  displayName,
  showOnlyPath = [],
  path = [],
  showAll,
  onMessage,
  onPickId,
  clipboard,
  theme,
}) {
  const [viewChanged, setViewChanged] = useState(false)

  const {
    _expanded: expanded,
    _viewType: viewType,
    _showOnly: showOnly,
    _editingName: editingName,
    _editingJson: editingJson,
    _attachments: attachments,
    _actions: actions,
    _error: error,
  } = getState(state)
  const { bubbleMenu, dotMenu } = options

  const toggleExpanded = () => {
    setViewChanged(true)
    if (editingJson) {
      return
    }
    onMessage({ path, state: { _expanded: !expanded } })
  }

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

  const _hasChildren = hasChildren(value)
  const nodeType = getNodeType(value)

  if (showOnly) {
    const showOnlyParent = showOnly.slice(0, showOnly.length - 1)
    const showOnlyParentType =
      showOnlyParent.length > 0
        ? Array.isArray(getNested(value, showOnlyParent))
          ? 'array'
          : 'object'
        : null
    return (
      <NodeView
        parentType={showOnlyParentType}
        name={showOnly[showOnly.length - 1]}
        value={getNested(value, showOnly)}
        state={getNestedState(state, showOnly)}
        options={options}
        displayName={joinPath([name, ...showOnly])}
        showAll={true}
        showOnlyPath={showOnly}
        onMessage={onMessage}
        onPickId={onPickId}
        path={showOnly}
        clipboard={clipboard}
        theme={theme}
      />
    )
  }

  const indent = 12 * (path.length - showOnlyPath.length)

  const nodeMenuProps = {
    parentType,
    nodeType,
    name,
    value,
    state,
    path,
    showAll,
    onMessage,
    onViewChanged: () => setViewChanged(true),
    onPickId,
    clipboard,
    theme,
  }

  return (
    <div className="tree" ref={scrollRef}>
      <div
        className={`row level-${path.length}`}
        style={{ paddingLeft: indent }}
        tabIndex={0}
      >
        <ExpandButton
          hasChildren={_hasChildren}
          expanded={expanded}
          onClick={toggleExpanded}
          theme={theme}
        />
        <NodeNameView
          editingName={editingName}
          name={name}
          displayName={displayName}
          path={path}
          value={value}
          parentType={parentType}
          onMessage={onMessage}
          nodeMenuProps={nodeMenuProps}
          options={options}
          theme={theme}
        />
        {actions && (
          <div className="actions-content">
            {actions.map(({ name, title, primary }) => (
              <ActionButton
                key={name}
                primary={primary}
                onClick={() =>
                  onMessage({ action: 'runAction', actionName: name })
                }
                theme={theme}
              >
                {title}
              </ActionButton>
            ))}
          </div>
        )}

        <div className="node-content">
          <NodeValueView
            name={name}
            value={value}
            state={state}
            path={path}
            onMessage={onMessage}
            onPickId={onPickId}
            theme={theme}
          />
        </div>
        <div className="actions-right">
          {dotMenu && (
            <NodeMenuButton nodeMenuProps={nodeMenuProps} theme={theme} />
          )}
        </div>
        <style jsx>{`
          .node-content {
            margin-left: 10px;
            flex-grow: 1;
          }
          .actions-content {
            margin-left: 10px;
          }
          .row {
            display: flex;
            margin: 0 0;
            padding-top: 3px;
            padding-bottom: 3px;
            align-items: center;
            outline: none;
          }
          .actions-right {
            visibility: hidden;
            margin-right: 5px;
          }
          .error {
            color: red;
          }
          .row:hover {
            background-color: ${theme.backgroundHover};
          }
          .row:focus-within {
            background-color: ${theme.backgroundActive};
          }
          .row:hover .actions-right,
          .row:focus-within .actions-right {
            visibility: visible;
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
                    parentType={nodeType}
                    key={[key, value[key], getChildState(state, key)]}
                    name={key}
                    value={value[key]}
                    state={getChildState(state, key)}
                    options={options}
                    onMessage={onMessage}
                    onPickId={onPickId}
                    path={[...path, key]}
                    showOnlyPath={showOnlyPath}
                    clipboard={clipboard}
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
                path={path}
                state={state}
                onPickId={onPickId}
                onMessage={onMessage}
                theme={theme}
              />
            </div>
          )}
        </>
      )}
      {attachments && attachments.open && (
        <div
          style={{
            paddingLeft: indent,
            paddingTop: 5,
            paddingBottom: 5,
            marginRight: 15,
          }}
        >
          <AttachmentView
            open={expanded}
            path={path}
            value={value}
            onMessage={onMessage}
            theme={theme}
          />
        </div>
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

NodeView.propTypes = {
  clipboard: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
}

export default NodeView
