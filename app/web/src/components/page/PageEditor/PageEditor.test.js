import { render } from '@redwoodjs/testing'

import PageEditor from './PageEditor'

describe('PageEditor', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PageEditor />)
    }).not.toThrow()
  })
})
