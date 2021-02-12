import { render } from '@redwoodjs/testing'
import NavBar from './NavBar'

describe('NavBar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NavBar />)
    }).not.toThrow()
  })
})
