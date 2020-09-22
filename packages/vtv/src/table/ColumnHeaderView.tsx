import React from 'react'
import NameButton from '../generic/NameButton'

export default function ColumnHeaderView({ children, context }) {
  return <NameButton context={context}>{children}</NameButton>
}
