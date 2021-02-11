import { render } from '@redwoodjs/testing'

import DocumentPreview from './DocumentPreview'

describe('DocumentPreview', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocumentPreview />)
    }).not.toThrow()
  })
})
