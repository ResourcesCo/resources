import { describe, expect, test } from 'vitest'
import { set } from '../actions'

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
    message = set(message, {
      action: 'insert',
      path: ['a', 'b'],
      value: 'foo',
    })
    expect(message['value']['a']['b']).toEqual('foo')
  })
})
