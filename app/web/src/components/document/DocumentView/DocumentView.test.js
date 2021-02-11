import { render } from '@redwoodjs/testing'

import DocumentView from './DocumentView'

describe('DocumentView', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DocumentView />)
    }).not.toThrow()
  })
})
