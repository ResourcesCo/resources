import { render } from '@redwoodjs/testing'

import Page from './Page'

describe('Page', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Page />)
    }).not.toThrow()
  })
})
