import { Component } from 'react'
import App from '../components/app'
import { urlTracker } from '../components/browser/url-tracker'

class Background extends Component {
  urls = {}

  componentDidMount() {
    urlTracker.start()
  }

  componentWillUnmount() {
    urlTracker.stop()
  }

  render() {
    return <App />
  }
}

export default Background