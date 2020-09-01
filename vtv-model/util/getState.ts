export default function getState(state) {
  return {
    _expanded: false,
    _view: null, // default
    ...(state?._attachments && {
      _attachments: { ...state._attachments, open: true },
    }),
    ...(state || {}),
  }
}
