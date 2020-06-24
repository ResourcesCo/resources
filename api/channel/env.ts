export default function env(target: { [key: string]: string }, cb) {
  return new Proxy<{ [key: string]: string }>(target, {
    set(target, key: string, value: string) {
      target[key] = value
      cb()
      return true
    },
  })
}
