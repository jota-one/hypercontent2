function cleanIndexInPath(pathPart: string) {
  return pathPart.startsWith('[') ? pathPart.replace(/\D/g, '') : pathPart
}

export function get(obj: any, path: string, defaultValue = {}) {
  const result = path.split('.').reduce((r, p) => {
    if (typeof r === 'object' && r !== null) {
      p = cleanIndexInPath(p)

      return r[p]
    }

    return undefined
  }, obj)

  return result === undefined ? defaultValue : result
}

export function pascalToKebab(input: string) {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export function kebabToPascal(input: string) {
  return input.replace(/_(\w)/gmi, (_, g1) => g1.toUpperCase())
}

export function resolveEndpointDefPlaceholders(pathOrParams: any, values = {}) {
  const replaceInString = (input = '') => {
    const placeholders = input.match(/{(\w+\.?)+\w+}/gim) || []

    for (const placeholder of placeholders) {
      input = input.replaceAll(
        placeholder,
        get(values, placeholder.replace(/^{(.*)}$/gim, '$1'), ''),
      )
    }

    return input
  }

  if (typeof pathOrParams === 'object') {
    return Object.entries(pathOrParams).reduce((acc, [key, value]) => {
      const replaced = replaceInString(value as string)

      if (!replaced) {
        return acc
      }

      acc += acc ? '&' : '?'
      return acc + `${key}=${replaced}`
    }, '')
  } else if (pathOrParams) {
    return replaceInString(pathOrParams)
  }

  return pathOrParams
}