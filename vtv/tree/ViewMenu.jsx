import Menu, { MenuItem, Separator } from '../generic/Menu'
import { hasChildren as hasChildrenFn } from '../model/analyze'
import defaultViewFn from '../util/defaultView'
import { codeTypes } from '../model/constants'

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
}) {
  const result = [defaultView]
  if (['object', 'array'].includes(nodeType) && hasChildren) {
    result.push('table')
  }
  if (
    nodeType === 'string' &&
    (mediaType || '').startsWith('image') &&
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
      onClose={() => null}
      popperProps={{
        placement: 'left-end',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      {codeTypes.map(({ name, mediaType: itemMediaType }) => (
        <MenuItem
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
      onClose={() => null}
      popperProps={{
        placement: 'left-end',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      {hiddenKeys.map(key => (
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
  showAll,
  onViewChanged,
  context: { onMessage },
  context,
  ...props
}) {
  const setView = view => {
    onMessage({
      path,
      action: 'setView',
      view,
    })
    onViewChanged()
  }
  const { _view: view } = state
  const defaultView = defaultViewFn({ nodeType, stringType, mediaType })
  const hasChildren = hasChildrenFn(value)
  const availableViews = getAvailableViews({
    defaultView,
    nodeType,
    stringType,
    mediaType,
    hasChildren,
  })
  const hiddenKeys =
    nodeType === 'object' ? getHiddenKeys(value, state) : undefined
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      <MenuItem onClick={() => setView(null)} checked={view === null}>
        Default ({labels[defaultView]})
      </MenuItem>
      {availableViews.map(key => {
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
      {!showAll && path.length > 0 && (
        <MenuItem onClick={() => onMessage({ action: 'showOnlyThis', path })}>
          Show only this
        </MenuItem>
      )}
      {!showAll && path.length > 0 && parentType === 'object' && (
        <MenuItem
          onClick={() => onMessage({ action: 'setHidden', path, hidden: true })}
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
      {showAll && (
        <MenuItem onClick={() => onMessage({ action: 'showAll' })}>
          Show all
        </MenuItem>
      )}
    </Menu>
  )
}
