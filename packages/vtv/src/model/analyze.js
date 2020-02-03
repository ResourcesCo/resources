import j2ref from 'j2ref'

export const isObject = value => {
  return (
    typeof value === 'object' &&
    typeof value !== 'string' &&
    value !== null &&
    !Array.isArray(value)
  )
}

export const getPaths = (item, depth = 2) => {
  let result = []
  if (isObject(item)) {
    for (let key of Object.keys(item)) {
      if (isObject(item[key])) {
        if (depth > 0) {
          result = result.concat(
            getPaths(item[key], depth - 1).map(result => [key, ...result])
          )
        }
      } else if (!Array.isArray(item[key])) {
        result.push([key])
      }
    }
  }
  return result
}

export const getCollectionPaths = collection => {
  const paths = {}
  const values = Array.isArray(collection)
    ? collection
    : Object.keys(collection).map(key => collection[key])
  for (let item of values) {
    for (let path of getPaths(item)) {
      const str = JSON.stringify(path)
      paths[str] = paths[str] || 0
      paths[str] += 1
    }
  }
  return Object.keys(paths).map(path => JSON.parse(path))
}

export const detectUrl = str => {
  return /^https?:\/\//.test(str)
}

export const hasChildren = value => {
  if (isObject(value)) {
    return Object.keys(value).length > 0
  } else if (Array.isArray(value)) {
    return value.length > 0
  } else {
    return false
  }
}

export const getAtPath = (value, path) => {
  if (path.length === 0) {
    return value
  } else {
    const [key, ...rest] = path
    if (typeof value === 'object' && value !== null) {
      return getAtPath(value[key], rest)
    }
  }
}

export const isIdentifier = s => {
  return /^[a-zA-Z_$]\S*$/.test(s)
}

export const joinPath = path => {
  let result = ''
  for (let i = 0; i < path.length; i++) {
    if (isIdentifier(path[i])) {
      result += (i === 0 ? '' : '.') + path[i]
    } else {
      result += `[${JSON.stringify(path[i])}]`
    }
  }
  return result
}

export const splitPath = str => {
  if (str[0] === '[') {
    const result = j2ref(`$${str}`)
    if (result && result.keys) {
      return result.keys.slice(1)
    }
  } else {
    const result = j2ref(str)
    if (result) {
      return result.keys
    }
  }
}

export const isBasicType = value => {
  if (typeof value === 'string') {
    return true
  } else if (value !== null && typeof value === 'object') {
    return false
  } else {
    return true
  }
}
