import PropTypes from 'prop-types'
import InlineValue from './InlineValue'
import Link from './Link'
import CollectionSummary from './CollectionSummary'
import AttachmentView from './AttachmentView'
import { isUrl, getState } from 'vtv-model'

function ValueInlineContent({
  name,
  value,
  state,
  path,
  autoEdit: autoEditParam = true,
  nodeType,
  mediaType,
  stringType,
  context: { onMessage, rules },
  context,
}) {
  const {
    _editingName: editingName,
    _editing: editing,
    _attachments: attachments,
    _error: error,
  } = getState(state)

  const autoEdit =
    nodeType === 'string' && stringType !== 'inline' ? false : autoEditParam

  if (attachments) {
    return <AttachmentView path={path} context={context} />
  } else if (editing) {
    return (
      <InlineValue
        name={name}
        value={value}
        state={state}
        path={path}
        editing={editing}
        editingName={editingName}
        error={error}
        autoEdit={autoEdit}
        nodeType={nodeType}
        mediaType={mediaType}
        stringType={stringType}
        context={context}
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
      return <Link url={value} onEdit={handleEdit} context={context} />
    } else if (typeof value === 'object' && value !== null) {
      return (
        <CollectionSummary
          type={Array.isArray(value) ? 'array' : 'object'}
          length={Object.keys(value).length}
          context={context}
        />
      )
    } else {
      return (
        <InlineValue
          name={name}
          value={value}
          state={state}
          path={path}
          nodeType={nodeType}
          mediaType={mediaType}
          stringType={stringType}
          editing={editing}
          editingName={editingName}
          error={error}
          autoEdit={autoEdit}
          context={context}
        />
      )
    }
  }
}

ValueInlineContent.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ValueInlineContent
