import { render } from '@redwoodjs/testing'

import CodeEditor from './CodeEditor'

describe('CodeEditor', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CodeEditor />)
    }).not.toThrow()
  })
})
