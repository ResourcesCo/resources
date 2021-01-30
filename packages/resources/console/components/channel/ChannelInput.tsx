import React, {
  useEffect,
  FunctionComponent,
  ChangeEventHandler,
  useRef,
  MouseEventHandler,
  EventHandler,
  useImperativeHandle,
} from 'react'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
//import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Theme, CodeEditor } from 'vtv'
import { EditorView } from '@codemirror/view'
import { EditorSelection, StateCommand } from '@codemirror/state'
import { insertNewlineAndIndent } from '@codemirror/commands'

export interface ChannelInputMethods {
  insertAction(text: string): void
}

interface ChannelInputProps {
  onFocusChange: Function
  onSend: Function
  theme: Theme
}

const ChannelInput = React.forwardRef<ChannelInputMethods, ChannelInputProps>(
  ({ onFocusChange, onSend, theme }, ref) => {
    const editorViewRef = useRef<EditorView>()

    useImperativeHandle(ref, () => ({
      insertAction(text) {
        const anchor =
          editorViewRef.current.state.selection.main.from + text.length
        editorViewRef.current.dispatch(
          editorViewRef.current.state.replaceSelection(text)
        )
        editorViewRef.current.dispatch({
          selection: EditorSelection.create([
            EditorSelection.range(anchor, anchor),
          ]),
        })
        editorViewRef.current.focus()
      },
    }))

    useEffect(() => {
      if (editorViewRef.current) {
        editorViewRef.current.focus()
      }
    }, [editorViewRef])

    const catchEnter: StateCommand = ({state, dispatch}) => {
      if (onSend(state.doc.toString())) {
        editorViewRef.current.dispatch({
          changes: [{from: 0, to: state.doc.length, insert: ''}],
          selection: EditorSelection.create([
            EditorSelection.range(0, 0),
          ])
        })
        return true
      }
    }

    const customKeymap = [
      {
        key: 'Enter',
        run: catchEnter,
      },
      {
        key: 'Shift-Enter',
        run: insertNewlineAndIndent,
      },
    ]

    const eventHandlers = EditorView.domEventHandlers({
    })

    const handleFocusChange = (focused) => {
      if (onFocusChange) {
        onFocusChange(focused)
      }
    }

    const handlePaste = (e) => {
      try {
        const data = e.clipboardData.getData('text/plain')
        if (data.length > 2000) {
          e.preventDefault()
          onSend(data)
        }
      } catch (err) {
        // ignore error
      }
    }

    return (
      <div className="chat-input">
        {/*<TextareaAutosize
        className="chat-input-text"
        placeholder=">"
        value={text}
        onChange={onTextChange}
        onKeyDown={handleKeyPress}
        onFocus={() => handleFocusChange(true)}
        onBlur={() => handleFocusChange(false)}
        onPaste={handlePaste}
        ref={textareaRef}
        maxRows={8}
        autoCorrect="off"
        autoCapitalize="none"
      />*/}
        <CodeEditor
          editorViewRef={editorViewRef}
          additionalExtensions={[eventHandlers]}
          customKeymap={customKeymap}
          showLineNumbers={false}
          className="chat-input-text"
        />
        <button onClick={(e) => onSend()}>
          <span className="rocket">
            <FontAwesomeIcon icon={faSpaceShuttle} />
          </span>
        </button>
        <style jsx>{`
          .chat-input {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .chat-input :global(.chat-input-text) {
            flex-grow: 1;
            background: none;
            width: 100%;
            outline: none;
            font-size: 18px;
            line-height: 1.2;
            padding: 3px 3px;
            resize: none;
            color: ${theme.foreground};
            font-family: ${theme.fontFamily};
          }

          button {
            background: none;
            outline: none;
            border: none;
            padding: 0 2px 0 5px;
            color: ${theme.foreground};
            cursor: pointer;
            font-size: 28px;
            line-height: 1.2;
          }
        `}</style>
      </div>
    )
  }
)

export default ChannelInput
