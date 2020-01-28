import { isObject } from './analyze'
import { updateTree } from './state'
import NodeView from './NodeView'

export default ({ onChange, onMessage, theme, ...props }) => {
  if (typeof onMessage === 'function' && isObject(theme)) {
    return <NodeView onMessage={onMessage} theme={theme} {...props} />
  } else {
    let themeProp = theme
    let onMessageProp = onMessage
    if (!isObject(themeProp)) {
      themeProp = getTheme(themeProp)
    }
    if (typeof onMessageProp !== 'function') {
      onMessageProp = message => {
        const treeData = {
          name: props.name,
          value: props.value,
          state: props.state,
        }
        onChange(updateTree(treeData, message))
      }
    }
    return <NodeView onMessage={onMessageProp} theme={themeProp} {...props} />
  }
}
