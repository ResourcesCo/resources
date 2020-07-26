import produce from 'immer'
import { draftState, getStateKey } from '../../../../vtv-model/util'

export default function expandRoot(message) {
  return produce(message, draft => {
    if (message.type === 'tree') {
      const showOnly = (message.state || {})._showOnly
      if (Array.isArray(showOnly) && showOnly.length > 0) {
        const parentState = draftState(
          message,
          showOnly.slice(0, showOnly.length - 1)
        )
        const stateKey = getStateKey(showOnly[showOnly.length - 1])
        if (!(parentState[stateKey] && '_expanded' in parentState[stateKey])) {
          draftState(message, showOnly)._expanded = true
        }
      }
      if (!('_expanded' in message.state)) {
        const rootState = draftState(message, [])
        rootState._expanded = true
      }
    }
  })
}
