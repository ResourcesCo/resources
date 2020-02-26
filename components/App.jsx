import { PureComponent } from 'react'
import AppView from './AppView'
import { store } from '../store'

class App extends PureComponent {
  state = {
    selectedTheme: 'dark',
    ready: false,
  }

  async componentDidMount() {
    await store.load()
    this.setState({
      ready: true,
      selectedTheme: store.theme || this.state.selectedTheme,
    })
  }

  handleThemeChange = theme => {
    this.setState({ selectedTheme: theme })
  }

  render() {
    const { selectedTheme, ready } = this.state
    return (
      <AppView
        selectedTheme={selectedTheme}
        onThemeChange={this.handleThemeChange}
        store={store}
      />
    )
  }
}

export default App
