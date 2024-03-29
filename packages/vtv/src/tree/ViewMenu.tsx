import React from 'react'
import Menu, { MenuItem, Separator } from '../generic/Menu'
import { getNodeState, hasChildren as hasChildrenFn, isUrl, codeTypes } from 'vtv-model'
import defaultViewFn from '../util/defaultView'

const labels = {
  tree: 'Tree',
  table: 'Table',
  json: 'JSON',
  image: 'Image',
  text: 'Text',
  code: 'Code',
}

function getAvailableViews({
  defaultView,
  nodeType,
  stringType,
  mediaType,
  hasChildren,
  value,
}) {
  const result = [defaultView]
  const valueIsUrl = isUrl(value)
  if (['object', 'array'].includes(nodeType) && hasChildren) {
    result.push('table')
  }
  if (
    nodeType === 'string' &&
    ((mediaType || '').startsWith('image') || valueIsUrl) &&
    defaultView !== 'image'
  ) {
    result.push('image')
  }
  if (nodeType === 'string') {
    if (defaultView !== 'text') {
      result.push('text')
    }
    if (defaultView !== 'code') {
      result.push('code')
    }
  }
  result.push('json')
  return result
}

function CodeMenu({
  path,
  mediaType,
  context: { onMessage },
  context,
  ...props
}) {
  return (
    <Menu
      context={context}
      {...props}
    >
      {codeTypes.map(({ name, mediaType: itemMediaType }) => (
        <MenuItem
          key={itemMediaType}
          onClick={() =>
            onMessage({
              action: 'setView',
              path,
              view: 'code',
              mediaType: itemMediaType,
            })
          }
          checked={itemMediaType === mediaType}
        >
          {name}
        </MenuItem>
      ))}
    </Menu>
  )
}

function ShowHiddenMenu({
  path,
  hiddenKeys,
  context: { onMessage },
  context,
  ...props
}) {
  return (
    <Menu
      context={context}
      {...props}
    >
      {hiddenKeys.map((key) => (
        <MenuItem
          key={key}
          onClick={() =>
            onMessage({
              action: 'setHidden',
              path: [...path, key],
              hidden: false,
            })
          }
        >
          {key}
        </MenuItem>
      ))}
    </Menu>
  )
}

function getHiddenKeys(value, state) {
  let hiddenKeys
  for (const key of Object.keys(value)) {
    if (state[key] && state[key]._hidden === true) {
      if (!hiddenKeys) {
        hiddenKeys = []
      }
      hiddenKeys.push(key)
    }
  }
  return hiddenKeys
}

export default function ViewMenu({
  path,
  value,
  state,
  nodeType,
  stringType,
  mediaType,
  parentType,
  onViewChanged,
  context: { onMessage },
  context,
  ...props
}) {
  const setView = (view) => {
    onMessage({
      path,
      action: 'setView',
      view,
    })
    onViewChanged()
  }
  const { view } = getNodeState(state)
  const defaultView = defaultViewFn({ nodeType, stringType, mediaType })
  const hasChildren = hasChildrenFn(value)
  const availableViews = getAvailableViews({
    defaultView,
    nodeType,
    stringType,
    mediaType,
    hasChildren,
    value,
  })
  const hiddenKeys =
    nodeType === 'object' ? getHiddenKeys(value, state) : undefined
  return (
    <Menu
      context={context}
      {...props}
    >
      <MenuItem
        onClick={() => setView(null)}
        checked={view === null}
        context={context}
      >
        Default ({labels[defaultView]})
      </MenuItem>
      {availableViews.map((key) => {
        if (key === 'table' && !hasChildren) {
          return null
        } else if (key === 'code') {
          return (
            <MenuItem
              key={key}
              checked={view === key}
              submenu={
                <CodeMenu
                  mediaType={mediaType}
                  path={path}
                  context={context}
                  {...props}
                />
              }
            >
              Code
            </MenuItem>
          )
        } else {
          return (
            <MenuItem
              key={key}
              onClick={() => setView(key)}
              checked={view === key}
            >
              {labels[key]}
            </MenuItem>
          )
        }
      })}
      <Separator />
      {path.length > 0 && (
        <MenuItem onClick={() => onMessage({ action: 'showOnlyThis', path })}>
          Show only this
        </MenuItem>
      )}
      {path.length > 0 && parentType === 'object' && (
        <MenuItem
          onClick={() => onMessage({ action: 'setHidden', path, hidden: true })}
          context={context}
        >
          Hide
        </MenuItem>
      )}
      {hiddenKeys && (
        <MenuItem
          submenu={
            <ShowHiddenMenu
              path={path}
              hiddenKeys={hiddenKeys}
              context={context}
              {...props}
            />
          }
        >
          Show hidden
        </MenuItem>
      )}
      {
        <MenuItem
          onClick={() => onMessage({ action: 'showAll' })}
          context={context}
        >
          Show all
        </MenuItem>
      }
    </Menu>
  )
}
