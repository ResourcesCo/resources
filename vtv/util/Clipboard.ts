const defaultOptions = {
  copyToSystemClipboard: true,
  pasteFromSystemClipboard: false,
}

export default class Clipboard {
  data = undefined
  state = undefined
  copyToSystemClipboard: boolean
  pasteFromSystemClipboard: boolean

  constructor(options = {}) {
    const opts = { ...defaultOptions, ...options }
    this.copyToSystemClipboard = opts.copyToSystemClipboard
    this.pasteFromSystemClipboard = opts.pasteFromSystemClipboard
  }

  async read() {
    if (this.pasteFromSystemClipboard) {
      return await navigator.clipboard.readText()
    } else {
      return this.data
    }
  }

  async write(data) {
    this.data = data
  }
}
