import Link from 'next/link'
import Head from '../../../components/head'

export default () => (
  <div>
    <Head title="list droplets – digitalocean" />

    <div className="home-header">
      <h1>resources</h1>
      <h2>docs &amp; tools for APIs</h2>
    </div>

    <h3>Setup</h3>

    <pre>
      brew install doctl
    </pre>

    <h3>Auth</h3>

    <p><em>
      Log into <a href="https://digitalocean.com/">digitalocean.com</a>,
      select the API tab, generate a new token, and copy to clipboard
    </em></p>

    <pre>
      doctl auth init
    </pre>

    <p><em>
      Paste your API key and hit enter
    </em></p>

    <h3>Request</h3>

    <pre>
      doctl compute droplet list
    </pre>

    <h3>Request with json output</h3>

    <pre>
      doctl compute droplet list -o json
    </pre>

    <h3>More Info &amp; References</h3>

    <ul>
      <li><a href="https://github.com/digitalocean/doctl">README</a></li>
      <li>online help: <code>doctl help</code></li>
    </ul>

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
      pre, code {
        font-family: monospace;
      }
    `}</style>
  </div>
)
