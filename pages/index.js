import Link from 'next/link'
import Head from '../components/head'
import Header from '../components/header'
import List from '../components/list'

export default () => (
  <div>
    <Head title="Home" />

    <Header home />

    <List>
      <ul>
        <li>
          <Link href="/digitalocean">
            <a>digitalocean</a>
          </Link>
        </li>
      </ul>
    </List>
  </div>
)
