export default class Giphy {
  auth(key) {
    this.key = key
    return {type: 'text', text: 'Saved!'}
  }

  async run(tag) {
    if (!this.key) {
      return {type: 'text', text: 'No API key given. Run "help" for info.'}
    }
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${this.key}&tag=${encodeURIComponent(tag)}`
    const res = await fetch(url)
    const data = await res.json()
    return {type: 'image', url: data.data.image_url}
  }
}