export default function getState(state) {
  return {
    _expanded: false,
    _view: null, // default
    ...(state || {}),
  }
}
