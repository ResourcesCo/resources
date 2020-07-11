import React, { PureComponent } from 'react'
import { getTheme } from '../../themes'
import { MemoryStore, LocalStorageStore } from '../../store'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import Head from '../Head'
import ChannelView from './ChannelView'

export default class ChannelViewPage extends PureComponent {
  state = {
    loaded: false,
    theme: null,
  }

  constructor(props) {
    super(props)
    if (
      typeof window !== 'undefined' &&
      this.props.storageType === 'localStorage'
    ) {
      this._store = new LocalStorageStore()
    } else {
      this._store = new MemoryStore()
    }
    this._store.load()
    this.state.theme = this.getCachedTheme()
  }

  componentDidMount() {
    if (!this.workspace) {
      this.loadChannel()
    }
  }

  get store() {
    return this._store
  }

  async loadChannel() {
    this.workspace = await ConsoleWorkspace.getWorkspace()
    this.setState({ theme: this.workspace.theme })
    this.setCachedTheme(this.workspace.theme)
    this.channel = await this.workspace.getChannel('general')
    this.setState({ loaded: true })
  }

  handleThemeChange = async theme => {
    this.setState({ theme })
    this.workspace.theme = theme
    this.setCachedTheme(theme)
    await this.workspace.saveConfig()
  }

  getCachedTheme() {
    let result
    if (typeof window !== 'undefined') {
      result = window.localStorage.getItem('rco-theme')
    }
    return result || 'dark'
  }

  setCachedTheme(theme) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('rco-theme', this.workspace.theme)
    }
  }

  render() {
    const { store, storageType, ...props } = this.props
    const themeName = this.state.theme
    const theme = getTheme(themeName)
    return (
      <>
        <Head title="Resources.co" theme={theme} />
        {this.state.loaded && (
          <ChannelView
            theme={theme}
            store={store || this.store}
            channel={this.channel}
            onThemeChange={this.handleThemeChange}
            {...props}
          />
        )}
        <style jsx global>{`
          html,
          body,
          body > div {
            margin: 0;
            padding: 0;
            height: 100%;
            box-sizing: border-box;
          }

          * {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
              Helvetica, sans-serif;
          }

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          html,
          body {
            background-color: ${theme.background};
          }

          html,
          body,
          textarea,
          svg,
          button {
            color: ${theme.foreground};
          }

          a {
            color: ${theme.linkColor};
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          ::selection {
            color: ${theme.selectionColor};
            background: ${theme.selectionBackground};
          }

          #__next-prerender-indicator {
            display: none;
          }
        `}</style>
      </>
    )
  }
}
