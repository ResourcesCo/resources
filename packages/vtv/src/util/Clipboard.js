const defaultOptions = {
  copyToSystemClipboard: true,
  pasteFromSystemClipboard: false,
}

export default class Clipboard {
  constructor(options) {
    this.data = undefined
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

  async write() {
    this.data = data
  }
}
