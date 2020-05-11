import LocalFileStore from '../storage/LocalFileStore'

class ConsoleChannel {
  constructor({ name, files }) {
    this.name = name
    if (typeof window == 'undefined') {
      this.files = new LocalFileStore(files)
    } else {
      this.files = null // TODO: wrap API
    }
  }

  async runCommand({ message, parsed }) {
    if (parsed[0] === 'files') {
      return {
        type: 'tree',
        name: 'test',
        value: 'Test',
        message: 'test',
      }
    }
  }
}

export default ConsoleChannel
