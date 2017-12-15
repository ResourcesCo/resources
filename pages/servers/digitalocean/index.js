import Link from 'next/link'
import Head from '../../../components/head'
import Header from '../../../components/header'
import List from '../../../components/list'

export default () => (
  <div>
    <Head title="digitalocean" />

    <Header />

    <List>
      <ul>
        <li>
          <Link href="/servers/digitalocean/droplets">
            <a>droplets</a>
          </Link>
        </li>
      </ul>
    </List>
  </div>
)
