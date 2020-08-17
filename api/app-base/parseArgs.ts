function isUrlArg(s) {
  return s.startsWith('/') || s.startsWith('https://')
}

export default function parseArgs(
  args: string[]
): { url: string | null; action: string | null; params: any[] } {
  let url = null,
    action = null,
    params = null
  if (isUrlArg(args[0])) {
    url = args[0]
    if (args.length > 1 && args[1].startsWith(':')) {
      action = args[1].substr(1)
      params = args.slice(2)
    } else {
      params = args.slice(1)
    }
  } else if (args[0].startsWith(':')) {
    action = args[0].substr(1)
    url = args.length >= 2 && isUrlArg(args[1]) ? args[1] : '/'
    params = args.slice(2)
  } else if (args[0] === 'help' && args.length === 1) {
    action = 'help'
    url = '/'
    params = []
  }

  return { url, action, params }
}
