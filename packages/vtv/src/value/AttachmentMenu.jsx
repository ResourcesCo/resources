import React from 'react'
import Menu, { MenuItem } from '../generic/Menu'

function InsertObjectMenu({ onInsert, theme, ...props }) {
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: { offset: { offset: '0, -3' } },
      }}
      theme={theme}
      {...props}
    >
      <MenuItem onClick={() => onInsert('data-uri', true)}>Data URI</MenuItem>
      <MenuItem onClick={() => onInsert('base64', true)}>Base64</MenuItem>
      <MenuItem onClick={() => onInsert('text', true)}>Text</MenuItem>
    </Menu>
  )
}

function CopyMetadataMenu({
  fileMetadata: { name, type, size },
  onCopy,
  clipboard,
  theme,
  ...props
}) {
  return (
    <Menu
      onClose={() => null}
      popperProps={{
        placement: 'left-start',
        modifiers: { offset: { offset: '0, -3' } },
      }}
      theme={theme}
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

function readFile(file, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.addEventListener('error', err => {
      reject(err)
    })
    if (type === 'data-uri') {
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

export default ({ path, onMessage, file, onClose, clipboard, theme }) => {
  const handleInsert = async (type, object = false) => {
    let data = await readFile(file, type === 'text' ? 'text' : 'data-uri')
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
        modifiers: { offset: { offset: '0, 3' } },
      }}
      theme={theme}
      onClose={onClose}
    >
      <MenuItem onClick={() => handleInsert('data-uri')}>
        Insert as Data URI
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
            theme={theme}
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
            theme={theme}
          />
        }
      >
        Copy Metadata
      </MenuItem>
    </Menu>
  )
}
