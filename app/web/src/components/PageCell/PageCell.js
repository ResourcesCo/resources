export const QUERY = gql`
  query PageQuery {
    page {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ page }) => {
  return JSON.stringify(page)
}
