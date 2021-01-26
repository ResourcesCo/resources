import React, { PureComponent, useState, useEffect } from 'react'
import { getTheme } from '../../themes'
import { MemoryStore, LocalStorageStore } from '../../store'
import ConsoleWorkspace from 'api/workspace/ConsoleWorkspace'
import Head from '../Head'

import asanaTest from 'api/apps/test/tests/asana'
import ConsoleChannel from 'api/channel/ConsoleChannel'

function Test({}) {
  const [result, setResult] = useState('not completed')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener(
        'message',
        ({ origin, data: { source, payload } }) => {
          if (source.startsWith('/messages/')) {
            window.parent.postMessage(
              { source: `${source}/reply`, payload: { echo: payload } },
              origin
            )
          }
        }
      )
      asanaTest().then(result => {
        setResult(JSON.stringify(result))
      })
    }
  }, [])
  return <div>{result}</div>
}

interface EmbedPageProps {
  storageType?: 'memory' | 'localStorage'
  path: string[]
  workspace: ConsoleWorkspace
  channel: ConsoleChannel
}

export default class EmbedPage extends PureComponent<EmbedPageProps> {
  state = {
    theme: null,
  }

  store: LocalStorageStore | MemoryStore

  constructor(props) {
    super(props)
    if (
      typeof window !== 'undefined' &&
      this.props.storageType === 'localStorage'
    ) {
      this.store = new LocalStorageStore()
    } else {
      this.store = new MemoryStore()
    }
    this.store.load()
    this.state.theme = this.store.theme
  }

  render() {
    const { channel, storageType, path, ...props } = this.props
    const theme = getTheme(this.store.theme)
    return (
      <>
        <Head title="Resources.co" theme={theme} />
        <Test />
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

          #__next-prerender-indicator {
            display: none;
          }
        `}</style>
      </>
    )
  }
}
