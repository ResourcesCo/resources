import { render } from '@redwoodjs/testing'

import Document from './Document'

describe('Document', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Document />)
    }).not.toThrow()
  })
})
