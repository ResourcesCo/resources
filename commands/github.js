class GitHub {
  auth({api_token, store}) {
    store.env.GITHUB_API_TOKEN = api_token
    store.save()
    return {type: 'text', text: 'Saved!'}
  }

  async issues({api_token, owner, repo}) {
    if (!api_token) {
      return {type: 'text', text: 'No API token given. Run "help" for info.'}
    }
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`
    const headers = {
      'Authorization': `token ${api_token}`
    }
    const res = await fetch(url, {headers})
    const data = await res.json()
    return data.map(issue => (
      {type: 'link', url: issue.html_url, text: issue.title}
    ))
  }

  run = async ({args, store}) => {
    if (args[0] === 'auth' && args.length === 2) {
      const api_token = args[1]
      return this.auth({api_token, store})
    } else if (args[0] === 'issues' && args.length === 3) {
      const owner = args[1]
      const repo = args[2]
      const api_token = store.env.GITHUB_API_TOKEN
      return await this.issues({owner, repo, api_token})
    }
  }
}

const github = new GitHub()

export default {
  run: github.run,
  help: [
    {
      subCommand: 'auth',
      args: ['api-token'],
      details: 'store api token for GitHub'
    },
    {
      subCommand: 'issues',
      args: ['owner', 'repo'],
      details: 'show open issues for a repo'
    }
  ]
}
