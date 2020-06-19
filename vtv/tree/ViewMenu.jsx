import Menu, { MenuItem } from '../generic/Menu'
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

export default function ViewMenu({
  path,
  value,
  state,
  nodeType,
  stringType,
  mediaType,
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
                  onMessage={onMessage}
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
    </Menu>
  )
}
