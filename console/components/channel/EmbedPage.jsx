import React, { PureComponent } from 'react'
import { getTheme } from '../../themes'
import { MemoryStore, LocalStorageStore } from '../../store'
import ConsoleWorkspace from '../../services/workspace/ConsoleWorkspace'
import Head from '../Head'

export default class EmbedPage extends PureComponent {
  state = {
    channel: null,
    theme: null,
  }

  constructor(props) {
    super(props)
    if (this.props.storageType === 'localStorage') {
      this._store = new LocalStorageStore()
    } else {
      this._store = new MemoryStore()
    }
    this._store.load()
    this.state.theme = this._store.theme
  }

  get store() {
    return this._store
  }

  async loadChannel() {
    const workspace = ConsoleWorkspace.getWorkspace()
    const channel = await workspace.getChannel('main')
    this.setState({ channel })
  }

  get channel() {
    if (this.props.channel) {
      return this.props.channel
    } else if (this.state.channel) {
      return this.state.channel
    } else {
      this.loadChannel()
    }
  }

  render() {
    const {
      onThemeChange,
      store,
      channel,
      storageType,
      path,
      ...props
    } = this.props
    const themeName = this.state.theme
    const theme = getTheme(themeName)
    return (
      <>
        <Head title="Resources.co" theme={theme} />
        <p>The path is {path}</p>
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
