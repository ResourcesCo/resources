import { getNodeType, joinPath } from '../../vtv-model/analyze'
import CollectionSummary from './CollectionSummary'

export default function ActionButton({
  value,
  state,
  path,
  actionLink,
  context: {
    onPickId,
    document: { value: docValue },
    theme,
  },
}) {
  const nodeType = getNodeType(value)
  const summaryString = `${value}`.replace(/\n\t/g, '').substr(0, 40)
  const runAction = () => {
    const { path: actionPath, action } = actionLink.getAction({
      value: docValue,
      path,
    })
    onPickId(`${actionPath} :${action}`)
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
