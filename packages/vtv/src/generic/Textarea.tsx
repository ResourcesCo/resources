import React, { PureComponent } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface TextareaProps {
  value: string
  [key: string]: any
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, children, ...props }, ref) => {
    return (
      <TextareaAutosize maxRows={8} ref={ref} value={value} {...props}>
        {children}
      </TextareaAutosize>
    )
  }
)

export default Textarea
