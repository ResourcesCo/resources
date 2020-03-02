import React, { PureComponent } from 'react'
import TextareaAutosize from 'react-autosize-textarea'

const Textarea = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <TextareaAutosize maxRows={8} ref={ref} {...props}>
      {children}
    </TextareaAutosize>
  )
})

export default Textarea
