import { render } from '@redwoodjs/testing'

import NewPage from './NewPage'

describe('NewPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewPage />)
    }).not.toThrow()
  })
})
