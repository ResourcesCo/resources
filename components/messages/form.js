import { PureComponent } from 'react'
import TextareaAutosize from 'react-autosize-textarea'

class Form extends PureComponent {
  state = {
    formData: {}
  }

  constructor(props) {
    super(props)
    this.firstInputRef = React.createRef()
  }

  handleChange = name => ({target: {value}}) => {
    const {formData} = this.state
    this.setState({formData: {...formData, [name]: value}})
  }

  send = () => {
    const {commandId, message, onSubmitForm} = this.props
    const {formData} = this.state
    onSubmitForm({commandId, message, formData})
  }

  handleKeyPress = e => {
    if (e.which == 13 && (e.metaKey || e.ctrlKey)) {
      this.send()
    }
  }

  render() {
    const { fields, commandId, isNew, theme } = this.props
    const { formData } = this.state

    let firstInput = true
    return (
      <div>
        {
          fields.map(({name, type}) => {
            const result = (
              <div key={name}>
                <TextareaAutosize
                  value={formData[name] || ''}
                  onChange={this.handleChange(name)}
                  ref={firstInput ? this.firstInputRef : undefined}
                  autoFocus={isNew}
                  title="Press ⌘-Enter or Ctrl-Enter to send"
                  onKeyPress={this.handleKeyPress}
                />
              </div>
            )
            firstInput = false
            return result
          })
        }
        <div>
          <button className="action" onClick={this.send}>send</button>
        </div>
        <style jsx>{`
          button {
            cursor: pointer;
            background-color: ${theme.bubble1};
            border-radius: 9999px;
            outline: none;
          }

          button.id {
            padding: 3px;
          }

          button.action {
            padding: 4px 12px;
          }

          :global(textarea) {
            width: 600px;
          }

          @media only screen and (max-width: 700px) {
            :global(textarea) {
              width: 95%;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Form
