import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import getNested from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getState, getChildState, getNestedState } from '../model/state'
import {
  hasChildren as hasChildrenFn,
  joinPath,
  isObject,
  getNodeType,
  getStringType,
  getMediaType,
} from '../model/analyze'
import ExpandButton from './ExpandButton'
import NodeNameView from './NodeNameView'
import InlineContent from '../content/InlineContent'
import NodeMenuButton from './NodeMenuButton'
import TableView from '../table/TableView'
import BlockContent from '../content/BlockContent'
import ActionButton from '../generic/ActionButton'
import defaultView from '../util/defaultView'

const expandWidth = 30

function NodeView({
  parentType = null,
  name,
  value,
  state: _state,
  options,
  displayName,
  showOnlyPath = [],
  path = [],
  showAll,
  onMessage,
  onPickId,
  clipboard,
  codeMirrorComponent,
  theme,
}) {
  const [viewChanged, setViewChanged] = useState(false)

  const state = getState(_state)
  const {
    _expanded: expanded,
    _showOnly: showOnly,
    _editingName: editingName,
    _actions: actions,
  } = state
  const { dotMenu } = options

  const toggleExpanded = () => {
    setViewChanged(true)
    onMessage({ path, state: { _expanded: !expanded } })
  }

  const scrollRef = useRef(null)

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
  }, [expanded, view])

  const hasChildren = hasChildrenFn(value)
  let isExpandable = hasChildren
  const nodeType = getNodeType(value)
  let stringType = null
  let mediaType = null
  if (nodeType === 'string') {
    stringType = getStringType(value)
    isExpandable = stringType !== 'inline'
    if (stringType !== 'inline') {
      mediaType =
        typeof state._mediaType === 'string'
          ? state._mediaType
          : getMediaType(value)
    }
  }
  const view = state._view || defaultView({ nodeType, stringType, mediaType })

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
        codeMirrorComponent={codeMirrorComponent}
        theme={theme}
      />
    )
  }

  const indent = 12 * (path.length - showOnlyPath.length)

  const nodeMenuProps = {
    parentType,
    nodeType,
    stringType,
    mediaType,
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
          disabled={!isExpandable}
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
          <InlineContent
            name={name}
            value={value}
            state={state}
            path={path}
            onMessage={onMessage}
            onPickId={onPickId}
            clipboard={clipboard}
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
      {view !== 'json' && (
        <>
          {expanded &&
            (isObject(value) || Array.isArray(value)) &&
            view === 'tree' && (
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
                    codeMirrorComponent={codeMirrorComponent}
                    theme={theme}
                  />
                ))}
              </div>
            )}
          {expanded && view === 'table' && (
            <div style={{ paddingLeft: indent }}>
              <TableView
                name={name}
                value={value}
                path={path}
                state={state}
                onPickId={onPickId}
                onMessage={onMessage}
                clipboard={clipboard}
                theme={theme}
              />
            </div>
          )}
        </>
      )}
      {expanded && ['json', 'text', 'code', 'image'].includes(view) && (
        <div
          style={{
            paddingLeft: indent + expandWidth,
            paddingTop: 5,
            paddingBottom: 5,
            marginRight: 15,
          }}
        >
          <BlockContent
            view={view}
            path={path}
            value={value}
            state={state}
            nodeType={nodeType}
            stringType={stringType}
            mediaType={mediaType}
            onMessage={onMessage}
            codeMirrorComponent={codeMirrorComponent}
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
