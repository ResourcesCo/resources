import { AppSpec } from '../../app-base/App'

const numbers = ['one', 'two', 'three', 'four', 'five', 'six']

const actions = {
  roll() {
    const randomNumber = Math.floor(Math.random() * 6)
    return { type: 'text', text: `You rolled a ${numbers[randomNumber]}.` }
  },
  flip() {
    const randomNumber = Math.round(Math.random())
    return { type: 'text', text: randomNumber === 0 ? 'Heads!' : 'Tails!' }
  },
}

async function run({ action }) {
  return actions[action]()
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Random',
    description: 'Fun with random numbers',
    resourceTypes: {
      tasks: {
        routes: [{ path: '/random' }],
        actions: {
          roll: {
            params: [],
            doc: 'roll a six-sided die',
          },
          flip: {
            params: [],
            doc: 'flip a coin',
          },
        },
      },
    },
    run,
  }
}
