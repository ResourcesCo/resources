export default {
  filters: {
    before({ command: { name }, env: { api_token } }) {
      if (name !== 'auth' && !api_token) {
        return {
          type: 'error',
          text: 'No API token given. Run "help" for info.',
        }
      }
    },
  },
  commands: {
    auth: {
      args: ['api-token'],
      help: 'store api token for GitHub',
      run({ args: { api_token } }) {
        return [
          { type: 'env', value: { api_token } },
          { type: 'text', text: 'Saved!' },
        ]
      },
    },
    issues: {
      args: ['owner', 'repo'],
      help: 'show open issues for a repo',
      async run({ args: { owner, repo }, env: { api_token } }) {
        const url = `https://api.github.com/repos/${owner}/${repo}/issues`
        const headers = {
          Authorization: `token ${api_token}`,
        }
        const res = await fetch(url, { headers })
        const data = await res.json()
        if (Array.isArray(data)) {
          if (data.length > 0) {
            return {
              type: 'data',
              data: data,
              keyField: 'number',
              title: 'title',
              pickPrefix: `${owner} ${repo} `,
            }
          } else {
            return { type: 'text', text: 'No open issues!' }
          }
        } else {
          return { type: 'text', text: 'Error getting issues' }
        }
      },
    },
    close: {
      args: ['owner', 'repo', 'number'],
      help: 'Close a GitHub issue',
      async run({ args: { owner, repo, number }, env: { api_token } }) {
        const headers = {
          Authorization: `token ${api_token}`,
          'Content-Type': 'application/json',
        }
        const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`
        const res = await fetch(url, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ state: 'closed' }),
        })
        if (res.ok) {
          return { type: 'text', text: `Issue closed` }
        } else {
          return { type: 'text', text: `Error closing issue` }
        }
      },
    },
  },
}
