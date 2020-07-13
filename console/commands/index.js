import messages from './messages'
import giphy from './giphy'
import github from './github'
import asana from './asana'
import clientGateway from './clientGateway'
import docs from './docs'
import note from './note'
import clear from './clear'
import help from './help'
import request from './request'
import miscDev from './miscDev'

export default {
  messages,
  help,
  docs,
  giphy,
  github,
  asana,
  clientGateway,
  miscDev,
  note,
  clear,
  request,
  darkMode: {
    run() {
      return { type: 'set-theme', theme: 'dark' }
    },
    help: {
      details: 'change to the dark theme',
    },
  },
  lightMode: {
    run() {
      return { type: 'set-theme', theme: 'light' }
    },
    help: {
      details: 'change to the light theme',
    },
  },
  sleep: {
    async run({ params }) {
      const [timeoutStr, message] = params
      const timeout = Math.floor(Number.parseFloat(timeoutStr) * 1000)
      const promise = new Promise((resolve, reject) => {
        setTimeout(resolve, timeout)
      })
      await promise
      return { type: 'text', text: message || '' }
    },
    help: {
      params: ['seconds', 'message'],
      details:
        'Sleep for a specified number of seconds and then send a message',
    },
  },
}
