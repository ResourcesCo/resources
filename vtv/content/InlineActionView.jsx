import ActionButton from '../generic/ActionButton'

function InlineActionView({
  value,
  actions,
  context: { onMessage, onPickId },
  context,
}) {
  return (
    <div className="actions-content">
      {actions.map(({ name, title, primary, action }) => (
        <ActionButton
          key={name}
          primary={primary}
          onClick={() =>
            action === 'pasteIntoConsole'
              ? onPickId(value)
              : onMessage({ action: 'runAction', actionName: name })
          }
          context={context}
        >
          {title}
        </ActionButton>
      ))}
      <style jsx>{`
        .actions-content {
          margin-left: 10px;
          margin-right: 10px;
        }
        .actions-content :global(button) {
          margin-right: 5px;
        }

        .actions-content :global(button):last-child {
          margin-right: 0px;
        }
      `}</style>
    </div>
  )
}

export default InlineActionView
