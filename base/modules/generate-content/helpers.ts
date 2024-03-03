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