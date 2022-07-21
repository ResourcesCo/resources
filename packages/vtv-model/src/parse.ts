const getNextToken = input => {
  let remainingInput = input.trim()

  if (remainingInput[0] === '{' || remainingInput[0] === '[') {
    const matchingBracket = { '{': '}', '[': ']' }[remainingInput[0]]
    let i = remainingInput.lastIndexOf(matchingBracket)
    let last = true
    while (i !== -1) {
      const str = remainingInput.substr(0, i + 1)
      let parsed
      try {
        parsed = JSON.parse(str)
        return [str, remainingInput.substr(str.length)]
      } catch (e) {
        parsed = null
      }
      if (last) {
        last = false
        i = 0
      }
      i = remainingInput.indexOf(matchingBracket, i + 1)
    }
  }

  if (remainingInput[0] === '"') {
    remainingInput = remainingInput.substr(1)
    const match = /(^|[^\\])"(\s|$)/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length),
      ]
    } else {
      return [false, '']
    }
  } else if (remainingInput[0] === "'") {
    remainingInput = remainingInput.substr(1)
    const match = /(^|[^\\])'(\s|$)/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length),
      ]
    } else {
      return [false, '']
    }
  } else if (remainingInput[0] === '`') {
    remainingInput = remainingInput.substr(1)
    let match = /(^|[^\\])`$/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length),
      ]
    }
    match = /(^|[^\\])`(\s|$)/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length),
      ]
    }
    return [false, '']
  } else {
    const splitText = remainingInput.split(/\s+/)
    return [splitText[0], remainingInput.substr(splitText[0].length + 1)]
  }
}

export function parseCommand(input) {
  const result = []
  let remainingInput = input.trim()
  while (remainingInput.trim().length > 0) {
    const [token, _remainingInput] = getNextToken(remainingInput)
    if (token === false) {
      return
    }
    result.push(token)
    remainingInput = _remainingInput
  }
  return result
}
