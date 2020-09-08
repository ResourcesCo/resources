import insert from './insert'

describe('insert', () => {
  it('should insert after', () => {
    const message = {
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
    const result = insert(message, {
      action: 'insert',
      path: ['a', 'b'],
      position: 'below',
    })
    expect(Object.keys(result['value']['a']).length).toBe(2)
  })
})
