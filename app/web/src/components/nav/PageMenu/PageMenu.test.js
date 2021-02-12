import { render } from '@redwoodjs/testing'

import PageMenu from './PageMenu'

describe('PageMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageMenu />)
    }).not.toThrow()
  })
})
