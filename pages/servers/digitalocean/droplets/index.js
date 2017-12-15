import Link from 'next/link'
import Head from '../../../../components/head'
import Header from '../../../../components/header'
import List from '../../../../components/list'

export default () => (
  <div>
    <Head title="droplets – digitalocean" />

    <Header>
      <h1>resources</h1>
      <h2>docs &amp; tools for APIs</h2>
    </Header>

    <List>
      <ul>
        <li>
          <Link href="/servers/digitalocean/droplets/list">
            <a>list</a>
          </Link>
        </li>
      </ul>
    </List>

    <style jsx>{`
      .home-header {
        text-align: center;
      }
      .home-header h1 {
        color: blue;
        margin-bottom: 3px;
      }
      .home-header h2 {
        margin-top: 3px;
        font-size: 110%;
      }
      .list ul {
        list-style-type: none;
      }
    `}</style>
  </div>
)
