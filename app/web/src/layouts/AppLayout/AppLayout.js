/** @jsx jsx */
import { jsx, ThemeProvider, Themed } from 'theme-ui'
import theme from './theme'
import NavBar from '../../components/nav/NavBar'

const AppLayout = ({ title = 'README', children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Themed.root>
        <NavBar />
        {children}
      </Themed.root>
    </ThemeProvider>
  )
}

export default AppLayout
