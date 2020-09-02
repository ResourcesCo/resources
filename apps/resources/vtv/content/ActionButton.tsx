export default function ActionButton({
  path,
  actionLink,
  context: {
    onPickId,
    document: { value: docValue },
    theme,
  },
}) {
  const runAction = () => {
    const { url: actionUrl, action, args } = actionLink.getAction({
      value: docValue,
      path,
    })
    onPickId(`${actionUrl} :${action} ${args || ''}`.trim())
  }
  return (
    <button className="action" onClick={runAction}>
      {actionLink.name}
      <style jsx>{`
        button {
          background-color: ${theme.primaryActionColor};
          display: flex;
          color: ${theme.actionTextColor};
          margin-right: 10px;
          border-radius: 9999px;
          padding: 3px 7px;
          cursor: pointer;
          font-family: ${theme.fontFamily};
          outline: none;
          font-size: inherit;
          border: 0;
        }
      `}</style>
    </button>
  )
}
