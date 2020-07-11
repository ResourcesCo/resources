import { AppSpec } from '../../app-base/App'

const numbers = ['one', 'two', 'three', 'four', 'five', 'six']

async function run({}) {
  const randomNumber = Math.floor(Math.random() * 6)
  return { type: 'text', text: `You rolled a ${numbers[randomNumber]}.` }
}

export default async function app(): Promise<AppSpec> {
  return {
    name: 'Asana',
    environmentVariables: {
      ASANA_TOKEN: {
        doc: `
          An Asana personal access token, from the
          [Asana developer console](https://app.asana.com/0/developer-console)'
        `,
      },
    },
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
