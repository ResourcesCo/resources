import { render } from '@redwoodjs/testing'

import PageEdit from './PageEdit'

describe('PageEdit', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageEdit />)
    }).not.toThrow()
  })
})
