import PropTypes from 'prop-types'
import { getState } from '../model/state'
import InlineValue from './InlineValue'
import Link from './Link'
import CollectionSummary from './CollectionSummary'
import AttachmentView from './AttachmentView'
import { isUrl } from '../model/analyze'

function InlineContent({
  name,
  value,
  state,
  path,
  onMessage,
  onPickId,
  autoEdit = true,
  clipboard,
  theme,
}) {
  const {
    _editingName: editingName,
    _editing: editing,
    _attachments: attachments,
    _error: error,
  } = getState(state)
  if (attachments) {
    return (
      <AttachmentView
        path={path}
        onMessage={onMessage}
        attachments={attachments}
        clipboard={clipboard}
        theme={theme}
      />
    )
  } else if (editing) {
    return (
      <InlineValue
        name={name}
        value={value}
        state={state}
        path={path}
        onMessage={onMessage}
        editing={editing}
        editingName={editingName}
        error={error}
        autoEdit={autoEdit}
        theme={theme}
      />
    )
  } else {
    if (typeof value === 'string' && isUrl(value)) {
      const handleEdit = () => {
        onMessage({
          path,
          action: 'edit',
          editing: true,
        })
      }
      return (
        <Link
          url={value}
          onEdit={handleEdit}
          onPickId={onPickId}
          theme={theme}
        />
      )
    } else if (typeof value === 'object' && value !== null) {
      return (
        <CollectionSummary
          type={Array.isArray(value) ? 'array' : 'object'}
          length={Object.keys(value).length}
          theme={theme}
        />
      )
    } else {
      return (
        <InlineValue
          name={name}
          value={value}
          state={state}
          path={path}
          onMessage={onMessage}
          editing={editing}
          editingName={editingName}
          error={error}
          autoEdit={autoEdit}
          theme={theme}
        />
      )
    }
  }
}

InlineContent.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default InlineContent
