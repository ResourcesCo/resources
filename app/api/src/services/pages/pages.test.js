import { pages } from './pages'

describe('pages', () => {
  scenario('returns all pages', async (scenario) => {
    const result = await pages()

    expect(result.length).toEqual(Object.keys(scenario.page).length)
  })
})
