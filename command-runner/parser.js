const getNextToken = input => {
  let remainingInput = input.trim()
  if (remainingInput[0] === '"') {
    remainingInput = remainingInput.substr(1)
    const match = /(^|[^\\])"(\s|$)/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length)
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
        remainingInput.substr(match.index + match[0].length)
      ]
    } else {
      return [false, '']
    }
  } else if (remainingInput[0] === "`") {
    remainingInput = remainingInput.substr(1)
    const match = /(^|[^\\])`(\s|$)/.exec(remainingInput)
    if (match) {
      return [
        remainingInput.substr(0, match.index + 1),
        remainingInput.substr(match.index + match[0].length)
      ]
    } else {
      return [false, '']
    }
  } else {
    const splitText = remainingInput.split(/\s+/)
    return [splitText[0], remainingInput.substr(splitText[0].length + 1)]
  }
}

export default input => {
  const result = []
  let remainingInput = input
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
