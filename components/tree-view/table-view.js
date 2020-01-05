export default ({value, theme}) => {
  return <div className="table">
    <table>
      <thead>
        <tr>
          <th>key</th>
        </tr>
      </thead>
      <tbody>
        {
          Object.keys(value).map(key => (
            <tr key={key}>
              <td>{key}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
    <style jsx>{`
      .table {
        padding: 5px;
        padding-left: 30px;
        font-size: 70%;
      }
      table {
        border-collapse: collapse;
      }
      table th, table td {
        border: 1px solid ${theme.bubble1};
        padding: 3px;
      }
    `}</style>
  </div>
}
