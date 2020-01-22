export default ({ type, length, theme }) => {
  return (
    <span>
      {type === 'object' ? '{' : '['}
      {length > 0 && `${length} ${length === 1 ? 'item' : 'items'}`}
      {type === 'object' ? '}' : ']'}
      <style jsx>{`
        color: ${theme.summaryColor};
      `}</style>
    </span>
  )
}
