import React from 'react'
import { sanitizeUrl } from '@braintree/sanitize-url'

export default function ImageView({ value }) {
  return (
    <div>
      <img
        className="vtv--image-view--image"
        src={value.startsWith('data:') ? value : sanitizeUrl(value) || '#'}
      />
    </div>
  )
}
