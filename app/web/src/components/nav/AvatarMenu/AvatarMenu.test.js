import { render } from '@redwoodjs/testing'

import AvatarMenu from './AvatarMenu'

describe('AvatarMenu', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AvatarMenu />)
    }).not.toThrow()
  })
})
