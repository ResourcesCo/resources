import { render } from '@redwoodjs/testing'

import AlertMenu from './AlertMenu'

describe('AlertMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AlertMenu />)
    }).not.toThrow()
  })
})
