import { profiles } from './profiles'

describe('profiles', () => {
  scenario('returns all profiles', async (scenario) => {
    const result = await profiles()

    expect(result.length).toEqual(Object.keys(scenario.profile).length)
  })
})
