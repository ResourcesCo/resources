import Menu, { MenuItem } from '../generic/Menu'
import { hasChildren as hasChildrenFn } from '../model/analyze'
import defaultViewFn from '../util/defaultView'

const labels = {
  tree: 'Tree',
  table: 'Table',
  json: 'JSON',
  image: 'Image',
  text: 'Text',
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
    stringType !== 'inline' &&
    (mediaType || '').startsWith('image') &&
    defaultView !== 'image'
  ) {
    result.push('image')
  }
  if (
    nodeType === 'string' &&
    stringType !== 'inline' &&
    defaultView !== 'text'
  ) {
    result.push('text')
  }
  result.push('json')
  return result
}

export default function ViewMenu({
  path,
  value,
  state,
  nodeType,
  stringType,
  mediaType,
  onMessage,
  onViewChanged,
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
        modifiers: { offset: { offset: '0, -3' } },
      }}
      {...props}
    >
      <MenuItem onClick={() => setView(null)} checked={view === null}>
        Default ({labels[defaultView]})
      </MenuItem>
      {availableViews.map(key => {
        if (key === 'table' && !hasChildren) {
          return null
        }
        return (
          <MenuItem
            key={key}
            onClick={() => setView(key)}
            checked={view === key}
          >
            {labels[key]}
          </MenuItem>
        )
      })}
    </Menu>
  )
}
