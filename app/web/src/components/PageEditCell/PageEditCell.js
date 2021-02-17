export const QUERY = gql`
  query PageEditQuery {
    page {
      path
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ page }) => {
  return JSON.stringify(page)
}
