import Link from 'next/link'
import Head from '../../../../components/head'
import Header from '../../../../components/header'

export default () => (
  <div>
    <Head title="list droplets – digitalocean" />

    <Header />

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

    <h3>References</h3>

    <ul>
      <li><a href="https://github.com/digitalocean/doctl">README</a></li>
      <li>online help: <code>doctl help</code></li>
    </ul>

    <style jsx>{`
      pre, code {
        font-family: monospace;
        color: #eee;
        background-color: #111;
        padding: 3px 5px;
      }
      pre {
        padding: 6px 10px;
        margin: 0;
      }
      h3 {
        margin: 8px 5px 5px;
        color: #459;
        font-size: 15px;
      }
      p {
        margin: 8px 10px;
      }
      ul {
        list-style-type: disc;
        margin-left: 5px;
        padding-left: 15px;
      }
    `}</style>
  </div>
)
