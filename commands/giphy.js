class Giphy {
  auth({ key, store }) {
    store.env.GIPHY_API_KEY = key
    store.save()
    return { type: 'text', text: 'Saved!' }
  }

  async search({ tag, key }) {
    if (!key) {
      return { type: 'text', text: 'No API key given. Run "help" for info.' }
    }
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${key}&tag=${encodeURIComponent(
      tag
    )}`
    const res = await fetch(url)
    const data = await res.json()
    return { type: 'image', url: data.data.image_url }
  }

  run = async ({ args, store }) => {
    if (args[0] === 'auth' && args.length === 2) {
      const key = args[1]
      return this.auth({ key, store })
    } else {
      const tag = args[0]
      const key = store.env.GIPHY_API_KEY
      return await this.search({ tag, key })
    }
  }
}

const giphy = new Giphy()

export default {
  run: giphy.run,
  help: [
    {
      subCommand: 'auth',
      args: ['api-key'],
      details: 'store api key for giphy',
    },
    {
      args: ['tag'],
      details: 'show a gif from giphy',
    },
  ],
}
