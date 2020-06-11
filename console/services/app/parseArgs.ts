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
  } else if (args[0].startsWith(':') && isUrlArg(args[1])) {
    url = args[1]
  }

  return { url, action, params }
}
