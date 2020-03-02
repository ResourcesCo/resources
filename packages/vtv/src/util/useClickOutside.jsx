import React, { useRef, useEffect } from 'react'

// from https://stackoverflow.com/a/42234988/3461

export default (ref, callback) => {
  const handler = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  })
}

// const ref = useRef(null)
// useClickOutside(ref, onClick)
// return <div ref={ref}>Click outside me</div>
