import { PureComponent } from 'react'
import TextareaAutosize from 'react-autosize-textarea'

class Textarea extends PureComponent {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    if (this.inputRef.current) {
      const input = this.inputRef.current
      input.setSelectionRange(input.value.length, input.value.length)
    }
  }

  render() {
    const { children, maxRows = 8, ...props } = this.props
    return (
      <TextareaAutosize maxRows={maxRows} {...props} ref={this.inputRef}>
        {children}
      </TextareaAutosize>
    )
  }
}

export default Textarea
