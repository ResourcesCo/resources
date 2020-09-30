import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'
import AttachmentMenu from './AttachmentMenu'
import { Manager, Reference } from 'react-popper'

export default function AttachmentView({ path, context: { theme }, context }) {
  const [files, setFiles] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const file = files && files[0]
  return (
    <div className={clsx('vtv--attachment-view', files && 'has-files')}>
      <input
        type="file"
        onChange={({ target: { files } }) => setFiles(files)}
      />
      {files && (
        <Manager>
          <Reference>
            {({ ref }) => (
              <ActionButton
                ref={ref}
                primary
                onClick={() => setMenuOpen(true)}
                context={context}
              >
                <span className="vtv--attachment-view--button">
                  {files[0].name}{' '}
                  <FontAwesomeIcon icon={faCaretDown} size="sm" />
                </span>
              </ActionButton>
            )}
          </Reference>
          {menuOpen && (
            <AttachmentMenu
              file={file}
              onClose={() => setMenuOpen(false)}
              path={path}
              context={context}
            />
          )}
        </Manager>
      )}
    </div>
  )
}
