import React, {
  useEffect,
  FunctionComponent,
  ChangeEventHandler,
  useRef,
  MouseEventHandler,
  EventHandler,
  useImperativeHandle,
  useState,
} from 'react'
import { faSpaceShuttle } from '@fortawesome/free-solid-svg-icons'
//import TextareaAutosize from 'react-autosize-textarea'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Theme, CodeEditor } from 'vtv'
import { EditorView, Command } from '@codemirror/view'
import { EditorSelection } from '@codemirror/state'
import { insertNewlineAndIndent } from '@codemirror/commands'

export interface ChannelInputMethods {
  insertAction(text: string): void
}

interface ChannelInputProps {
  onFocusChange: Function
  onSend: Function
  getHistory(position: number): string | undefined
  theme: Theme
}

interface History {
  position?: number
  text?: string
}

const ChannelInput = React.forwardRef<ChannelInputMethods, ChannelInputProps>(
  ({ onFocusChange, onSend, getHistory, theme }, ref) => {
    const editorViewRef = useRef<EditorView>()
    const historyRef = useRef<History>({position: undefined, text: undefined})

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

    const sendMessage: Command = (view) => {
      if (onSend(view.state.doc.toString())) {
        view.dispatch({
          changes: [{ from: 0, to: view.state.doc.length, insert: '' }],
          selection: EditorSelection.create([EditorSelection.range(0, 0)]),
        })
        return true
      }
    }

    const previousCommand: Command = (view) => {
      const sel = view.state.selection
      let text
      if (view.state.doc.length === 0) {
        historyRef.current.position = 0
        text = getHistory(historyRef.current.position)
      } else if (historyRef.current.position !== undefined && view.state.doc.toString() == historyRef.current.text) {
        historyRef.current.position += 1
        text = getHistory(historyRef.current.position)
      }

      if (text) {
        view.dispatch({
          changes: [{ from: 0, to: view.state.doc.length, insert: text }]
        })
        historyRef.current.text = text
        return true
      }
      
      if (historyRef.current.position !== undefined) {
        historyRef.current.position = undefined
        historyRef.current.text = undefined
      }
      return false
    }

    const customKeymap = [
      {
        key: 'Enter',
        run: sendMessage,
      },
      {
        key: 'Shift-Enter',
        run: insertNewlineAndIndent,
      },
      {key: "ArrowUp", run: previousCommand},
      // TODO: ArrowDown to go to next if previous isn't selected, and with Left, Right, Esc clear out historyRef state
    ]

    const eventHandlers = EditorView.domEventHandlers({})

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
        <button onClick={() => sendMessage(editorViewRef.current)} className="send">
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

          .chat-input .send {
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
