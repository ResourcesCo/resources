export default class Giphy {
  auth(key) {
    this.key = key
    return <span>Saved!</span>
  }

  async run(tag) {
    const url = `https://api.giphy.com/v1/gifs/random?api_key=${this.key}&tag=${encodeURIComponent(tag)}`
    const res = await fetch(url)
    const data = await res.json()
    return <img src={data.data.image_url} style={{maxWidth: '100%'}} />
  }
}