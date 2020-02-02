import { globalCommandHelp } from '../command-runner'

export default {
  run() {
    return {
      type: 'help',
      help: globalCommandHelp,
    }
  },
  help: {
    details: 'show this help message',
  },
}
