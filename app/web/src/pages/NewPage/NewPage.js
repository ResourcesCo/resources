import { Link, routes } from '@redwoodjs/router'
import AppLayout from '../../layouts/AppLayout'

const NewPage = () => {
  return (
    <AppLayout>
      <h1>NewPage</h1>
      <p>
        Find me in <code>./web/src/pages/NewPage/NewPage.js</code>
      </p>
      <p>
        My default route is named <code>new</code>, link to me with `
        <Link to={routes.new()}>New</Link>`
      </p>
    </AppLayout>
  )
}

export default NewPage
