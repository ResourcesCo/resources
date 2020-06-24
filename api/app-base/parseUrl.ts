export default function parseUrl(url: string): { host?: string; path: string } {
  if (url.startsWith('https://')) {
    const { host, pathname: path } = new URL(url)
    return { host, path }
  } else {
    return { path: url }
  }
}
