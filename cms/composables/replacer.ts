export const getReplacer = (pattern: RegExp) => {
  return function (str = '', ...maps: any[]) {
    if (!str) {
      return ''
    }

    const params = maps
      .reverse()
      .reduce((acc: any[], map: any[]) => ({ ...acc, ...map }))

    return str.replace(pattern, function (term, key) {
      return params[key] !== undefined ? params[key] : term
    })
  }
}

export const getExtractor = (pattern: RegExp) => {
  return function (str: string) {
    if (!str) {
      return []
    }

    let match
    const result = []
    while ((match = pattern.exec(str))) {
      result.push(match[1])
    }

    return result
  }
}

export const replace = getReplacer(/{([^{}]+)}/gim)
export const extractPlaceholders = getExtractor(/{([^{}]+)}/gim)
export const replaceExpress = getReplacer(/:(\w+)/g)
