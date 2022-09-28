import React, { useState, useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { get as getNested, isObject } from 'lodash-es'
import scrollIntoView from 'scroll-into-view-if-needed'
import {
  getNodeState,
  getChildState,
  getNestedState,
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

  const state = getNodeState(_state)
  const {
    expanded,
    showOnly,
    editingName,
    actions,
    hidden,
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
  const view = state.view || defaultView({ nodeType, stringType, mediaType })

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
      getNestedState(_state, showOnlyParentPath)
    )
    const showOnlyValue = getNested(value, showOnly)
    const showOnlyState = getNestedState(_state, showOnly)

    return (
      <NodeView
        parentType={showOnlyParentPath.length > 0 ? showOnlyParentType : null}
        name={showOnly[showOnly.length - 1]}
        value={showOnlyValue}
        state={showOnlyState}
        displayName={[...showOnly].join('/')}
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
        className={`vtv--node-view--row level-${path.length}`}
        style={{ paddingLeft: indent }}
        tabIndex={-1}
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

        <div className="vtv--node-view--content">
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
            state={_state}
            nodeType={nodeType}
            stringType={stringType}
            mediaType={mediaType}
            path={path}
            rules={rules}
            context={context}
          />
        </div>
        <div className="vtv--node-view--actions-right">
          <NodeMenuButton nodeMenuProps={nodeMenuProps} />
        </div>
      </div>
      {view !== 'json' && (
        <>
          {expanded &&
            (isObject(value) || Array.isArray(value)) &&
            view === 'tree' && (
              <div className="vtv--node-view--children">
                {Object.keys(value).map((key) => (
                  <NodeView
                    parentType={nodeType}
                    key={key}
                    name={key}
                    value={value[key]}
                    state={getChildState(_state, key)}
                    path={[...path, key]}
                    showOnlyPath={showOnlyPath}
                    context={context}
                  />
                ))}
              </div>
            )}
          {expanded && view === 'table' && (
            <div className="vtv--node-view--children" style={{ paddingLeft: indent }}>
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
          className="vtv--node-view--children vtv--node-view--block-content"
          style={{
            paddingLeft: indent + expandWidth,
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
