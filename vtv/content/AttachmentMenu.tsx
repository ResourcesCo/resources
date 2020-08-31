import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

function InsertObjectMenu({ onInsert, context, ...props }) {
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      <MenuItem onClick={() => onInsert('data-url', true)}>Data URL</MenuItem>
      <MenuItem onClick={() => onInsert('base64', true)}>Base64</MenuItem>
      <MenuItem onClick={() => onInsert('text', true)}>Text</MenuItem>
    </Menu>
  )
}

function CopyMetadataMenu({
  fileMetadata: { name, type, size },
  onCopy,
  context: { clipboard },
  context,
  ...props
}) {
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      {...props}
    >
      <MenuItem
        onClick={() => onCopy(name)}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: name })}
      >
        name
      </MenuItem>
      <MenuItem
        onClick={() => onCopy(type)}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: type })}
      >
        type
      </MenuItem>
      <MenuItem
        onClick={() => onCopy(size)}
        {...(clipboard.copyToSystemClipboard && { copyToClipboard: size })}
      >
        size
      </MenuItem>
    </Menu>
  )
}

function readFile(file, type): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    })
    reader.addEventListener('error', err => {
      reject(err)
    })
    if (type === 'data-url') {
      reader.readAsDataURL(file)
    } else if (type === 'text') {
      reader.readAsText(file)
    } else {
      throw new Error('Invalid type')
    }
  })
}

function getMetadata(file) {
  return (
    file && {
      name: file.name,
      type: file.type,
      size: file.size,
    }
  )
}

export default function AttachmentMenu({
  path,
  file,
  onClose,
  context: { onMessage, clipboard },
  context,
}) {
  const handleInsert = async (type, object = false) => {
    let data = await readFile(file, type === 'text' ? 'text' : 'data-url')
    if (type === 'base64') {
      data = data.replace('data:', '').replace(/^.*;base64,/, '')
    }
    const value = object ? { ...getMetadata(file), data } : data
    onMessage({
      path,
      action: 'attach',
      value,
    })
  }
  const handleCopy = value => {
    clipboard.value = value
    clipboard.state = null
  }
  const fileMetadata = getMetadata(file)

  return (
    <Menu
      popperProps={{
        placement: 'bottom-start',
        modifiers: [{ name: 'offset', options: { offset: [0, -3] } }],
      }}
      context={context}
      onClose={onClose}
    >
      <MenuItem onClick={() => handleInsert('data-url')}>
        Insert as Data URL
      </MenuItem>
      <MenuItem onClick={() => handleInsert('base64')}>
        Insert as Base64
      </MenuItem>
      <MenuItem onClick={() => handleInsert('text')}>Insert as Text</MenuItem>
      <MenuItem
        submenu={
          <InsertObjectMenu
            onInsert={handleInsert}
            onClose={onClose}
            context={context}
          />
        }
      >
        Insert as Object
      </MenuItem>
      <MenuItem
        submenu={
          <CopyMetadataMenu
            onCopy={handleCopy}
            fileMetadata={fileMetadata}
            onClose={onClose}
            clipboard={clipboard}
            context={context}
          />
        }
      >
        Copy Metadata
      </MenuItem>
    </Menu>
  )
}
