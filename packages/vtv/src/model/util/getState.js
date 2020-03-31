export default function getState(state) {
  return {
    _expanded: false,
    _viewType: 'tree',
    ...(state || {}),
  }
}
