import { PureComponent } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import { HotKeys } from 'react-hotkeys'

class Form extends PureComponent {
  state = {
    formData: {}
  }

  constructor(props) {
    super(props)
    this.firstInputRef = React.createRef()
    this.mac = /(\bMac)/i.test(window.navigator.platform)
  }

  handleChange = name => ({target: {value}}) => {
    this.setState({[name]: value})
  }

  send = () => {
    const {commandId, onSubmitForm} = this.props
    const {formData} = this.state
    this.onSubmitForm({commandId, formData})
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
                <HotKeys>
                  <TextareaAutosize
                    value={formData[name]}
                    onChange={this.handleChange(name)}
                    ref={firstInput ? this.firstInputRef : undefined}
                    autoFocus={isNew}
                    title={`Press ${this.mac ? '⌘' : 'Ctrl'}-Enter to send`}
                  />
                </HotKeys>
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
