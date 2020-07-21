import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import getNested from 'lodash/get'
import scrollIntoView from 'scroll-into-view-if-needed'
import { getState, getChildState, getNestedState } from '../../vtv-model/state'
import {
  hasChildren as hasChildrenFn,
  joinPath,
  isObject,
  getNodeType,
  getStringType,
  getMediaType,
} from '../../vtv-model/analyze'
import ExpandButton from './ExpandButton'
import NodeNameView from './NodeNameView'
import InlineContent from '../content/InlineContent'
import NodeMenuButton from './NodeMenuButton'
import TableView from '../table/TableView'
import BlockContent from '../content/BlockContent'
import InlineActionView from '../content/InlineActionView'
import defaultView from '../util/defaultView'

const expandWidth = 30

function NodeView({
  parentType = null,
  name,
  value,
  state: _state,
  displayName,
  showOnlyPath = [],
  path = [],
  showAll,
  context,
}) {
  const [viewChanged, setViewChanged] = useState(false)
  const { onMessage, theme } = context

  const state = getState(_state)
  const {
    _expanded: expanded,
    _showOnly: showOnly,
    _editingName: editingName,
    _actions: actions,
    _hidden: hidden,
  } = state
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
    isExpandable =
      stringType !== 'inline' || ['text', 'code', 'image'].includes(state._view)
    if (isExpandable) {
      mediaType =
        typeof state._mediaType === 'string'
          ? state._mediaType
          : getMediaType(value)
    }
  }
  const view = state._view || defaultView({ nodeType, stringType, mediaType })

  if (hidden) {
    return null
  } else if (showOnly) {
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
        displayName={joinPath([name, ...showOnly])}
        showAll={true}
        showOnlyPath={showOnly}
        path={showOnly}
        context={context}
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
    onViewChanged: () => setViewChanged(true),
    context,
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
          context={context}
        />
        <NodeNameView
          editingName={editingName}
          name={name}
          displayName={displayName}
          path={path}
          value={value}
          parentType={parentType}
          nodeMenuProps={nodeMenuProps}
          context={context}
        />

        <div className="node-content">
          <InlineContent
            name={name}
            value={value}
            state={state}
            path={path}
            context={context}
          />
          {actions && (
            <InlineActionView
              value={value}
              actions={actions}
              context={context}
            />
          )}
        </div>
        <div className="actions-right">
          <NodeMenuButton nodeMenuProps={nodeMenuProps} />
        </div>
        <style jsx>{`
          .node-content {
            margin-left: 10px;
            margin-right: 10px;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
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
                    path={[...path, key]}
                    showOnlyPath={showOnlyPath}
                    context={context}
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
                context={context}
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
            context={context}
          />
        </div>
      )}
    </div>
  )
}

NodeView.propTypes = {
  context: PropTypes.object.isRequired,
}

export default NodeView
