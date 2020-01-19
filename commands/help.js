import { commandHelp } from '../command-runner'

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
