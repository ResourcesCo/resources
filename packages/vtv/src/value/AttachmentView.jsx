import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'

export default function AttachmentView({ theme }) {
  return (
    <div className="attachment-view">
      Drag and drop a file here{' '}
      <ActionButton theme={theme}>Select Files…</ActionButton>
    </div>
  )
}
