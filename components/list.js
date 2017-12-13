const List = props => (
  <div className="list">
    {props.children}
    <style jsx>{`
      ul {
        list-style-type: none;
      }
      .list {
        padding: 5px;
      }
    `}</style>
  </div>
)

export default List