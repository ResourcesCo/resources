const endpoints = [
  {
    pattern: /^https:\/\/github\.com\/[^\/]+\/?$/,
    apiDocUrl: 'https://developer.github.com/v3/users/',
  },
  {
    pattern: /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/,
    apiDocUrl: 'https://developer.github.com/v3/repos/',
  },
]

export default class Docs {
  async run(url) {
    for (let {pattern, apiDocUrl} of endpoints) {
      if (pattern.test(url)) {
        return <p><a href={apiDocUrl}>{apiDocUrl}</a></p>
      }
    }
    return <p>No results found.</p>
  }
}