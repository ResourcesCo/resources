import App from '../components/app'
import { Component } from 'react'

class Sidebar extends Component {
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

export default Sidebar