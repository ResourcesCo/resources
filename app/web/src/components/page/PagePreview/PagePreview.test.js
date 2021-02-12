import { render } from '@redwoodjs/testing'

import PagePreview from './PagePreview'

describe('PagePreview', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PagePreview />)
    }).not.toThrow()
  })
})
