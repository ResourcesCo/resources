import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import ActionButton from '../generic/ActionButton'
import AttachmentMenu from './AttachmentMenu'
import { Manager, Reference } from 'react-popper'

export default function AttachmentView({
  attachments,
  path,
  onMessage,
  context: { theme, clipboard },
  context,
}) {
  const [files, setFiles] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const file = files && files[0]
  return (
    <div className={clsx('attachment-view', files && 'has-files')}>
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
                {files[0].name} <FontAwesomeIcon icon={faCaretDown} size="sm" />
              </ActionButton>
            )}
          </Reference>
          {menuOpen && (
            <AttachmentMenu
              file={file}
              onClose={() => setMenuOpen(false)}
              path={path}
              onMessage={onMessage}
              clipboard={clipboard}
              context={context}
            />
          )}
        </Manager>
      )}
      <style jsx>{`
        div {
          width: 100%;
          display: flex;
        }
        input[type='file'] {
          flex-grow: 1;
        }
        div.has-files input[type='file'] {
          display: none;
        }
      `}</style>
    </div>
  )
}
