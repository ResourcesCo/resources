/** @jsx jsx */
import { jsx, Themed } from 'theme-ui'
import NavBar from '../../components/nav/NavBar'

const AppLayout = ({ title = 'README', children }) => {
  return (
    <Themed.root>
      <NavBar />
      {children}
    </Themed.root>
  )
}

export default AppLayout
