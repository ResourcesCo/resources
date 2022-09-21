import { describe, expect, test } from 'vitest'
import { insert, rename, edit } from '../actions'

describe('insert', () => {
  test('insert after', () => {
    let message: any = {
      name: 'root',
      state: {
        _expanded: true,
        a: {
          _expanded: true,
        },
      },
      value: {
        a: {
          b: 'c',
        },
      },
    }
    message = insert(message, {
      action: 'insert',
      path: ['a', 'b'],
      position: 'below',
    })
    message = rename(message, {
      action: 'rename',
      path: ['a', 'newName'],
      name: 'red',
      editing: false,
      enter: true,
      tab: false,
      value: 'red',
    })
    message = edit(message, {
      action: 'edit',
      path: ['a', 'red'],
      value: 'foo',
      editing: false,
    })
    expect(Object.keys(message['value']['a'])).toEqual(['b', 'red'])
    expect(message['value']['a']['red']).toEqual('foo')
  })
})
