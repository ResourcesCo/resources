import { render } from '@redwoodjs/testing'

import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<SearchBar />)
    }).not.toThrow()
  })
})
