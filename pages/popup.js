import App from '../components/app'
import { Component } from 'react'
import { urlTracker } from '../components/browser/url-tracker'

class Popup extends Component {
  componentDidMount() {
    urlTracker.start()
  }

  componentWillUnmount() {
    urlTracker.stop()
  }

  componentDidMount() {
    this._linkListener = window.addEventListener('click', e => {
      if (e.target.href !== undefined){
        chrome.tabs.create({url:e.target.href})
      }
    })
  }

  componentWillUnmount() {
    window.removeEventListener(this._linkListener)
  }

  render() {
    return <App popup />
  }
}

export default Popup