import { render } from '@redwoodjs/testing'

import DocumentEdit from './DocumentEdit'

describe('DocumentEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocumentEdit />)
    }).not.toThrow()
  })
})
