import { render } from '@redwoodjs/testing'

import AppMenu from './AppMenu'

describe('AppMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AppMenu />)
    }).not.toThrow()
  })
})
