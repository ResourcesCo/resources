import { render } from '@redwoodjs/testing'

import PageView from './PageView'

describe('PageView', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageView />)
    }).not.toThrow()
  })
})
