import Link from 'next/link'
import Head from '../components/head'

export default () => (
  <div>
    <Head title="Home" />

    <div className="home-header">
      <h1>resources</h1>
      <h2>docs &amp; tools for APIs</h2>
    </div>

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
    `}</style>
  </div>
)
