import { commandHelp } from './'

export default {
  run() {
    return {
      type: 'help',
      help: commandHelp
    }
  },
  help: {
    details: 'show this help message'
  }
}
