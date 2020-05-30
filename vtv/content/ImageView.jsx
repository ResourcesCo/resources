import React from 'react'

export default function ImageView({ value, state, theme }) {
  return (
    <div>
      <img src={value} />
      <style jsx>{`
        img {
          max-height: 300px;
        }
      `}</style>
    </div>
  )
}
