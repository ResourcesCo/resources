import { render } from '@redwoodjs/testing'

import DocumentMenu from './DocumentMenu'

describe('DocumentMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocumentMenu />)
    }).not.toThrow()
  })
})
