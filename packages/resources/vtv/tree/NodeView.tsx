import React, { useState, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { get as getNested } from 'lodash'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  getState,
  getChildState,
  getNestedState,
  joinPath,
  isObject,
  getNodeInfo,
} from 'vtv-model'
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
  displayName = undefined,
  showOnlyPath = [],
  path,
  context: { ruleList, onMessage, theme },
  context,
}) {
  const [viewChanged, setViewChanged] = useState(false)

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

  const { isExpandable, nodeType, stringType, mediaType } = getNodeInfo(
    value,
    state
  )
  const view = state._view || defaultView({ nodeType, stringType, mediaType })

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

  const rules = useMemo(() => ruleList && ruleList.match(path), [
    ruleList,
    path,
  ])

  if (hidden) {
    return null
  } else if (showOnly) {
    const showOnlyParentPath = showOnly.slice(0, showOnly.length - 1)
    const { nodeType: showOnlyParentType } = getNodeInfo(
      getNested(value, showOnlyParentPath),
      getNestedState(state, showOnlyParentPath)
    )
    const showOnlyValue = getNested(value, showOnly)
    const showOnlyState = getNestedState(state, showOnly)

    return (
      <NodeView
        parentType={showOnlyParentPath.length > 0 ? showOnlyParentType : null}
        name={showOnly[showOnly.length - 1]}
        value={showOnlyValue}
        state={showOnlyState}
        displayName={joinPath([...showOnly])}
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
          nodeMenuProps={nodeMenuProps}
          context={context}
        />

        <div className="node-content">
          {actions && (
            <InlineActionView
              value={value}
              actions={actions}
              context={context}
            />
          )}
          <InlineContent
            name={name}
            value={value}
            state={state}
            nodeType={nodeType}
            stringType={stringType}
            mediaType={mediaType}
            path={path}
            rules={rules}
            context={context}
          />
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
            display: flex;
            align-items: center;
            justify-content: flex-start;
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
                {Object.keys(value).map((key) => (
                  <NodeView
                    parentType={nodeType}
                    key={key}
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
