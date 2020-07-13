import { AppSpec } from '../../app-base/App'

const numbers = ['one', 'two', 'three', 'four', 'five', 'six']

async function run({}) {
  const randomNumber = Math.floor(Math.random() * 6)
  return { type: 'text', text: `You rolled a ${numbers[randomNumber]}.` }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    resourceTypes: {
      tasks: {
        routes: [{ path: '/random' }],
        actions: {
          roll: {
            params: [],
            doc: 'roll a six-sided die',
          },
        },
      },
    },
    run,
  }
}
