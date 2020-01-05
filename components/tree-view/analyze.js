export const isObject = item => {
  return typeof item === 'object' && item !== null && !Array.isArray(item)
}

export const getPaths = (item, depth) => {
  let result = []
  if (isObject(item)) {
    for (let key of Object.keys(item)) {
      if (isObject(item[key])) {
        if (depth > 0) {
          result = result.concat(
            getPaths(item[key], depth - 1)
            .map(result => [key, ...result])
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
  for (let item of collection) {
    for (let path of getPaths(item, 2)) {
      const str = JSON.stringify(path)
      paths[str] = paths[str] || 0
      paths[str] += 1
    }
  }
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
