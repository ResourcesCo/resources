import React from 'react'
import sanitizeUrl from '@braintree/sanitize-url'

export default function ImageView({ value, state, theme }) {
  return (
    <div>
      <img
        src={value.startsWith('data:') ? value : sanitizeUrl(value) || '#'}
      />
      <style jsx>{`
        img {
          max-height: 300px;
        }
      `}</style>
    </div>
  )
}
