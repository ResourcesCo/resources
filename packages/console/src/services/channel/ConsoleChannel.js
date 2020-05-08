import LocalFileStore from '../storage/LocalFileStore'

class ConsoleChannel {
  constructor({ name, files }) {
    this.name = name
    this.files = new LocalFileStore(files)
  }
}

export default ConsoleChannel
