import { describe, expect, test } from 'vitest'
import { updateTree } from '../state'

describe('clipboard', () => {
  test('cut and paste', () => {
    const result1 = updateTree(
      {
        name: 'root',
        value: { input: { a: 1, b: 2, c: 3 } },
        state: { _showOnly: ['input'], input: { _expanded: true } },
      },
      { path: ['input', 'a'], action: 'deleteNode' }
    )
    const result2 = updateTree(result1, {
      path: ['input', 'b'],
      action: 'insert',
      value: { a: 1 }, // TODO: use clipboard for this value
      state: { a: { _expanded: false, _view: null } },
      position: 'below',
      paste: true,
    })
    expect(result2['value']['input']).toEqual({ b: 2, a: 1, c: 3 })
  })

  test('copy and paste', () => {
    const result1 = updateTree(
      {
        name: 'root',
        value: { input: { a: 1, b: 2, c: 3 } },
        state: { _showOnly: ['input'], input: { _expanded: true } },
      },
      {
        path: ['input', 'b'],
        action: 'insert',
        value: { b: 2 }, // TODO: use clipboard for this value
        state: { a: { _expanded: false, _view: null } },
        position: 'below',
        paste: true,
      }
    )
    expect(result1['value']['input']).toEqual({ a: 1, b: 2, b1:2, c: 3 })
  })
})
