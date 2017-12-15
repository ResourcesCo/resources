import Link from 'next/link'
import Head from '../../components/head'
import Header from '../../components/header'
import List from '../../components/list'

export default () => (
  <div>
    <Head title="servers" />

    <Header />

    <List>
      <ul>
        <li>
          <Link href="/servers/digitalocean">
            <a>digitalocean</a>
          </Link>
        </li>
      </ul>
    </List>
  </div>
)
