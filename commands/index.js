import giphy from './giphy'
import github from './github'
import asana from './asana'
import openfaas from './openfaas'
import clientGateway from './client-gateway'
import docs from './docs'
import note from './note'
import clear from './clear'
import help from './help'
import roll from './roll'

export default {
  help,
  docs,
  giphy,
  github,
  asana,
  openfaas,
  'client-gateway': clientGateway,
  note,
  clear,
  roll,
  'dark-mode': {
    run() {
      return {type: 'set-theme', theme: 'dark'}
    },
    help: {
      details: 'change to the dark theme'
    }
  },
  'light-mode': {
    run() {
      return {type: 'set-theme', theme: 'light'}
    },
    help: {
      details: 'change to the light theme'
    }
  },
  'sleep': {
    async run({args}) {
      const [timeout, message] = args
      const promise = new Promise((resolve, reject) => {
        setTimeout(resolve, timeout)
      })
      await promise
      return { type: 'text', text: message }
    },
    help: {
      args: ['milliseconds', 'message'],
      details: 'Sleep for a specified number of milliseconds and then send a message'
    }
  }
}
